import { Blog } from '../models/Blog.js';

export const getBlogs = async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};
    if (category && category !== 'All') query.category = { $regex: new RegExp(category, 'i') };
    if (search) {
      query.$or = ['title', 'subTitle', 'category'].map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
    }
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, count: blogs.length, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not load stories.' });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Story not found.' });
    return res.json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not load this story.' });
  }
};

export const createBlog = async (req, res) => {
  try {
    if (!req.body.title?.trim() || !req.body.description?.trim()) {
      return res.status(400).json({ success: false, message: 'A title and story content are required.' });
    }
    const id = req.body._id || `blog_${Date.now()}`;
    const blog = await Blog.create({ ...req.body, _id: id });
    return res.status(201).json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not publish this story.' });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Story not found.' });
    return res.json({ success: true, blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not update this story.' });
  }
};

export const toggleBlogVisibility = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Story not found.' });
    blog.isPrivate = !blog.isPrivate;
    await blog.save();
    return res.json({ success: true, isPrivate: blog.isPrivate });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not change story visibility.' });
  }
};

export const clapBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, { $inc: { claps: 1 } }, { new: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Story not found.' });
    return res.json({ success: true, claps: blog.claps });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not add a clap.' });
  }
};

export const incrementBlogViews = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Story not found.' });
    return res.json({ success: true, views: blog.views });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not record this view.' });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Story not found.' });
    return res.json({ success: true, message: 'Story deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Could not delete this story.' });
  }
};
