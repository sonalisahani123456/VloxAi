// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'motion/react';
// import {
//   Video,
//   PenTool,
//   Sparkles,
//   Search,
//   Zap,
//   Globe2,
//   Cpu,
//   Layers,
//   Share2,
// } from 'lucide-react';
// import Tilt3DCard from './Tilt3DCard';

// const Header = ({ searchQuery, setSearchQuery }) => {
//   const navigate = useNavigate();

//   return (
//     <section className="relative pt-12 pb-16 px-4 sm:px-8 max-w-7xl mx-auto text-center overflow-hidden">
//       {/* Soft Radial Ambient Hero Glow (Violet -> Pink) */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/30 via-pink-600/15 to-transparent blur-[140px] -z-10 pointer-events-none rounded-full" />

//       {/* Futuristic Feature Pill */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full gradient-border-elevated text-xs font-semibold text-violet-200 mb-6 shadow-xl"
//       >
//         <span className="flex h-2.5 w-2.5 relative">
//           <span className="micro-glow-dot absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
//           <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
//         </span>
//         <span>Next-Gen 3D Studio & AI Avatar Publisher</span>
//         <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
//       </motion.div>

//       {/* Main Headline */}
//       <motion.h1
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.1 }}
//         className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] font-outfit"
//       >
//         <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 neon-text-purple">AI Powered Content Creation Studio</span>
//       </motion.h1>

//       {/* Subtitle */}
//       <motion.p
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.2 }}
//         className="mt-6 text-base sm:text-lg text-[var(--text-muted,#9ca3af)] max-w-2xl mx-auto font-normal leading-relaxed"
//       >
//         Write captivating blogs with AI prose generation or edit high-impact vlogs with digital human avatars, auto-clips, multi-track timelines, and 1-click publishing to YouTube, Instagram, X, LinkedIn & TikTok.
//       </motion.p>

//       {/* CTA Buttons */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.3 }}
//         className="mt-8 flex flex-wrap items-center justify-center gap-4"
//       >
//         <button
//           onClick={() => navigate('/vlog-editor')}
//           className="flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-base shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
//         >
//           <Video className="w-5 h-5 text-cyan-300" />
//           <span>Launch Vlog AI Studio</span>
//         </button>

//         <button
//           onClick={() => navigate('/create-blog')}
//           className="flex items-center gap-3 px-7 py-3.5 rounded-2xl glass-panel text-slate-200 border border-slate-700 hover:border-indigo-500/50 hover:text-white font-semibold text-base hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
//         >
//           <PenTool className="w-5 h-5 text-indigo-400" />
//           <span>Author New Blog</span>
//         </button>
//       </motion.div>

//       {/* Search Input Bar */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.4 }}
//         className="mt-10 max-w-xl mx-auto"
//       >
//         <div className="relative flex items-center rounded-2xl glass-panel p-2 border border-slate-800 focus-within:border-indigo-500/80 shadow-2xl transition-all">
//           <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
//           <input
//             type="text"
//             value={searchQuery || ''}
//             onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
//             placeholder="Search stories, AI avatar guides, lifestyle, tech..."
//             className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
//           />
//           {searchQuery && (
//             <button
//               onClick={() => setSearchQuery && setSearchQuery('')}
//               className="text-xs text-slate-400 hover:text-white px-2 py-1"
//             >
//               Clear
//             </button>
//           )}
//         </div>
//       </motion.div>

//       {/* 3D Feature Grid Highlights */}
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.7, delay: 0.5 }}
//         className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
//       >
//         <Tilt3DCard className="rounded-2xl">
//           <div className="p-5 glass-panel rounded-2xl border border-slate-800 text-left h-full flex flex-col justify-between">
//             <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
//               <Cpu className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="text-sm font-bold text-white">AI Avatars & Voice</h3>
//               <p className="text-xs text-slate-400 mt-1">Neural digital human presenter with lip-sync rendering.</p>
//             </div>
//           </div>
//         </Tilt3DCard>

//         <Tilt3DCard className="rounded-2xl">
//           <div className="p-5 glass-panel rounded-2xl border border-slate-800 text-left h-full flex flex-col justify-between">
//             <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
//               <Layers className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="text-sm font-bold text-white">3D Video Timeline</h3>
//               <p className="text-xs text-slate-400 mt-1">Multi-track video, audio, subtitles & AI clip overlays.</p>
//             </div>
//           </div>
//         </Tilt3DCard>

//         <Tilt3DCard className="rounded-2xl">
//           <div className="p-5 glass-panel rounded-2xl border border-slate-800 text-left h-full flex flex-col justify-between">
//             <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
//               <Share2 className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="text-sm font-bold text-white">1-Click Publish</h3>
//               <p className="text-xs text-slate-400 mt-1">Broadcast to YouTube, Instagram, X, LinkedIn & TikTok.</p>
//             </div>
//           </div>
//         </Tilt3DCard>

//         <Tilt3DCard className="rounded-2xl">
//           <div className="p-5 glass-panel rounded-2xl border border-slate-800 text-left h-full flex flex-col justify-between">
//             <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-3">
//               <PenTool className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="text-sm font-bold text-white">Rich Blog Authoring</h3>
//               <p className="text-xs text-slate-400 mt-1">AI outline generator, tone polish & SEO tag optimizer.</p>
//             </div>
//           </div>
//         </Tilt3DCard>
//       </motion.div>
//     </section>
//   );
// };

// export default Header;

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import {
  Video,
  PenTool,
  Sparkles,
  Search,
  Zap,
  Globe2,
  Cpu,
  Layers,
  Share2,
  Image,
  Captions,
} from "lucide-react";

import Tilt3DCard from "./Tilt3DCard";

const Header = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  return (
    <section
      className="
        relative
        pt-12 sm:pt-16
        pb-16 sm:pb-20
        px-4 sm:px-8
        max-w-7xl
        mx-auto
        text-center
        overflow-hidden
      "
    >
      {/* =====================================================
          AMBIENT AI GLOW
      ====================================================== */}

      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[700px]
          h-[400px]
          bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))]
          from-violet-600/25
          via-purple-600/10
          to-transparent
          blur-[140px]
          -z-10
          pointer-events-none
          rounded-full
        "
      />

      {/* Additional subtle glow */}
      <div
        className="
          absolute
          top-20
          left-1/2
          -translate-x-1/2
          w-[300px]
          h-[180px]
          bg-purple-500/10
          blur-[100px]
          rounded-full
          -z-10
          pointer-events-none
        "
      />

      {/* =====================================================
          AI FEATURE BADGE
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          inline-flex
          items-center
          gap-2.5
          px-4
          py-2
          rounded-full
          border
          border-violet-400/20
          bg-violet-500/[0.08]
          backdrop-blur-xl
          text-xs
          font-semibold
          text-violet-200
          mb-6
          shadow-lg
          shadow-violet-500/10
        "
      >
        {/* Animated Dot */}
        <span className="relative flex h-2.5 w-2.5">
          <span
            className="
              absolute
              inline-flex
              h-full
              w-full
              rounded-full
              bg-cyan-400
              opacity-70
              animate-ping
            "
          />

          <span
            className="
              relative
              inline-flex
              rounded-full
              h-2.5
              w-2.5
              bg-cyan-400
            "
          />
        </span>

        <span>AI-Powered Content Creation Studio</span>

        <Sparkles
          className="
            w-3.5
            h-3.5
            text-amber-400
          "
        />
      </motion.div>

      {/* =====================================================
          MAIN HEADING
      ====================================================== */}

      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.1,
        }}
        className="
          text-4xl
          sm:text-6xl
          md:text-7xl
          font-extrabold
          tracking-tight
          text-white
          max-w-5xl
          mx-auto
          leading-[1.1]
          font-outfit
        "
      >
        Create Smarter.
        <br />
        <span
          className="
            bg-clip-text
            text-transparent
            bg-gradient-to-r
            from-violet-400
            via-purple-400
            to-pink-400
          "
        >
          Create with VloxAI.
        </span>
      </motion.h1>

      {/* =====================================================
          DESCRIPTION
      ====================================================== */}

      <motion.p
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
        }}
        className="
          mt-6
          text-base
          sm:text-lg
          text-[var(--text-muted,#9ca3af)]
          max-w-3xl
          mx-auto
          font-normal
          leading-relaxed
        "
      >
        Create, edit and publish powerful blogs and vlogs with AI. Generate
        content, subtitles, thumbnails, images and avatars — all from one
        intelligent content creation studio.
      </motion.p>

      {/* =====================================================
          CTA BUTTONS
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.3,
        }}
        className="
          mt-8
          flex
          flex-wrap
          items-center
          justify-center
          gap-4
        "
      >
        {/* VLOG CTA */}
        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.96,
          }}
          onClick={() => navigate("/vlog-editor")}
          className="
            flex
            items-center
            gap-3
            px-7
            py-3.5
            rounded-2xl
            bg-gradient-to-r
            from-indigo-600
            via-purple-600
            to-pink-600
            text-white
            font-bold
            text-base
            shadow-xl
            shadow-indigo-500/30
            hover:shadow-indigo-500/50
            transition-all
            duration-300
            cursor-pointer
          "
        >
          <Video
            className="
              w-5
              h-5
              text-cyan-300
            "
          />

          <span>Create Vlog</span>
        </motion.button>

        {/* BLOG CTA */}
        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.96,
          }}
          onClick={() => navigate("/create-blog")}
          className="
            flex
            items-center
            gap-3
            px-7
            py-3.5
            rounded-2xl
            bg-white/[0.04]
            backdrop-blur-xl
            text-slate-200
            border
            border-white/10
            hover:border-indigo-500/50
            hover:text-white
            font-semibold
            text-base
            transition-all
            duration-300
            cursor-pointer
          "
        >
          <PenTool
            className="
              w-5
              h-5
              text-indigo-400
            "
          />

          <span>Create Blog</span>
        </motion.button>
      </motion.div>

      {/* =====================================================
          SEARCH BAR
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.4,
        }}
        className="
          mt-10
          max-w-2xl
          mx-auto
        "
      >
        <div
          className="
            relative
            flex
            items-center
            rounded-2xl
            bg-white/[0.035]
            backdrop-blur-xl
            p-2
            border
            border-white/10
            focus-within:border-indigo-500/70
            focus-within:shadow-lg
            focus-within:shadow-indigo-500/10
            shadow-2xl
            transition-all
          "
        >
          <Search
            className="
              w-5
              h-5
              text-slate-400
              ml-3
              shrink-0
            "
          />

          <input
            type="text"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search blogs, vlogs, AI tools, tutorials..."
            className="
              w-full
              bg-transparent
              px-3
              py-2.5
              text-sm
              text-white
              placeholder-slate-500
              focus:outline-none
            "
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery && setSearchQuery("")}
              className="
                text-xs
                text-slate-400
                hover:text-white
                px-2
                py-1
                transition-colors
              "
            >
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* =====================================================
          FEATURE CARDS
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.5,
        }}
        className="
          mt-14
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-4
          gap-4
          max-w-6xl
          mx-auto
        "
      >
        {/* =================================================
            CARD 1 — AI CONTENT
        ================================================== */}

        <Tilt3DCard className="rounded-2xl">
          <div
            className="
              group
              p-5
              bg-white/[0.035]
              backdrop-blur-xl
              rounded-2xl
              border
              border-white/10
              hover:border-indigo-500/30
              text-left
              h-full
              flex
              flex-col
              justify-between
              transition-all
              duration-300
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-indigo-500/10
                border
                border-indigo-500/20
                flex
                items-center
                justify-center
                text-indigo-400
                mb-4
                group-hover:scale-110
                transition-transform
              "
            >
              <Cpu className="w-5 h-5" />
            </div>

            <div>
              <h3
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                AI Content Generation
              </h3>

              <p
                className="
                  text-xs
                  text-slate-400
                  mt-1.5
                  leading-relaxed
                "
              >
                Generate and improve blogs, titles, captions and creative
                content with AI.
              </p>
            </div>
          </div>
        </Tilt3DCard>

        {/* =================================================
            CARD 2 — VIDEO & SUBTITLES
        ================================================== */}

        <Tilt3DCard className="rounded-2xl">
          <div
            className="
              group
              p-5
              bg-white/[0.035]
              backdrop-blur-xl
              rounded-2xl
              border
              border-white/10
              hover:border-cyan-500/30
              text-left
              h-full
              flex
              flex-col
              justify-between
              transition-all
              duration-300
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-cyan-500/10
                border
                border-cyan-500/20
                flex
                items-center
                justify-center
                text-cyan-400
                mb-4
                group-hover:scale-110
                transition-transform
              "
            >
              <Captions className="w-5 h-5" />
            </div>

            <div>
              <h3
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                AI Video & Subtitles
              </h3>

              <p
                className="
                  text-xs
                  text-slate-400
                  mt-1.5
                  leading-relaxed
                "
              >
                Edit uploaded videos with AI-assisted editing and automatic
                subtitle generation.
              </p>
            </div>
          </div>
        </Tilt3DCard>

        {/* =================================================
            CARD 3 — AVATAR & CREATIVE
        ================================================== */}

        <Tilt3DCard className="rounded-2xl">
          <div
            className="
              group
              p-5
              bg-white/[0.035]
              backdrop-blur-xl
              rounded-2xl
              border
              border-white/10
              hover:border-purple-500/30
              text-left
              h-full
              flex
              flex-col
              justify-between
              transition-all
              duration-300
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-purple-500/10
                border
                border-purple-500/20
                flex
                items-center
                justify-center
                text-purple-400
                mb-4
                group-hover:scale-110
                transition-transform
              "
            >
              <Layers className="w-5 h-5" />
            </div>

            <div>
              <h3
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                Avatars & Visuals
              </h3>

              <p
                className="
                  text-xs
                  text-slate-400
                  mt-1.5
                  leading-relaxed
                "
              >
                Create AI avatar images and videos along with custom images and
                thumbnails.
              </p>
            </div>
          </div>
        </Tilt3DCard>

        {/* =================================================
            CARD 4 — PUBLISH & GLOBAL
        ================================================== */}

        <Tilt3DCard className="rounded-2xl">
          <div
            className="
              group
              p-5
              bg-white/[0.035]
              backdrop-blur-xl
              rounded-2xl
              border
              border-white/10
              hover:border-pink-500/30
              text-left
              h-full
              flex
              flex-col
              justify-between
              transition-all
              duration-300
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-pink-500/10
                border
                border-pink-500/20
                flex
                items-center
                justify-center
                text-pink-400
                mb-4
                group-hover:scale-110
                transition-transform
              "
            >
              <Share2 className="w-5 h-5" />
            </div>

            <div>
              <h3
                className="
                  text-sm
                  font-bold
                  text-white
                "
              >
                Translate & Publish
              </h3>

              <p
                className="
                  text-xs
                  text-slate-400
                  mt-1.5
                  leading-relaxed
                "
              >
                Translate content into multiple languages and publish directly
                to social platforms.
              </p>
            </div>
          </div>
        </Tilt3DCard>
      </motion.div>

      {/* =====================================================
          BOTTOM MINI FEATURES
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.7,
          delay: 0.7,
        }}
        className="
          mt-8
          flex
          flex-wrap
          justify-center
          items-center
          gap-x-6
          gap-y-3
          text-[11px]
          text-slate-500
        "
      >
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          AI-Powered
        </span>

        <span className="flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
          Multi-Language
        </span>

        <span className="flex items-center gap-1.5">
          <Image className="w-3.5 h-3.5 text-purple-400" />
          AI Visuals
        </span>

        <span className="flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5 text-pink-400" />
          Social Publishing
        </span>
      </motion.div>
    </section>
  );
};

export default Header;