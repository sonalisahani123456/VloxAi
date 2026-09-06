import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { SignInButton } from "@clerk/clerk-react";
import { ArrowRight, CheckCircle2, Clapperboard, Compass, Layers3, PlayCircle, Sparkles, WandSparkles, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import gradientBackground from "../assets/gradientBackground.png";

const isClerkAvailable = Boolean(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY &&
    !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.includes("example"),
);

const benefits = [
  { icon: Sparkles, title: "Create with clarity", text: "Turn a rough idea into a structured, polished video without staring at a blank canvas." },
  { icon: Zap, title: "Move faster", text: "Keep your creative flow moving with one focused workspace for every stage of production." },
  { icon: Layers3, title: "Stay in control", text: "Fine-tune your story, scenes and timing before you share your finished work." },
];

const steps = [
  ["01", "Start with your idea", "Add a topic, script or a simple creative brief."],
  ["02", "Shape the story", "Build scenes and refine the flow in the VloxAI studio."],
  ["03", "Make it yours", "Edit details until the final video feels on-brand and ready."],
];

const Home = () => {
  const navigate = useNavigate();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const getStartedButtonClass = "flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-5 py-3 text-sm font-bold shadow-lg shadow-indigo-600/30 transition hover:-translate-y-0.5 hover:shadow-indigo-500/50";

  return (
    <div className="min-h-screen overflow-hidden bg-[#080c14] text-white">
      <Navbar />
      <main>
        <section className="relative isolate px-4 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-20">
          <img
            src={gradientBackground}
            alt=""
            className="pointer-events-none absolute left-1/2 top-0 -z-10 w-[760px] max-w-none -translate-x-1/2 opacity-45 blur-[1px]"
          />
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,.16),transparent_38%)]" />
          <div className="mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-xs font-bold tracking-wide text-violet-200"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_#67e8f9]" />{" "}
              Your AI-Powered Studio for Content Creation
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mx-auto mt-7 max-w-4xl font-outfit text-5xl font-black leading-[1.03] tracking-tight sm:text-6xl md:text-7xl"
            >
              Your Creativity,{" "}
              <span className="block bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                Amplified by AI.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg"
            >
              An all-in-one AI creative studio to create, edit and transform
              your ideas into engaging content.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-9 flex flex-wrap justify-center gap-3"
            >
              {isClerkAvailable ? (
                <SignInButton
                  mode="modal"
                  forceRedirectUrl="/tools"
                  signUpForceRedirectUrl="/tools"
                >
                  <button className={getStartedButtonClass}>
                    Get started <ArrowRight className="h-4 w-4" />
                  </button>
                </SignInButton>
              ) : (
                <button
                  onClick={() => navigate("/dashboard")}
                  className={getStartedButtonClass}
                >
                  Get started <ArrowRight className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => scrollTo("how-it-works")}
                className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-violet-300/40 hover:bg-white/10"
              >
                <PlayCircle className="h-4 w-4 text-cyan-300" /> See how it
                works
              </button>
            </motion.div>
            <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-3 backdrop-blur-xl sm:grid-cols-3">
              {[
                [
                  WandSparkles,
                  "Idea to Creativity",
                  "A focused creative starting point",
                ],
                [Clapperboard, "One studio", "Everything you need in one flow"],
                [
                  Compass,
                  "Built for creators",
                  "Flexible enough for your style",
                ],
              ].map(([Icon, title, text]) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded-xl px-4 py-4 text-left"
                >
                  <Icon className="h-5 w-5 shrink-0 text-violet-300" />
                  <div>
                    <p className="text-sm font-bold text-white">{title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="what-is-vloxai"
          className="scroll-mt-24 border-y border-white/8 bg-white/[0.025] px-4 py-20 sm:px-8"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_.9fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-cyan-300">
                What is VloxAI?
              </p>
              <h2 className="mt-4 font-outfit text-3xl font-bold leading-tight sm:text-5xl">
                A creative workspace made for the way ideas really happen.
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-slate-300">
                VloxAI brings the essential parts of video creation into one
                clean studio. Begin with an idea, develop the story, edit the
                details and prepare your content for the world—without a
                complicated workflow getting in the way.
              </p>
              <button
                onClick={() => navigate("/vlog-editor")}
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-violet-300 transition hover:text-violet-200"
              >
                Explore the studio <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-violet-300/20 bg-gradient-to-br from-indigo-500/20 via-slate-900 to-fuchsia-500/15 p-7 shadow-2xl shadow-indigo-950/50">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="relative rounded-2xl border border-white/10 bg-slate-950/70 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    VloxAI studio
                  </span>
                  <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
                    Ready to create
                  </span>
                </div>
                <div className="mt-6 space-y-3">
                  {["Your idea", "Story & scenes", "Final cut"].map(
                    (label, index) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/15 text-xs font-bold text-violet-200">
                          0{index + 1}
                        </span>
                        <div className="h-2.5 flex-1 rounded-full bg-white/8">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400"
                            style={{ width: `${[38, 68, 92][index]}%` }}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="why-vloxai" className="scroll-mt-24 px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[.18em] text-pink-300">
                Why use VloxAI?
              </p>
              <h2 className="mt-4 font-outfit text-3xl font-bold sm:text-5xl">
                More time shaping the message. Less time fighting the process.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[0.06]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/12">
                    <Icon className="h-5 w-5 text-violet-300" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 px-4 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/12 via-slate-900/80 to-fuchsia-500/10 p-7 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[.18em] text-violet-300">
              How to use VloxAI
            </p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-outfit text-3xl font-bold sm:text-5xl">
                From spark to share in three simple steps.
              </h2>
              <button
                onClick={() => navigate("/vlog-editor")}
                className="rounded-xl border border-violet-300/30 bg-violet-400/10 px-4 py-2.5 text-sm font-bold text-violet-100 transition hover:bg-violet-400/20"
              >
                Open studio
              </button>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map(([number, title, text]) => (
                <div key={number}>
                  <span className="font-outfit text-5xl font-black text-violet-300/35">
                    {number}
                  </span>
                  <h3 className="mt-3 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="benefits"
          className="scroll-mt-24 px-4 pb-24 pt-8 text-center sm:px-8"
        >
          <div className="mx-auto max-w-3xl rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.045] px-6 py-14">
            <CheckCircle2 className="mx-auto h-7 w-7 text-cyan-300" />
            <p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-cyan-300">
              The VloxAI benefit
            </p>
            <h2 className="mt-4 font-outfit text-3xl font-bold sm:text-5xl">
              Make content creation feel possible again.
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-300">
              Bring your next story to life in a workspace designed to support
              the creative decisions that matter.
            </p>
            <button
              onClick={() => navigate("/tools")}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-100"
            >
              Create your first Content <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
