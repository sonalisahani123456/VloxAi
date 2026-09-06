import mongoose from 'mongoose';

// OAuth access tokens are encrypted before being stored. The browser only ever
// receives connection metadata, never a platform token.
const platformConnectionSchema = new mongoose.Schema(
  {
    workspaceId: { type: String, required: true, index: true },
    platform: { type: String, required: true },
    accountLabel: { type: String, default: '' },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, default: '' },
    expiresAt: { type: Date },
    scopes: [{ type: String }],
  },
  { timestamps: true }
);

platformConnectionSchema.index({ workspaceId: 1, platform: 1 }, { unique: true });

export const PlatformConnection = mongoose.models.PlatformConnection || mongoose.model('PlatformConnection', platformConnectionSchema);
