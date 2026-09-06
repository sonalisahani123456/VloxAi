import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    subTitle: { type: String, default: '' },
    category: { type: String, default: 'Technology' },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    claps: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    isPrivate: { type: Boolean, default: false },
    isUserCreated: { type: Boolean, default: true },
    tags: [{ type: String }],
    author: { type: String, default: 'Vlox Creator' },
  },
  { timestamps: true }
);

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

