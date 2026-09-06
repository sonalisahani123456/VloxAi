import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Blogcard from '../components/Blogcard';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Heart,
  Share2,
  Bookmark,
  Volume2,
  Pause,
  Play,
  MessageSquare,
  Send,
  Sparkles,
  Check,
} from 'lucide-react';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '../components/SocialIcons';

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogs, updateBlog, showToast } = useBlog();

  const blog = blogs.find((b) => b._id === id);

  const [fontSize, setFontSize] = useState(16); // px
  const [claps, setClaps] = useState(blog ? blog.claps || 24 : 24);
  const [hasClapped, setHasClapped] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Audio Text to Speech simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Comments state
  const [comments, setComments] = useState([
    {
      id: 'c-1',
      author: 'Alex Vance',
      avatar: 'A',
      text: 'This guide completely revolutionized how our team plans startup roadmaps! Loved point #4 about core value.',
      time: '2 hours ago',
    },
    {
      id: 'c-2',
      author: 'Sophia Chen',
      avatar: 'S',
      text: 'The AI integration insights are super practical. Would love to see a follow-up video on avatar lipsync setup.',
      time: '5 hours ago',
    },
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    let timer;
    if (isPlayingAudio) {
      timer = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 2;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlayingAudio]);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-32">
          <h2 className="text-3xl font-bold text-white font-outfit">Blog Post Not Found</h2>
          <p className="text-slate-400 mt-2">The requested story does not exist or was removed.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold"
          >
            Back to Library
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleClap = () => {
    const newClaps = claps + 1;
    setClaps(newClaps);
    setHasClapped(true);
    updateBlog(blog._id, { claps: newClaps });
    showToast('👏 Added your clap to this story!');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newC = {
      id: 'c-' + Date.now(),
      author: 'Vlox User',
      avatar: 'U',
      text: newCommentText,
      time: 'Just now',
    };
    setComments([newC, ...comments]);
    setNewCommentText('');
    showToast('💬 Comment posted successfully!');
  };

  // Related blogs filter
  const relatedBlogs = blogs
    .filter((b) => b._id !== blog._id && b.category === blog.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Story Header Hero */}
        <article className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </button>

          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              {blog.category}
            </span>
            <span className="text-xs text-slate-400">
              Published on {new Date(blog.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight font-outfit">
            {blog.title}
          </h1>

          {blog.subTitle && (
            <p className="text-lg sm:text-xl text-indigo-300/90 font-medium mt-3 leading-relaxed">
              {blog.subTitle}
            </p>
          )}

          {/* Author Bar */}
          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-white">
                  V
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Vlox Editor Team</h4>
                <p className="text-xs text-slate-400">Verified Creator Studio</p>
              </div>
            </div>

            {/* Quick Reader Toolbar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Bookmark story"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={() => setShareModalOpen(true)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Share story"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Font Size Adjuster */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs text-slate-300">
                <button
                  onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                  className="px-2 py-1 hover:bg-slate-800 rounded"
                >
                  A-
                </button>
                <span className="font-mono text-[10px] text-slate-400">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                  className="px-2 py-1 hover:bg-slate-800 rounded"
                >
                  A+
                </button>
              </div>
            </div>
          </div>

          {/* Text to Speech Narration Bar */}
          <div className="mt-6 p-4 rounded-2xl glass-panel border border-indigo-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer shrink-0"
              >
                {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Listen to AI Audio Narration</span>
                </p>
                <p className="text-[11px] text-slate-400">Neural Studio Voice • 2.5 min duration</p>
              </div>
            </div>

            {/* Audio Progress Bar */}
            <div className="hidden sm:block flex-1 mx-4">
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Featured Cover Image */}
          {blog.image && (
            <div className="mt-8 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl aspect-video w-full bg-slate-900">
              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* HTML Prose Content Body */}
          <div
            className="mt-8 glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800/80 text-slate-200 leading-relaxed font-sans prose prose-invert max-w-none prose-headings:font-outfit prose-headings:text-white prose-h1:text-3xl prose-h2:text-2xl prose-a:text-indigo-400"
            style={{ fontSize: `${fontSize}px` }}
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />

          {/* Like / Clap Action Bar */}
          <div className="mt-10 p-6 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleClap}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  hasClapped
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 scale-105'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-pink-500/50 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${hasClapped ? 'fill-current' : ''}`} />
                <span>{claps} Claps</span>
              </button>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Give this story a clap if you found it useful!
              </span>
            </div>

            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Share</span>
            </button>
          </div>

          {/* Interactive Comments Section */}
          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white font-outfit flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
                <span>Discussion ({comments.length})</span>
              </h3>
            </div>

            {/* Comment Form Input */}
            <form onSubmit={handleAddComment} className="mb-8">
              <div className="relative rounded-2xl glass-panel p-2 border border-slate-800 focus-within:border-indigo-500">
                <textarea
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share your thoughts on this story..."
                  className="w-full bg-transparent p-3 text-sm text-white placeholder-slate-400 focus:outline-none resize-none"
                />
                <div className="flex justify-end pt-2 border-t border-slate-800/60 px-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    <span>Post Comment</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Comment Cards List */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl glass-panel border border-slate-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-300">
                        {c.avatar}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{c.author}</h5>
                        <span className="text-[10px] text-slate-400">{c.time}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 pl-10 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Related Stories */}
        {relatedBlogs.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 py-12 border-t border-slate-800/80">
            <h3 className="text-2xl font-bold text-white mb-6 font-outfit">Related Stories in {blog.category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedBlogs.map((b) => (
                <Blogcard key={b._id} blog={b} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {shareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl glass-panel-glow border border-indigo-500/30 p-6 text-slate-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white font-outfit">Share Story</h3>
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-6">Spread this story across your favorite networks:</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => {
                    showToast('Shared to Twitter/X!');
                    setShareModalOpen(false);
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-xs font-medium cursor-pointer"
                >
                  <TwitterIcon className="w-5 h-5 text-cyan-400" />
                  <span>Twitter / X</span>
                </button>

                <button
                  onClick={() => {
                    showToast('Shared to LinkedIn!');
                    setShareModalOpen(false);
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-xs font-medium cursor-pointer"
                >
                  <LinkedinIcon className="w-5 h-5 text-blue-400" />
                  <span>LinkedIn</span>
                </button>

                <button
                  onClick={() => {
                    showToast('Shared to Facebook!');
                    setShareModalOpen(false);
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-xs font-medium cursor-pointer"
                >
                  <FacebookIcon className="w-5 h-5 text-indigo-400" />
                  <span>Facebook</span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="truncate mr-2">{window.location.href}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Link copied to clipboard!');
                    setShareModalOpen(false);
                  }}
                  className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[11px] shrink-0"
                >
                  Copy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Blog;
