import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useBlog } from "../context/BlogContext";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

import {
  Video,
  PenTool,
  BookOpen,
  LayoutDashboard,
  Sparkles,
  Zap,
  User,
  Lock,
  LogIn,
  UserPlus,
  Menu,
  X,
  WandSparkles,
  GraduationCap,
} from "lucide-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const isClerkAvailable =
  PUBLISHABLE_KEY && !PUBLISHABLE_KEY.includes("example");

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { aiCredits, currentUserProfile } = useBlog();

  const [mobileOpen, setMobileOpen] = useState(false);

  // ================= NAVIGATION ITEMS =================
  const navItems = [
    {
      label: "Explore",
      path: "/",
      icon: BookOpen,
    },
    {
      label: "Blog Studio",
      path: "/create-blog",
      icon: PenTool,
    },
    {
      label: "Vlog Studio",
      path: "/vlog-editor",
      icon: Video,
    },
    {
      label: "Avatar Studio",
      path: "/avatar-editor",
      icon: User,
    },
    {
      label: "AI Studio",
      path: "/ai-editor",
      icon: Sparkles,
    },
    {
      label: "Published",
      path: "/my-published",
      icon: Lock,
    },
  ];

  // ================= NAVIGATION HANDLER =================
  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 lg:px-8 py-3">
      <div className="max-w-[1500px] mx-auto">
        {/* =====================================================
            MAIN NAVBAR
        ====================================================== */}
        <div
          className="
            relative
            flex items-center justify-between
            gap-3 sm:gap-5
            px-3 sm:px-5
            py-2.5
            rounded-2xl
            border border-white/10
            bg-slate-950/75
            backdrop-blur-2xl
            shadow-[0_8px_40px_rgba(0,0,0,0.25)]
          "
        >
          {/* Subtle Background Glow */}
          <div
            className="
              absolute inset-0
              rounded-2xl
              bg-gradient-to-r
              from-indigo-500/[0.04]
              via-purple-500/[0.05]
              to-pink-500/[0.04]
              pointer-events-none
            "
          />

          {/* =====================================================
              VLOXAI BRAND
          ====================================================== */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => handleNavigate("/")}
            className="
              relative
              flex items-center gap-2.5
              cursor-pointer
              select-none
              shrink-0
            "
          >
            {/* Logo */}
            <div
              className="
                relative
                w-10 h-10
                sm:w-11 sm:h-11
                rounded-xl
                p-[1.5px]
                bg-gradient-to-br
                from-indigo-400
                via-purple-500
                to-pink-500
                shadow-lg
                shadow-purple-500/20
              "
            >
              <div
                className="
                  w-full h-full
                  rounded-[10px]
                  bg-slate-950
                  flex items-center justify-center
                "
              >
                <WandSparkles
                  className="
                    w-5 h-5
                    text-indigo-300
                    transition-transform
                    duration-300
                  "
                />
              </div>
            </div>

            {/* Brand Text */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span
                  className="
                    text-lg lg:text-xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  VLOX
                  <span
                    className="
                      text-transparent
                      bg-clip-text
                      bg-gradient-to-r
                      from-indigo-400
                      to-pink-400
                    "
                  >
                    AI
                  </span>
                </span>

                <span
                  className="
                    hidden lg:inline-flex
                    px-1.5 py-0.5
                    rounded-full
                    text-[9px]
                    font-bold
                    text-indigo-300
                    bg-indigo-500/10
                    border border-indigo-400/20
                  "
                >
                  AI STUDIO
                </span>
              </div>

              <p
                className="
                  text-[10px]
                  text-slate-500
                  leading-none
                  mt-0.5
                "
              >
                Create • Edit • Publish
              </p>
            </div>
          </motion.div>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}
          <nav
            className="
              hidden
              xl:flex
              items-center
              gap-1
              p-1
              rounded-xl
              bg-white/[0.035]
              border border-white/[0.07]
            "
          >
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`
                    relative
                    flex items-center
                    gap-1.5
                    px-3
                    py-2
                    rounded-lg
                    text-[12px]
                    font-semibold
                    transition-all
                    duration-200
                    whitespace-nowrap

                    ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-white"
                    }
                  `}
                >
                  {/* Active Background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavbarItem"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      }}
                      className="
                        absolute
                        inset-0
                        rounded-lg
                        bg-gradient-to-r
                        from-indigo-600
                        via-purple-600
                        to-indigo-600
                        shadow-lg
                        shadow-indigo-500/20
                      "
                    />
                  )}

                  {/* Icon */}
                  <Icon
                    className={`
                      relative
                      z-10
                      w-3.5
                      h-3.5

                      ${isActive ? "text-white" : "text-slate-500"}
                    `}
                  />

                  {/* Label */}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* =====================================================
              RIGHT SIDE ACTIONS
          ====================================================== */}
          <div
            className="
              relative
              flex
              items-center
              gap-2
            "
          >
            {/* =================================================
                AI CREDITS
            ================================================== */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={() => handleNavigate("/dashboard")}
              className="
                hidden
                md:flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                bg-amber-400/[0.07]
                border border-amber-400/20
                hover:border-amber-400/40
                transition-all
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-center
                  w-6
                  h-6
                  rounded-lg
                  bg-amber-400/10
                "
              >
                <Zap
                  className="
                    w-3.5
                    h-3.5
                    text-amber-400
                    fill-amber-400
                  "
                />
              </div>

              <div className="text-left leading-none">
                <p
                  className="
                    text-[9px]
                    text-slate-500
                    uppercase
                    tracking-wider
                  "
                >
                  Credits
                </p>

                <p
                  className="
                    text-xs
                    font-bold
                    text-amber-300
                    mt-0.5
                  "
                >
                  {aiCredits ?? 0}
                </p>
              </div>
            </motion.button>

            {/* =================================================
                CLERK AUTHENTICATION
            ================================================== */}

            {isClerkAvailable ? (
              <>
                {/* ---------------- SIGNED OUT ---------------- */}
                <SignedOut>
                  <div className="hidden sm:flex items-center gap-1.5">
                    {/* Sign In */}
                    <SignInButton mode="modal" forceRedirectUrl="/tools" signUpForceRedirectUrl="/tools">
                      <button
                        className="
                          flex
                          items-center
                          gap-1.5
                          px-3
                          py-2
                          rounded-xl
                          text-xs
                          font-semibold
                          text-slate-300
                          border border-white/10
                          bg-white/[0.035]
                          hover:bg-white/[0.07]
                          hover:text-white
                          hover:border-indigo-400/30
                          transition-all
                        "
                      >
                        <LogIn
                          className="
                            w-3.5
                            h-3.5
                            text-indigo-400
                          "
                        />
                        Sign In
                      </button>
                    </SignInButton>

                    {/* Register */}
                    <SignUpButton mode="modal" forceRedirectUrl="/tools" signInForceRedirectUrl="/tools">
                      <button
                        className="
                          flex
                          items-center
                          gap-1.5
                          px-3
                          py-2
                          rounded-xl
                          text-xs
                          font-bold
                          text-white
                          bg-white/10
                          border border-white/10
                          hover:bg-white/15
                          transition-all
                        "
                      >
                        <UserPlus
                          className="
                            w-3.5
                            h-3.5
                          "
                        />
                        Register
                      </button>
                    </SignUpButton>
                  </div>
                </SignedOut>

                {/* ---------------- SIGNED IN ---------------- */}
                <SignedIn>
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    {/* Tools Guide */}
                    <button
                      onClick={() => handleNavigate("/tools")}
                      className="
                        flex
                        items-center
                        justify-center
                        w-9
                        h-9
                        rounded-xl
                        bg-cyan-400/[0.08]
                        border
                        border-cyan-300/20
                        text-cyan-300
                        hover:bg-cyan-400/[0.16]
                        hover:border-cyan-300/40
                        hover:text-cyan-100
                        transition-all
                      "
                      title="Open Tools Guide"
                      aria-label="Open Tools Guide"
                    >
                      <GraduationCap className="w-4 h-4" />
                    </button>

                    {/* User Profile */}
                    <UserButton
                      afterSignOutUrl="/"
                      userProfileMode="modal"
                      appearance={{
                        elements: {
                          avatarBox:
                            "w-9 h-9 rounded-xl border border-indigo-400/30 shadow-lg shadow-indigo-500/10",
                        },
                      }}
                    />

                    {/* Dashboard Icon */}
                    <button
                      onClick={() => handleNavigate("/dashboard")}
                      className="
                        hidden
                        lg:flex
                        p-2.5
                        rounded-xl
                        bg-white/[0.035]
                        border border-white/10
                        text-slate-400
                        hover:text-indigo-300
                        hover:border-indigo-400/30
                        hover:bg-indigo-500/[0.05]
                        transition-all
                      "
                      title="Creator Dashboard"
                    >
                      <LayoutDashboard
                        className="
                          w-4
                          h-4
                        "
                      />
                    </button>
                  </div>
                </SignedIn>
              </>
            ) : (
              /* =================================================
                 FALLBACK USER AVATAR
              ================================================== */

              <div
                onClick={() => handleNavigate("/dashboard")}
                className="
                  relative
                  w-9
                  h-9
                  rounded-xl
                  bg-white/[0.05]
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  hover:border-indigo-400/40
                  transition-all
                "
              >
                {currentUserProfile?.avatar ? (
                  <img
                    src={currentUserProfile.avatar}
                    alt="User Avatar"
                    className="
                      w-full
                      h-full
                      rounded-xl
                      object-cover
                    "
                  />
                ) : (
                  <User
                    className="
                      w-4
                      h-4
                      text-slate-300
                    "
                  />
                )}
              </div>
            )}

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================== */}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="
                xl:hidden
                flex
                items-center
                justify-center
                w-10
                h-10
                rounded-xl
                bg-white/[0.04]
                border border-white/10
                text-slate-300
                hover:text-white
                hover:border-indigo-400/30
                transition-all
              "
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.98,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                xl:hidden
                mt-2
                p-2
                rounded-2xl
                bg-slate-950/95
                backdrop-blur-2xl
                border border-white/10
                shadow-2xl
              "
            >
              {/* ================= MOBILE CREDITS ================= */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-3
                  py-3
                  mb-1
                  rounded-xl
                  bg-amber-400/[0.06]
                  border border-amber-400/10
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Zap
                    className="
                      w-4
                      h-4
                      text-amber-400
                      fill-amber-400
                    "
                  />

                  <span
                    className="
                      text-xs
                      font-semibold
                      text-slate-300
                    "
                  >
                    AI Credits
                  </span>
                </div>

                <span
                  className="
                    text-sm
                    font-bold
                    text-amber-300
                  "
                >
                  {aiCredits ?? 0}
                </span>
              </div>

              {/* ================= MOBILE NAV ================= */}

              <div className="grid grid-cols-2 gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={`
                        flex
                        items-center
                        gap-2
                        px-3
                        py-3
                        rounded-xl
                        text-left
                        text-xs
                        font-semibold
                        transition-all

                        ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                        }
                      `}
                    >
                      <Icon
                        className="
                          w-4
                          h-4
                          shrink-0
                        "
                      />

                      {item.label}
                    </button>
                  );
                })}

                {/* Dashboard */}
                <button
                  onClick={() => handleNavigate("/dashboard")}
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-3
                    rounded-xl
                    text-left
                    text-xs
                    font-semibold
                    text-slate-400
                    hover:bg-white/[0.05]
                    hover:text-white
                    transition-all
                  "
                >
                  <LayoutDashboard
                    className="
                      w-4
                      h-4
                    "
                  />
                  Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
