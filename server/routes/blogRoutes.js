import express from 'express';
import {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  toggleBlogVisibility,
  deleteBlog,
  clapBlog,
  incrementBlogViews,
} from '../controllers/blogController.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.patch('/:id/toggle-visibility', toggleBlogVisibility);
router.patch('/:id/clap', clapBlog);
router.patch('/:id/view', incrementBlogViews);
router.delete('/:id', deleteBlog);

export default router;
