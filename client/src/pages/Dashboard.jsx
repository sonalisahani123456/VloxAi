import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useBlog } from "../context/BlogContext";
import {
  LayoutDashboard,
  Video,
  PenTool,
  Trash2,
  Edit,
  Eye,
  Heart,
  Share2,
  Sparkles,
  Zap,
  Clock,
  PlusCircle,
  ShieldCheck,
  User as UserIcon,
  Mail,
  CheckCircle2,
  UserRound,
  Bot,
  ArrowRight,
} from "lucide-react";

const isClerkAvailable = Boolean(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY &&
  !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.includes("example"),
);

const ClerkDashboard = () => {
  const { user, isSignedIn } = useUser();
  return <DashboardContent user={user} isSignedIn={isSignedIn} />;
};

const DashboardContent = ({ user = null, isSignedIn = false }) => {
  const navigate = useNavigate();
  const {
    blogs,
    vlogProjects,
    avatarAssets,
    aiContents,
    deleteBlog,
    deleteVlogProject,
    aiCredits,
    showToast,
    currentUserProfile,
  } = useBlog();
  const [activeTab, setActiveTab] = useState("blogs"); // 'blogs' | 'vlogs'

  // Keep dashboard personal: seeded/demo records are never treated as creator work.
  const creatorBlogs = blogs.filter((blog) => blog.isUserCreated === true);
  const creatorVlogs = vlogProjects.filter((vlog) => vlog.isUserCreated === true);
  const creatorAvatars = avatarAssets.filter((asset) => asset.isUserCreated === true);
  const creatorAiContents = aiContents.filter((content) => content.isUserCreated === true);
  const totalViews = creatorBlogs.reduce((acc, blog) => acc + (Number(blog.views) || 0), 0);
  const publishedCount = creatorBlogs.filter((blog) => blog.isPublished !== false && !blog.isPrivate).length;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
                <LayoutDashboard className="w-4 h-4" />
                <span>CREATOR DASHBOARD & ANALYTICS</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white font-outfit">
                Your Creator Workspace
              </h1>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/my-published")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-500/30 text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Published Content</span>
              </button>

              <button
                onClick={() => navigate("/create-blog")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <PenTool className="w-4 h-4 text-indigo-400" />
                <span>New Blog</span>
              </button>

              <button
                onClick={() => navigate("/vlog-editor")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>New Vlog</span>
              </button>
            </div>
          </div>

          {/* User Auth Profile Banner */}
          {(isSignedIn && user) || currentUserProfile ? (
            <div className="p-5 rounded-3xl glass-panel border border-indigo-500/30 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <img
                  src={
                    user?.imageUrl ||
                    currentUserProfile?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
                  }
                  alt="Profile Avatar"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white font-outfit">
                      {user?.fullName ||
                        currentUserProfile?.name ||
                        "Vlox Creator"}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Creator profile</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      {user?.primaryEmailAddress?.emailAddress || currentUserProfile?.email || "No email available"}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 text-[11px]">
                      Clerk ID:{" "}
                      {user?.id || currentUserProfile?.clerkId || "Not connected"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                  Workspace connected
                </span>
              </div>
            </div>
          ) : null}

          {/* Metric Cards Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Published Blogs
                </p>
                <h3 className="text-2xl font-black text-white mt-1 font-outfit">
                  {publishedCount}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                <PenTool className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Vlog Projects
                </p>
                <h3 className="text-2xl font-black text-white mt-1 font-outfit">
                  {creatorVlogs.length}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Video className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Total Views
                </p>
                <h3 className="text-2xl font-black text-white mt-1 font-outfit">
                  {totalViews.toLocaleString()}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-pink-500/20 text-pink-400">
                <Eye className="w-6 h-6" />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  AI Credits Left
                </p>
                <h3 className="text-2xl font-black text-white mt-1 font-outfit">
                  {aiCredits}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                <Zap className="w-6 h-6" />
              </div>
            </div>
          </div>

          <section className="mb-10">
            <div className="flex items-end justify-between gap-4 mb-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-slate-500">Creative tools</p><h2 className="mt-1 text-xl font-bold text-white">Continue creating</h2></div><span className="text-xs text-slate-500">Choose a studio for your next idea</span></div>
            <div className="grid gap-4 md:grid-cols-2">
              <button onClick={() => navigate('/avatar-editor')} className="group flex items-center justify-between rounded-3xl border border-pink-400/20 bg-gradient-to-br from-pink-500/[0.10] to-slate-950 p-6 text-left transition hover:-translate-y-0.5 hover:border-pink-300/40"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-400/10 text-pink-300"><UserRound className="h-6 w-6" /></div><div><h3 className="font-bold text-white">Avatar Studio</h3><p className="mt-1 text-xs leading-5 text-slate-400">Choose a presenter, voice and script for your next video.</p></div></div><ArrowRight className="h-5 w-5 text-pink-300 transition group-hover:translate-x-1" /></button>
              <button onClick={() => navigate('/ai-editor')} className="group flex items-center justify-between rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.10] to-slate-950 p-6 text-left transition hover:-translate-y-0.5 hover:border-violet-300/40"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300"><Bot className="h-6 w-6" /></div><div><h3 className="font-bold text-white">AI Studio</h3><p className="mt-1 text-xs leading-5 text-slate-400">Generate titles, subtitles, thumbnail concepts and scene ideas.</p></div></div><ArrowRight className="h-5 w-5 text-violet-300 transition group-hover:translate-x-1" /></button>
            </div>
          </section>

          <section className="mb-10">
            <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-slate-500">Saved workspace</p><h2 className="mt-1 text-xl font-bold text-white">Avatar & AI creations</h2></div><span className="text-xs text-slate-500">Saved automatically when you generate</span></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-pink-400/20 bg-pink-500/[0.05] p-5">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-pink-200"><UserRound className="h-5 w-5" /><h3 className="font-bold">Avatar projects</h3></div><span className="rounded-full bg-pink-400/10 px-2.5 py-1 text-xs font-bold text-pink-200">{creatorAvatars.length}</span></div>
                {creatorAvatars.length ? <div className="mt-4 space-y-2">{creatorAvatars.slice(0, 3).map((asset) => <div key={asset._id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-2.5"><img src={asset.image} alt="" className="h-9 w-9 rounded-xl object-cover" /><div className="min-w-0"><p className="truncate text-sm font-bold text-white">{asset.title}</p><p className="text-xs text-slate-400">Presenter & script saved</p></div></div>)}</div> : <p className="mt-4 text-sm leading-6 text-slate-400">Your saved presenters and scripts will appear here.</p>}
                <button onClick={() => navigate('/avatar-editor')} className="mt-4 text-xs font-bold text-pink-200 hover:text-white">Open Avatar Studio →</button>
              </div>
              <div className="rounded-3xl border border-violet-400/20 bg-violet-500/[0.05] p-5">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-violet-200"><Bot className="h-5 w-5" /><h3 className="font-bold">AI content</h3></div><span className="rounded-full bg-violet-400/10 px-2.5 py-1 text-xs font-bold text-violet-200">{creatorAiContents.length}</span></div>
                {creatorAiContents.length ? <div className="mt-4 space-y-2">{creatorAiContents.slice(0, 3).map((content) => <div key={content._id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-3"><p className="truncate text-sm font-bold text-white">{content.title}</p><p className="mt-1 line-clamp-1 text-xs text-slate-400">{content.content}</p></div>)}</div> : <p className="mt-4 text-sm leading-6 text-slate-400">Generated titles, captions, thumbnail briefs and scene ideas will appear here.</p>}
                <button onClick={() => navigate('/ai-editor')} className="mt-4 text-xs font-bold text-violet-200 hover:text-white">Open AI Studio →</button>
              </div>
            </div>
          </section>

          {/* Sub-Tab Navigation */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
            <button
              onClick={() => setActiveTab("blogs")}
              className={`px-5 py-2 text-sm font-bold rounded-xl transition-colors cursor-pointer ${
                activeTab === "blogs"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white glass-panel"
              }`}
            >
              Blog Posts ({creatorBlogs.length})
            </button>
            <button
              onClick={() => setActiveTab("vlogs")}
              className={`px-5 py-2 text-sm font-bold rounded-xl transition-colors cursor-pointer ${
                activeTab === "vlogs"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white glass-panel"
              }`}
            >
              Vlog Projects ({creatorVlogs.length})
            </button>
          </div>

          {/* Blogs List Tab */}
          {activeTab === "blogs" && (
            <div className="space-y-4">
              {creatorBlogs.map((b) => (
                <div
                  key={b._id}
                  className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {b.image && (
                      <img
                        src={b.image}
                        alt={b.title}
                        className="w-16 h-12 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                          {b.category}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(
                            b.createdAt || Date.now(),
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1 line-clamp-1">
                        {b.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => navigate(`/blog/${b._id}`)}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                      title="View Story"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => navigate(`/edit-blog/${b._id}`)}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 hover:text-indigo-300"
                      title="Edit Story"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteBlog(b._id)}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300"
                      title="Delete Story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {creatorBlogs.length === 0 && <div className="rounded-3xl border border-dashed border-slate-700 bg-white/[0.02] p-10 text-center"><PenTool className="mx-auto h-8 w-8 text-indigo-300" /><h3 className="mt-4 font-bold text-white">No blog posts yet</h3><p className="mt-2 text-sm text-slate-400">Create your first story and it will appear here.</p><button onClick={() => navigate('/create-blog')} className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white">Create blog</button></div>}
            </div>
          )}

          {/* Vlogs List Tab */}
          {activeTab === "vlogs" && (
            <div className="space-y-4">
              {creatorVlogs.map((v) => (
                <div
                  key={v.id}
                  className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                          {v.aspectRatio}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                          {v.filterStyle}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1 line-clamp-1">
                        {v.title}
                      </h4>
                      {v.avatar && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          Presenter: {v.avatar.name} • {v.durationSeconds || 90}
                          s
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => navigate("/vlog-editor")}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-500"
                    >
                      Open Studio
                    </button>

                    <button
                      onClick={() => deleteVlogProject(v.id)}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {creatorVlogs.length === 0 && <div className="rounded-3xl border border-dashed border-slate-700 bg-white/[0.02] p-10 text-center"><Video className="mx-auto h-8 w-8 text-cyan-300" /><h3 className="mt-4 font-bold text-white">No vlog projects yet</h3><p className="mt-2 text-sm text-slate-400">Create or import your first video project to see it here.</p><button onClick={() => navigate('/vlog-editor')} className="mt-5 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white">Create vlog</button></div>}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

const Dashboard = () =>
  isClerkAvailable ? <ClerkDashboard /> : <DashboardContent />;

export default Dashboard;
