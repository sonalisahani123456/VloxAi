
import React from "react";
import { useNavigate } from "react-router-dom";
import { WandSparkles } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-slate-800 bg-slate-950 text-white">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* ================= MAIN FOOTER ================= */}
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* ================= BRAND ================= */}
          <div className="max-w-md">
            {/* VloxAI Logo */}
            <button
              onClick={() => goTo("/")}
              className="group mb-6 flex items-center gap-3"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-purple-500/20 transition-transform duration-300 group-hover:scale-105">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                  <WandSparkles className="h-5 w-5 text-indigo-300" />
                </div>
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Vlox<span className="text-violet-400">AI</span>
              </span>
            </button>

            <h2 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">
              One intelligent space
              <span className="block bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                for limitless creativity.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              VloxAI brings powerful AI tools for blogs, vlogs, videos,
              subtitles, thumbnails, captions, voices and avatars into one
              creative studio.
            </p>
          </div>

          {/* ================= CREATE ================= */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Create
            </h3>

            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => goTo("/vlog-editor")}
                  className="transition-colors hover:text-white"
                >
                  AI Vlog Studio
                </button>
              </li>

              <li>
                <button
                  onClick={() => goTo("/create-blog")}
                  className="transition-colors hover:text-white"
                >
                  AI Blog Generator
                </button>
              </li>

              <li>
                <button
                  onClick={() => goTo("/avatar-editor")}
                  className="transition-colors hover:text-white"
                >
                  AI Avatar
                </button>
              </li>

              <li>
                <button
                  onClick={() => goTo("/ai-editor")}
                  className="transition-colors hover:text-white"
                >
                  AI Tools
                </button>
              </li>
            </ul>
          </div>

          {/* ================= VLOXAI ================= */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              VloxAI
            </h3>

            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => goTo("/tools")}
                  className="transition-colors hover:text-white"
                >
                  What is VloxAI?
                </button>
              </li>

              <li>
                <button
                  onClick={() => goTo("/tools")}
                  className="transition-colors hover:text-white"
                >
                  Why VloxAI?
                </button>
              </li>

              <li>
                <button
                  onClick={() => goTo("/dashboard")}
                  className="transition-colors hover:text-white"
                >
                  Your Profile
                </button>
              </li>

              <li>
                <button
                  onClick={() => goTo("/dashboard")}
                  className="transition-colors hover:text-white"
                >
                  Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* ================= CONNECT ================= */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Connect
            </h3>

            <p className="mb-5 text-sm leading-6 text-slate-400">
              Follow VloxAI and stay updated with new AI-powered creative tools.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* YouTube */}
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5v-7l6.3 3.5-6.3 3.5Z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* X */}
              <a
                href="#"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-sm font-semibold text-slate-400 transition-all duration-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                𝕏
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-sm font-bold text-slate-400 transition-all duration-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                in
              </a>
            </div>
          </div>
        </div>

        {/* ================= DIVIDER ================= */}
        <div className="my-12 h-px bg-slate-800" />

        {/* ================= BOTTOM ================= */}
        <div className="flex flex-col gap-5 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} VloxAI. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button className="transition-colors hover:text-white">
              Privacy
            </button>

            <button className="transition-colors hover:text-white">
              Terms
            </button>

            <span className="hidden h-4 w-px bg-slate-700 sm:block" />

            <span className="text-slate-600">Built for creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
