import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bot, BookOpen, Captions, CheckCircle2, Film, Image as ImageIcon, LayoutDashboard, PenTool, Sparkles, UserRound, Video } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const toolImages = {
  blog: "https://images.unsplash.com/photo-1604933762023-7213af7ff7a7?auto=format&fit=crop&w=1400&q=85",
  vlog: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1400&q=85",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85",
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=85",
  dashboard: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85",
  library: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1400&q=85",
};

const tools = [
  {
    icon: PenTool, accent: "indigo", title: "Blog Studio", image: toolImages.blog,
    description: "Write, edit and publish polished blog posts from one distraction-free editor.",
    steps: ["Choose New Blog to open the editor.", "Add your title, cover image and story.", "Preview your post, then save or publish it."],
    action: "Create a blog", path: "/create-blog",
  },
  {
    icon: Video, accent: "cyan", title: "Vlog Studio", image: toolImages.vlog,
    description: "Plan scenes, build your video and turn a concept into a finished vlog project.",
    steps: ["Start a project and add your topic or script.", "Arrange scenes, media and creative elements.", "Review the final flow and save your vlog."],
    action: "Create a vlog", path: "/vlog-editor",
  },
  {
    icon: UserRound, accent: "pink", title: "Avatar Studio", image: toolImages.avatar,
    description: "Choose an AI presenter, add a voice-ready script and make your video feel personal.",
    steps: ["Open Vlog Studio and find the AI Avatar section.", "Choose the presenter and voice that fit your story.", "Add your script, then refine the scenes around it."],
    action: "Choose an avatar", path: "/avatar-editor",
  },
  {
    icon: Bot, accent: "violet", title: "AI Studio", image: toolImages.ai,
    description: "Use AI-assisted tools to create stronger titles, visual ideas, thumbnails and ready-to-read subtitles.",
    steps: ["Open Vlog Studio and write your project title or script.", "Use Frame Video Director for captions, scene ideas and B-roll suggestions.", "Select a visual preset and finalise the title and thumbnail."],
    action: "Open AI tools", path: "/ai-editor",
    features: [Captions, ImageIcon],
  },
  {
    icon: LayoutDashboard, accent: "amber", title: "Creator Dashboard", image: toolImages.dashboard,
    description: "Keep your content workspace organised and see your blog and vlog projects in one place.",
    steps: ["Open your dashboard after you sign in.", "Switch between blog posts and vlog projects.", "Open, edit or manage work whenever you need."],
    action: "Open dashboard", path: "/dashboard",
  },
  {
    icon: BookOpen, accent: "emerald", title: "Published Library", image: toolImages.library,
    description: "Review the content you have shared and return to it whenever you want to make an update.",
    steps: ["Open Published from the navigation.", "Browse your approved blog and vlog content.", "Select an item to view or continue editing."],
    action: "View published work", path: "/my-published",
  },
];

const colorClasses = {
  indigo: "border-indigo-400/25 bg-indigo-400/10 text-indigo-300",
  cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
  pink: "border-pink-400/25 bg-pink-400/10 text-pink-300",
  violet: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
};

const ToolsGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      <Navbar />
      <main className="px-4 pb-20 pt-10 sm:px-8 sm:pt-16">
        <section className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-violet-300/15 bg-gradient-to-br from-indigo-500/15 via-slate-950 to-fuchsia-500/10 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-2/3 -translate-x-1/2 rounded-full bg-violet-500/20 blur-[100px]" />
          <div className="relative"><div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-200"><CheckCircle2 className="h-4 w-4" /> Your VloxAI workspace is ready</div><h1 className="mx-auto mt-6 max-w-3xl font-outfit text-4xl font-black tracking-tight sm:text-6xl">Welcome! Let&apos;s create something worth sharing.</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Explore every VloxAI tool below. Each one has a simple guide and a direct way to get started.</p></div>
        </section>

        <section className="mx-auto mt-12 max-w-6xl"><div className="mb-7 flex items-center gap-2"><Sparkles className="h-4 w-4 text-violet-300" /><p className="text-sm font-bold uppercase tracking-[.16em] text-slate-400">Your tools</p></div>
          <div className="space-y-6">
            {tools.map(({ icon: Icon, accent, title, image, description, steps, action, path, features }, index) => (
              <article key={title} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/25 hover:bg-white/[0.055] hover:shadow-violet-950/25">
                <div className="grid items-stretch lg:grid-cols-2">
                  <div className={`relative min-h-64 overflow-hidden ${index % 2 ? "lg:order-2" : ""}`}>
                    <img src={image} alt={`${title} workspace`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080c14]/85 via-[#080c14]/15 to-transparent" />
                    <div className={`absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-2xl border backdrop-blur ${colorClasses[accent]}`}><Icon className="h-5 w-5" /></div>
                    <p className="absolute bottom-6 left-20 text-xs font-bold uppercase tracking-[.16em] text-white/80">VloxAI tool</p>
                  </div>
                  <div className="p-6 sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className={`text-xs font-bold uppercase tracking-[.16em] ${colorClasses[accent].split(" ").at(-1)}`}>Create with VloxAI</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h2></div><span className="text-xs font-bold text-slate-600">0{index + 1}</span></div><p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
                    {features && <div className="mt-4 flex flex-wrap gap-2"><span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-xs font-bold text-violet-200"><Captions className="h-3.5 w-3.5" /> Subtitles</span><span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-xs font-bold text-violet-200"><ImageIcon className="h-3.5 w-3.5" /> Images & thumbnails</span></div>}
                    <div className="mt-6 border-t border-white/8 pt-5"><p className="mb-3 text-xs font-bold uppercase tracking-[.14em] text-slate-500">How to use</p><ol className="space-y-3">{steps.map((step, stepIndex) => <li key={step} className="flex gap-3 text-sm leading-5 text-slate-300"><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${colorClasses[accent]}`}>{stepIndex + 1}</span>{step}</li>)}</ol></div>
                    <button onClick={() => navigate(path)} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-200">{action} <ArrowRight className="h-4 w-4" /></button></div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.045] p-5 text-sm text-slate-300"><Film className="h-5 w-5 shrink-0 text-cyan-300" /><p><span className="font-bold text-white">Suggested first step:</span> Start with Blog Studio when you have a written story, or Vlog Studio when your idea is visual.</p></div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ToolsGuide;
