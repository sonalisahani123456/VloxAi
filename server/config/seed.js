import { Blog } from '../models/Blog.js';
import { Vlog } from '../models/Vlog.js';

export const SEED_BLOGS = [
  {
    _id: 'blog_1',
    title: 'Building Scalable 3D Web Applications with Three.js & React 19',
    subTitle: 'A comprehensive engineering guide to WebGL rendering, ambient lighting, and high-performance particle meshes in modern browser engines.',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    description: '<h2>Introduction</h2><p>As browser graphics capabilities reach desktop-class performance, integrating 3D WebGL scenes directly into web applications has shifted from a novelty to a powerful user experience differentiator.</p><h2>1. WebGL Scene Hierarchy</h2><p>When orchestrating 3D environments in React 19, managing GPU buffer allocations and frame loop update frequencies is paramount.</p><ul><li><strong>Particle Systems:</strong> Low-cost point light arrays with instanced buffer geometries.</li><li><strong>Mouse Parallax:</strong> Smooth dampening vectors calculated via RequestAnimationFrame listeners.</li></ul><blockquote>"Great 3D web design isn\'t about heavy geometry—it is about ambient light, subtle motion physics, and clean composition."</blockquote><h2>2. Best Practices for 2026</h2><p>Leverage Vite build target optimizations and chunk dynamic imports to maintain high Core Web Vitals while running complex canvas shaders.</p>',
    claps: 142,
    views: 1890,
    isPublished: true,
    isPrivate: false,
    isUserCreated: false,
    tags: ['threejs', 'react19', 'webgl', '3d-graphics'],
    createdAt: new Date('2026-08-01T10:00:00.000Z'),
  },
  {
    _id: 'blog_2',
    title: 'The AI Creator Stack: From Neural Voice Synthesis to 1-Click Publishing',
    subTitle: 'How next-generation digital avatars and automated video timelines are reshaping content production velocity for startup founders.',
    category: 'AI & Machine Learning',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    description: '<h2>The Content Explosion</h2><p>Modern audiences consume content across fragmented channels—from vertical TikTok shorts to widescreen YouTube breakdown videos.</p><h2>Neural Presenters</h2><p>Digital AI avatars powered by real-time lipsync synthesis reduce video editing overhead by up to 80% while retaining authentic human expression.</p>',
    claps: 98,
    views: 1240,
    isPublished: true,
    isPrivate: false,
    isUserCreated: false,
    tags: ['ai-avatars', 'voice-synthesis', 'content-creation'],
    createdAt: new Date('2026-08-04T14:30:00.000Z'),
  },
  {
    _id: 'blog_3',
    title: 'Design Systems for Liquid Glass & Cyberpunk Aesthetics',
    subTitle: 'Exploring high-contrast neon accents, backdrop blur layers, and responsive UI card elevation patterns.',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=80',
    description: '<h2>Beyond Flat Design</h2><p>Glassmorphism combined with glowing border strokes creates tactile, futuristic depth for dashboard applications.</p>',
    claps: 76,
    views: 940,
    isPublished: true,
    isPrivate: false,
    isUserCreated: false,
    tags: ['glassmorphism', 'cyberpunk', 'ui-design'],
    createdAt: new Date('2026-08-08T09:15:00.000Z'),
  },
];

export const SEED_VLOGS = [
  {
    _id: 'vlog-demo-1',
    id: 'vlog-demo-1',
    title: 'Future of AI Avatars & Spatial Computing in 2026',
    aspectRatio: '16:9',
    filterStyle: 'Cyberpunk',
    durationSeconds: 165,
    avatar: {
      id: 'aria-tech',
      name: 'Aria - Tech Presenter',
      voice: 'Neural Female Studio',
      avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      script: 'Welcome back to the Studio! Today we are exploring the neural rendering avatars transforming video content generation.',
    },
    clips: [
      { id: 'c1', title: 'Cyber City Intro 3D', duration: 15, track: 'video', color: '#6366f1' },
      { id: 'c2', title: 'Aria Avatar Presenter', duration: 45, track: 'video', color: '#06b6d4' },
      { id: 'c3', title: 'Spatial Mesh Demo', duration: 30, track: 'video', color: '#ec4899' },
      { id: 'c4', title: 'Synth Ambient Track', duration: 90, track: 'audio', color: '#10b981' },
      { id: 'c5', title: 'Auto Subtitles (En)', duration: 90, track: 'subtitle', color: '#f59e0b' },
    ],
    publishedPlatforms: ['youtube', 'twitter', 'linkedin'],
    isPrivate: false,
    isUserCreated: false,
    lastModified: '2026-08-10T12:00:00.000Z',
  },
  {
    _id: 'vlog-demo-2',
    id: 'vlog-demo-2',
    title: '10x Your Productivity with AI Workflow Automation',
    aspectRatio: '9:16',
    filterStyle: 'Neon Matrix',
    durationSeconds: 58,
    avatar: {
      id: 'kael-cyber',
      name: 'Cyber Kael - Futurist',
      voice: 'Synth Cyber Male',
      avatarImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      script: 'Stop doing manual editing! Here are 3 tools to automate your vlog creation in under 60 seconds.',
    },
    clips: [
      { id: 'c10', title: 'Shorts Hook Graphic', duration: 8, track: 'video', color: '#ec4899' },
      { id: 'c11', title: 'Kael AI Presenter', duration: 35, track: 'video', color: '#06b6d4' },
      { id: 'c12', title: 'Dynamic Kinetic Text', duration: 50, track: 'subtitle', color: '#f59e0b' },
    ],
    publishedPlatforms: ['instagram', 'tiktok'],
    isPrivate: false,
    isUserCreated: false,
    lastModified: '2026-08-09T18:30:00.000Z',
  },
];

export const seedDatabase = async () => {
  try {
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.insertMany(SEED_BLOGS);
      console.log('🌱 Seeded initial Blogs into MongoDB database');
    }

    const vlogCount = await Vlog.countDocuments();
    if (vlogCount === 0) {
      await Vlog.insertMany(SEED_VLOGS);
      console.log('🌱 Seeded initial Vlogs into MongoDB database');
    }
  } catch (error) {
    console.warn('⚠️ Seed Database Warning:', error.message);
  }
};
