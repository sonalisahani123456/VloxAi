import express from 'express';
import {
  generateOutline,
  polishText,
  generateSeoTags,
  chatCopilot,
  generateVlogScript,
  generateHeadlineAB,
  factCheckDraft,
  generateShotList,
  generateAutoCaptions,
  generateBRollSuggestions,
  analyzeVoiceDna,
  simulateAudience,
} from '../controllers/aiController.js';

const router = express.Router();

router.post('/outline', generateOutline);
router.post('/polish', polishText);
router.post('/seo', generateSeoTags);
router.post('/chat', chatCopilot);
router.post('/vlog-script', generateVlogScript);
router.post('/headline-ab', generateHeadlineAB);
router.post('/fact-check', factCheckDraft);
router.post('/shot-list', generateShotList);
router.post('/auto-captions', generateAutoCaptions);
router.post('/b-roll', generateBRollSuggestions);
router.post('/voice-dna', analyzeVoiceDna);
router.post('/audience-simulator', simulateAudience);

export default router;
