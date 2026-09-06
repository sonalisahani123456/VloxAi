import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogEditor from "./pages/BlogEditor";
import VlogEditor from "./pages/VlogEditor";
import Dashboard from "./pages/Dashboard";
import ToolsGuide from "./pages/ToolsGuide";
import AvatarEditor from "./pages/AvatarEditor";
import AiEditor from "./pages/AiEditor";
import MyPublished from "./pages/MyPublished";
import Background3D from "./components/Background3D";
import Toast from "./components/Toast";
import AiChatbot from "./components/AiChatbot";
import UserProfileSync from "./components/UserProfileSync";
import ErrorBoundary from "./components/ErrorBoundary";

const isClerkAvailable = Boolean(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY &&
  !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.includes("example"),
);

const App = () => {
  return (
    <div className="relative min-h-screen text-slate-100 bg-[#080c14] selection:bg-indigo-500 selection:text-white">
      {/* 3D WebGL Canvas Interactive Background */}
      <ErrorBoundary>
        <Background3D />
      </ErrorBoundary>

      {/* Clerk User Profile First-Time Sync */}
      {isClerkAvailable && <UserProfileSync />}

      {/* Floating Glowing Notification Toast */}
      <Toast />

      {/* AI Vlox Assistant Copilot Floating Chatbot */}
      <AiChatbot />

      {/* Main Application Router */}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/create-blog" element={<BlogEditor />} />
          <Route path="/edit-blog/:id" element={<BlogEditor />} />
          <Route path="/vlog-editor" element={<VlogEditor />} />
          <Route path="/my-published" element={<MyPublished />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tools" element={<ToolsGuide />} />
          <Route path="/avatar-editor" element={<AvatarEditor />} />
          <Route path="/ai-editor" element={<AiEditor />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;
