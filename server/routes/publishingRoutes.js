import express from 'express';
import { getConnectionStatus, oauthCallback, startOAuth } from '../controllers/publishingController.js';

const router = express.Router();
router.get('/connections', getConnectionStatus);
router.get('/:platform/connect', startOAuth);
router.get('/:platform/callback', oauthCallback);

export default router;
