import mongoose from 'mongoose';

const clipSchema = new mongoose.Schema({
  sourceId: { type: String },
  title: { type: String },
  inPoint: { type: Number, default: 0 },
  outPoint: { type: Number, default: 15 },
  trackStart: { type: Number, default: 0 },
  speed: { type: Number, default: 1 },
  transitionIn: { type: String, default: 'none' },
  transitionOut: { type: String, default: 'none' },
  filter: { type: String, default: 'none' },
  color: { type: String },
  textOverlay: {
    content: { type: String, default: '' },
    x: { type: Number, default: 50 },
    y: { type: Number, default: 80 },
    font: { type: String, default: 'Outfit' },
    animation: { type: String, default: 'fade' },
  },
});

const trackSchema = new mongoose.Schema({
  type: { type: String, enum: ['video', 'audio', 'caption', 'text'], required: true },
  clips: [clipSchema],
});

const commentSchema = new mongoose.Schema({
  _id: { type: String, default: () => `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}` },
  timestamp: { type: Number, required: true },
  author: { type: String, default: 'Vlox Creator' },
  text: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const edlSchema = new mongoose.Schema({
  tracks: [trackSchema],
  comments: [commentSchema],
  version: { type: Number, default: 1 },
});

const vlogSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    aspectRatio: { type: String, default: '16:9' },
    filterStyle: { type: String, default: 'Cyberpunk' },
    durationSeconds: { type: Number, default: 120 },
    avatar: {
      id: { type: String },
      name: { type: String },
      voice: { type: String },
      script: { type: String },
      avatarImg: { type: String },
      color: { type: String },
    },
    clips: [clipSchema],
    edl: edlSchema,
    renderStatus: {
      status: { type: String, enum: ['idle', 'rendering', 'completed', 'failed'], default: 'idle' },
      progress: { type: Number, default: 0 },
      downloadUrl: { type: String, default: '' },
    },
    publishedPlatforms: [{ type: String }],
    isPrivate: { type: Boolean, default: false },
    isUserCreated: { type: Boolean, default: true },
    lastModified: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const Vlog = mongoose.models.Vlog || mongoose.model('Vlog', vlogSchema);
