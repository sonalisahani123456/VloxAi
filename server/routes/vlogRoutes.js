import express from 'express';
import {
  getVlogs,
  getVlogById,
  saveVlog,
  toggleVlogVisibility,
  deleteVlog,
  startRenderJob,
  getRenderStatus,
} from '../controllers/vlogController.js';

const router = express.Router();

router.get('/', getVlogs);
router.get('/:id', getVlogById);
router.post('/', saveVlog);
router.put('/:id', saveVlog);
router.patch('/:id/toggle-visibility', toggleVlogVisibility);
router.delete('/:id', deleteVlog);

router.post('/:id/render', startRenderJob);
router.get('/:id/render-status', getRenderStatus);

export default router;
