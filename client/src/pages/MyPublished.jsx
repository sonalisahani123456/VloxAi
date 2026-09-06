import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useBlog } from '../context/BlogContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Globe,
  PenTool,
  Video,
  Eye,
  Edit,
  Trash2,
  Share2,
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
  Play,
  X,
  Volume2,
  Layers,
  CheckCircle2,
  Plus,
  UserRound,
  Bot,
  ArrowRight,
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, TwitterIcon, LinkedinIcon } from '../components/SocialIcons';

const MyPublished = () => {
  const navigate = useNavigate();
  const {
    blogs,
    vlogProjects,
    avatarAssets,
    aiContents,
    toggleBlogVisibility,
    toggleVlogVisibility,
    deleteBlog,
    deleteVlogProject,
    deleteAvatarAsset,
    deleteAiContent,
    publishToPlatforms,
    publishingConnections,
    connectPublishingPlatform,
    showToast,
  } = useBlog();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'blogs' | 'vlogs' | 'avatars' | 'ai' | 'private'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVlogModal, setSelectedVlogModal] = useState(null);
  const [isPlayingModalVideo, setIsPlayingModalVideo] = useState(false);
  const connectedPlatforms = publishingConnections.map((connection) => connection.platform);

  // Consider blogs and vlogs created by user or marked as published
  // We include user-created items or all stored projects
  const userBlogs = blogs
    .filter((b) => b.isUserCreated === true && b.isPublished !== false)
    .map((b) => ({ ...b, mediaType: 'blog' }));
  const userVlogs = vlogProjects
    .filter((v) => v.isUserCreated === true)
    .map((v) => ({ ...v, mediaType: 'vlog' }));
  const userAvatars = avatarAssets
    .filter((asset) => asset.isUserCreated === true)
    .map((asset) => ({ ...asset, mediaType: 'avatar' }));
  const userAiContents = aiContents
    .filter((content) => content.isUserCreated === true)
    .map((content) => ({ ...content, mediaType: 'ai' }));

  const allUserMedia = [...userBlogs, ...userVlogs, ...userAvatars, ...userAiContents].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.lastModified || Date.now());
    const dateB = new Date(b.createdAt || b.lastModified || Date.now());
    return dateB - dateA;
  });

  // Calculate quick stats
  const totalItems = allUserMedia.length;
  const privateCount = allUserMedia.filter((m) => m.isPrivate).length;
  const publicCount = totalItems - privateCount;
  const blogCount = userBlogs.length;
  const vlogCount = userVlogs.length;
  const avatarCount = userAvatars.length;
  const aiCount = userAiContents.length;

  // Filter based on active tab & search query
  const filteredMedia = allUserMedia.filter((item) => {
    // Search query check
    const titleMatch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (item.description || item.avatar?.script || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const searchPass = !searchQuery || titleMatch || descMatch;

    if (!searchPass) return false;

    if (activeTab === 'blogs') return item.mediaType === 'blog';
    if (activeTab === 'vlogs') return item.mediaType === 'vlog';
    if (activeTab === 'avatars') return item.mediaType === 'avatar';
    if (activeTab === 'ai') return item.mediaType === 'ai';
    if (activeTab === 'private') return item.isPrivate === true;

    return true; // 'all'
  });

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          {/* Header & Vault Banner */}
          <div className="relative rounded-3xl p-6 sm:p-10 mb-10 overflow-hidden border border-indigo-500/20 glass-panel shadow-2xl">
            {/* Background ambient glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-pink-600/0 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-3 shadow-inner">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>PERSONAL CREATOR VAULT & PUBLISHED MEDIA</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white font-outfit tracking-tight">
                  My Published & Private Media
                </h1>
                <p className="text-slate-400 text-sm mt-2 max-w-2xl">
                  Manage all your published blog stories and neural AI vlogs in one secure place. Set visibility to <span className="text-emerald-400 font-semibold">Public 🌐</span> for explore discovery or <span className="text-amber-400 font-semibold">Private 🔒 (Only Me)</span> for exclusive access.
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => navigate('/create-blog')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-400 text-xs font-bold transition-all cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Author Blog</span>
                </button>
                <button
                  onClick={() => navigate('/vlog-editor')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Create Vlog</span>
                </button>
                <button
                  onClick={() => navigate('/avatar-editor')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-pink-400/30 bg-pink-500/10 text-pink-200 hover:bg-pink-500/20 text-xs font-bold transition-all cursor-pointer"
                >
                  <UserRound className="w-4 h-4" />
                  <span>Avatar Studio</span>
                </button>
                <button
                  onClick={() => navigate('/ai-editor')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-violet-400/30 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20 text-xs font-bold transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>AI Studio</span>
                </button>
              </div>
            </div>

            {/* Metric Summary Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
              <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
                <p className="text-xs text-slate-400 font-medium">Total Media Items</p>
                <h3 className="text-2xl font-black text-white mt-1 font-outfit">{totalItems}</h3>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
                <p className="text-xs text-slate-400 font-medium">Published Blogs</p>
                <h3 className="text-2xl font-black text-indigo-400 mt-1 font-outfit">{blogCount}</h3>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-slate-800/80">
                <p className="text-xs text-slate-400 font-medium">Published Vlogs</p>
                <h3 className="text-2xl font-black text-cyan-400 mt-1 font-outfit">{vlogCount}</h3>
              </div>
              <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <p className="text-xs text-amber-300 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Private (Only Me)
                </p>
                <h3 className="text-2xl font-black text-amber-400 mt-1 font-outfit">{privateCount}</h3>
              </div>
            </div>
          </div>

          <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-sm font-bold text-white">Publishing destinations</p><p className="mt-1 text-xs text-slate-400">Connect the platforms where you want to publish before using Share & Broadcast.</p></div>
              <span className="text-xs font-bold text-slate-500">{connectedPlatforms.length}/5 connected</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[['youtube', 'YouTube', YoutubeIcon, 'text-red-400'], ['instagram', 'Instagram', InstagramIcon, 'text-pink-400'], ['x', 'X', TwitterIcon, 'text-cyan-300'], ['linkedin', 'LinkedIn', LinkedinIcon, 'text-blue-400'], ['tiktok', 'TikTok', Video, 'text-white']].map(([id, name, Icon, color]) => {
                const connected = connectedPlatforms.includes(id);
                return <button key={id} type="button" onClick={() => { if (!connected) connectPublishingPlatform(id); }} className={`flex items-center justify-between rounded-2xl border p-3 text-left transition ${connected ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-white/10 bg-slate-950/40 hover:border-indigo-300/35'}`}><span className="flex items-center gap-2"><Icon className={`h-4 w-4 ${connected ? 'text-emerald-300' : color}`} /><span className="text-xs font-bold text-white">{name}</span></span><span className={`text-[10px] font-bold ${connected ? 'text-emerald-300' : 'text-slate-500'}`}>{connected ? 'Connected' : 'Connect securely'}</span></button>;
              })}
            </div>
          </section>

          {/* Navigation Filter Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-slate-800 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>All Media</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-indigo-900/50 text-indigo-200">
                  {totalItems}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('avatars')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'avatars' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserRound className="w-3.5 h-3.5" />
                <span>My Avatars</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-pink-900/50 text-pink-200">{avatarCount}</span>
              </button>

              <button
                onClick={() => setActiveTab('ai')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'ai' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>My AI Content</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-violet-900/50 text-violet-200">{aiCount}</span>
              </button>

              <button
                onClick={() => setActiveTab('blogs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'blogs'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>My Blogs</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-indigo-900/50 text-indigo-200">
                  {blogCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('vlogs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'vlogs'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>My Vlogs</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-cyan-900/50 text-cyan-200">
                  {vlogCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('private')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'private'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Private (Only Me)</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-900/50 text-amber-200">
                  {privateCount}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search my media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Media Grid */}
          {filteredMedia.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map((item) => {
                const isBlog = item.mediaType === 'blog';
                const isAvatar = item.mediaType === 'avatar';
                const isAi = item.mediaType === 'ai';
                const itemId = item._id || item.id;
                const isPrivate = item.isPrivate || false;

                if (isAvatar || isAi) {
                  const isAvatarCard = isAvatar;
                  return <motion.div key={itemId} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`overflow-hidden rounded-2xl border bg-slate-950/40 ${isAvatarCard ? 'border-pink-400/25 hover:border-pink-300/55' : 'border-violet-400/25 hover:border-violet-300/55'}`}>
                    <div className={`h-36 ${isAvatarCard ? 'bg-gradient-to-br from-pink-500/30 to-slate-950' : 'bg-gradient-to-br from-violet-500/30 to-slate-950'} p-5`}>
                      {isAvatarCard && item.image ? <img src={item.image} alt="" className="h-16 w-16 rounded-2xl border border-white/30 object-cover shadow-xl" /> : <Bot className="h-10 w-10 text-violet-200" />}
                      <span className="float-right rounded-full bg-slate-950/60 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">{isAvatarCard ? 'Avatar Studio' : 'AI Studio'}</span>
                    </div>
                    <div className="p-5"><p className="text-[11px] font-semibold text-slate-400">{new Date(item.createdAt || item.updatedAt || Date.now()).toLocaleDateString()}</p><h3 className="mt-1 line-clamp-2 font-outfit text-base font-bold text-white">{item.title}</h3><p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-400">{(item.description || item.content || item.script || '').replace(/<[^>]+>/g, '')}</p></div>
                    <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/40 p-4"><button onClick={() => navigate(isAvatarCard ? '/avatar-editor' : '/ai-editor')} className={`text-xs font-bold hover:text-white ${isAvatarCard ? 'text-pink-200' : 'text-violet-200'}`}>Open Studio →</button><button onClick={() => isAvatarCard ? deleteAvatarAsset(itemId) : deleteAiContent(itemId)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-500/20 hover:text-red-400" title="Delete saved content"><Trash2 className="h-4 w-4" /></button></div>
                  </motion.div>;
                }

                return (
                  <motion.div
                    key={itemId}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`glass-panel rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                      isPrivate
                        ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60'
                        : 'border-slate-800 hover:border-indigo-500/50'
                    }`}
                  >
                    <div>
                      {/* Media Header / Image Thumbnail */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                        {isBlog ? (
                          <img
                            src={
                              item.image ||
                              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'
                            }
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
                            {item.avatar?.avatarImg && (
                              <img
                                src={item.avatar.avatarImg}
                                alt={item.avatar.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs"
                              />
                            )}
                            <div className="relative z-10 flex flex-col items-center text-center">
                              <div className="w-12 h-12 rounded-full bg-indigo-600/80 border-2 border-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/50 mb-2 group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 text-white ml-0.5" />
                              </div>
                              <span className="text-xs font-bold text-white bg-slate-950/80 px-3 py-1 rounded-full border border-slate-700">
                                {item.aspectRatio || '16:9'} • {item.filterStyle || 'Cyberpunk'}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md ${
                              isBlog
                                ? 'bg-indigo-600/90 text-white'
                                : 'bg-cyan-600/90 text-white'
                            }`}
                          >
                            {isBlog ? '✍️ BLOG STORY' : '🎬 VLOG STUDIO'}
                          </span>

                          {/* Privacy Toggle Badge */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isBlog) toggleBlogVisibility(itemId);
                              else toggleVlogVisibility(itemId);
                            }}
                            className={`pointer-events-auto px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-md ${
                              isPrivate
                                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                                : 'bg-emerald-500/90 text-white hover:bg-emerald-500'
                            }`}
                          >
                            {isPrivate ? (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Private (Only Me)</span>
                              </>
                            ) : (
                              <>
                                <Globe className="w-3.5 h-3.5" />
                                <span>Public</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mb-1.5">
                          <span>{item.category || item.avatar?.name || 'Studio Media'}</span>
                          <span>•</span>
                          <span>
                            {new Date(
                              item.createdAt || item.lastModified || Date.now()
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white line-clamp-2 font-outfit group-hover:text-indigo-300 transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                          {isBlog
                            ? (item.subTitle || item.description || '').replace(/<[^>]+>/g, '')
                            : item.avatar?.script || 'Neural AI Avatar script and timeline tracks.'}
                        </p>
                      </div>
                    </div>

                    {/* Footer Action Buttons */}
                    <div className="p-4 bg-slate-950/40 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Preview/View Action */}
                        <button
                          onClick={() => {
                            if (isBlog) {
                              navigate(`/blog/${itemId}`);
                            } else {
                              setSelectedVlogModal(item);
                              setIsPlayingModalVideo(true);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          {isBlog ? (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Read Post</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>Play Vlog</span>
                            </>
                          )}
                        </button>

                        {/* Edit Action */}
                        <button
                          onClick={() => {
                            if (isBlog) {
                              navigate(`/edit-blog/${itemId}`);
                            } else {
                              navigate('/vlog-editor');
                            }
                          }}
                          className="p-1.5 rounded-lg glass-panel hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Edit Media"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Broadcast/Publish Action */}
                        <button
                          onClick={() => {
                            if (!connectedPlatforms.length) {
                              showToast('Connect at least one publishing destination first.', 'info');
                              return;
                            }
                            publishToPlatforms(item.title, connectedPlatforms, isBlog ? 'Blog' : 'Vlog');
                          }}
                          className="p-1.5 rounded-lg glass-panel hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                          title="Share / Broadcast"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        {/* Delete Action */}
                        <button
                          onClick={() => {
                            if (isBlog) deleteBlog(itemId);
                            else deleteVlogProject(itemId);
                          }}
                          className="p-1.5 rounded-lg glass-panel hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Media"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 max-w-xl mx-auto my-8 p-8">
              {activeTab === 'avatars' ? <UserRound className="w-12 h-12 text-pink-300 mx-auto mb-4 opacity-80" /> : activeTab === 'ai' ? <Bot className="w-12 h-12 text-violet-300 mx-auto mb-4 opacity-80" /> : <Lock className="w-12 h-12 text-indigo-400 mx-auto mb-4 opacity-80" />}
              <h3 className="text-xl font-bold text-white font-outfit">{activeTab === 'avatars' ? 'No saved avatars yet' : activeTab === 'ai' ? 'No saved AI content yet' : 'No published media found'}</h3>
              <p className="text-slate-400 text-sm mt-2">{activeTab === 'avatars' ? 'Create an avatar presenter, then use it in your vlog project.' : activeTab === 'ai' ? 'Generate a title, subtitle, thumbnail concept or scene idea in AI Studio.' : 'Your published workspace is empty. Create and publish your first real blog or vlog to see it here.'}</p>

              <div className="flex items-center justify-center gap-4 mt-6">
                {activeTab === 'avatars' ? <button onClick={() => navigate('/avatar-editor')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-500 transition-colors cursor-pointer">Open Avatar Studio <ArrowRight className="w-3.5 h-3.5" /></button> : activeTab === 'ai' ? <button onClick={() => navigate('/ai-editor')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold hover:bg-violet-500 transition-colors cursor-pointer">Open AI Studio <ArrowRight className="w-3.5 h-3.5" /></button> : <><button onClick={() => navigate('/create-blog')} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors cursor-pointer">Author First Blog</button><button onClick={() => navigate('/vlog-editor')} className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500 transition-colors cursor-pointer">Create First Vlog</button></>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vlog Preview Player Modal */}
      <AnimatePresence>
        {selectedVlogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl glass-panel rounded-3xl border border-indigo-500/30 p-6 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-outfit">
                      {selectedVlogModal.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedVlogModal.avatar?.name} • {selectedVlogModal.filterStyle} Filter
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVlogModal(null)}
                  className="p-2 rounded-xl glass-panel text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Player Canvas Display */}
              <div className="relative h-64 sm:h-80 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center mb-4">
                {selectedVlogModal.avatar?.avatarImg && (
                  <img
                    src={selectedVlogModal.avatar.avatarImg}
                    alt={selectedVlogModal.avatar.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                )}

                {/* Cyberpunk Filter Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-indigo-950/40 to-transparent" />

                {/* Subtitle / Script Box */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-xl border border-indigo-500/30 text-center">
                  <p className="text-xs sm:text-sm text-indigo-200 font-medium italic">
                    "{selectedVlogModal.avatar?.script}"
                  </p>
                </div>

                {/* Center Play Button Overlay */}
                <button
                  onClick={() => setIsPlayingModalVideo(!isPlayingModalVideo)}
                  className="relative z-10 w-16 h-16 rounded-full bg-indigo-600/90 border-2 border-indigo-300 flex items-center justify-center shadow-xl shadow-indigo-500/50 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Play className="w-7 h-7 text-white ml-1" />
                </button>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>
                    {selectedVlogModal.clips?.length || 3} Timeline Tracks Active
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedVlogModal(null);
                      navigate('/vlog-editor');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Edit in Vlog Studio
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MyPublished;
