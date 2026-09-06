import crypto from 'crypto';
import { PlatformConnection } from '../models/PlatformConnection.js';

const pendingAuthorizations = new Map();
const APP_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const providers = {
  youtube: {
    label: 'YouTube', clientId: 'GOOGLE_CLIENT_ID', clientSecret: 'GOOGLE_CLIENT_SECRET',
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth', tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly'],
  },
  linkedin: {
    label: 'LinkedIn', clientId: 'LINKEDIN_CLIENT_ID', clientSecret: 'LINKEDIN_CLIENT_SECRET',
    authorizeUrl: 'https://www.linkedin.com/oauth/v2/authorization', tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: ['openid', 'profile', 'w_member_social'],
  },
  x: {
    label: 'X', clientId: 'X_CLIENT_ID', clientSecret: 'X_CLIENT_SECRET',
    authorizeUrl: 'https://twitter.com/i/oauth2/authorize', tokenUrl: 'https://api.x.com/2/oauth2/token',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'], pkce: true,
  },
  instagram: {
    label: 'Instagram', clientId: 'META_APP_ID', clientSecret: 'META_APP_SECRET',
    authorizeUrl: 'https://www.facebook.com/v20.0/dialog/oauth', tokenUrl: 'https://graph.facebook.com/v20.0/oauth/access_token',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list', 'pages_read_engagement'],
  },
  tiktok: {
    label: 'TikTok', clientId: 'TIKTOK_CLIENT_KEY', clientSecret: 'TIKTOK_CLIENT_SECRET',
    authorizeUrl: 'https://www.tiktok.com/v2/auth/authorize/', tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
    scopes: ['user.info.basic', 'video.publish', 'video.upload'],
  },
};

const getProvider = (platform) => providers[platform?.toLowerCase()];
const callbackUrl = (platform) => `${process.env.PUBLIC_API_URL || 'http://localhost:5000'}/api/publishing/${platform}/callback`;

const encryptionKey = () => {
  const value = process.env.OAUTH_TOKEN_ENCRYPTION_KEY || '';
  return /^[a-fA-F0-9]{64}$/.test(value) ? Buffer.from(value, 'hex') : null;
};

const encrypt = (value) => {
  const key = encryptionKey();
  if (!key) throw new Error('OAUTH_TOKEN_ENCRYPTION_KEY must be a 64-character hexadecimal secret.');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return `${iv.toString('base64')}.${cipher.getAuthTag().toString('base64')}.${encrypted.toString('base64')}`;
};

const safeReturnUrl = (value) => {
  try {
    const requested = new URL(value || APP_URL);
    return requested.origin === new URL(APP_URL).origin ? requested.toString() : APP_URL;
  } catch { return APP_URL; }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const workspaceId = req.query.workspaceId;
    if (!workspaceId) return res.status(400).json({ success: false, message: 'A workspace id is required.' });
    const connections = await PlatformConnection.find({ workspaceId }).select('platform accountLabel createdAt updatedAt').lean();
    return res.json({ success: true, connections });
  } catch { return res.status(500).json({ success: false, message: 'Could not load publishing connections.' }); }
};

export const startOAuth = (req, res) => {
  const platform = req.params.platform?.toLowerCase();
  const provider = getProvider(platform);
  const workspaceId = req.query.workspaceId;
  if (!provider || !workspaceId) return res.status(400).json({ success: false, message: 'Unsupported platform or missing workspace.' });
  if (!process.env[provider.clientId] || !process.env[provider.clientSecret] || !encryptionKey()) {
    return res.status(503).json({ success: false, message: `${provider.label} OAuth is not configured on this server yet. Add its client ID, client secret and OAUTH_TOKEN_ENCRYPTION_KEY to server/.env.` });
  }
  const state = crypto.randomBytes(24).toString('hex');
  const verifier = provider.pkce ? crypto.randomBytes(48).toString('base64url') : '';
  pendingAuthorizations.set(state, { platform, workspaceId, returnUrl: safeReturnUrl(req.query.returnUrl), verifier, createdAt: Date.now() });
  const params = new URLSearchParams({ client_id: process.env[provider.clientId], redirect_uri: callbackUrl(platform), response_type: 'code', state, scope: provider.scopes.join(' ') });
  if (platform === 'youtube') params.set('access_type', 'offline');
  if (platform === 'youtube') params.set('prompt', 'consent');
  if (provider.pkce) { params.set('code_challenge_method', 'S256'); params.set('code_challenge', crypto.createHash('sha256').update(verifier).digest('base64url')); }
  return res.json({ success: true, authorizationUrl: `${provider.authorizeUrl}?${params.toString()}` });
};

export const oauthCallback = async (req, res) => {
  const { code, state, error } = req.query;
  const pending = pendingAuthorizations.get(state);
  pendingAuthorizations.delete(state);
  if (!pending || Date.now() - pending.createdAt > 10 * 60 * 1000) return res.status(400).send('This OAuth session expired. Return to VloxAI and try again.');
  if (error || !code) return res.redirect(`${pending.returnUrl}?oauth=failed&platform=${pending.platform}`);
  const provider = getProvider(pending.platform);
  try {
    const body = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: callbackUrl(pending.platform), client_id: process.env[provider.clientId], client_secret: process.env[provider.clientSecret] });
    if (provider.pkce) body.set('code_verifier', pending.verifier);
    const tokenResponse = await fetch(provider.tokenUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' }, body });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) throw new Error(tokenData.error_description || 'The provider did not return an access token.');
    await PlatformConnection.findOneAndUpdate(
      { workspaceId: pending.workspaceId, platform: pending.platform },
      { workspaceId: pending.workspaceId, platform: pending.platform, accountLabel: provider.label, accessToken: encrypt(tokenData.access_token), refreshToken: tokenData.refresh_token ? encrypt(tokenData.refresh_token) : '', expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null, scopes: provider.scopes },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.redirect(`${pending.returnUrl}?oauth=connected&platform=${pending.platform}`);
  } catch (error) {
    return res.redirect(`${pending.returnUrl}?oauth=failed&platform=${pending.platform}&reason=${encodeURIComponent(error.message)}`);
  }
};
