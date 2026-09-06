import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Image as ImageIcon,
  Mic2,
  Play,
  Sparkles,
  Video,
  Wand2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { api } from "../services/api";
import { useBlog } from "../context/BlogContext";

const avatarData = [
  [
    "Aria",
    "Warm presenter",
    "Studio Female",
    "photo-1534528741775-53994a69daeb",
  ],
  [
    "Kael",
    "Tech storyteller",
    "Studio Male",
    "photo-1507003211169-0a1dd7228f2d",
  ],
  ["Mira", "Product guide", "Clear Female", "photo-1517841905240-472988babdf9"],
  [
    "Noah",
    "Business host",
    "Executive Male",
    "photo-1500648767791-00dcc994a43e",
  ],
  [
    "Sofia",
    "Lifestyle narrator",
    "Soft Female",
    "photo-1494790108377-be9c29b29330",
  ],
  [
    "Ethan",
    "Practical educator",
    "Natural Male",
    "photo-1506794778202-cad84cf45f1d",
  ],
  [
    "Zoya",
    "Creative guide",
    "Bright Female",
    "photo-1488426862026-3ee34a7d66df",
  ],
  [
    "Leo",
    "Startup storyteller",
    "Confident Male",
    "photo-1519085360753-af0119f7cbe7",
  ],
  ["Nia", "Wellness host", "Warm Female", "photo-1544005313-94ddf0286df2"],
  ["Owen", "Creative director", "Deep Male", "photo-1560250097-0b93528c311a"],
].map(([name, role, voice, photo]) => ({
  name,
  role,
  voice,
  image: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=800&q=85`,
}));

const AvatarEditor = () => {
  const navigate = useNavigate();
  const { saveAvatarAsset } = useBlog();
  const [selected, setSelected] = useState(avatarData[0]);
  const [script, setScript] = useState(
    "Welcome to VloxAI. Today, I am going to share an idea worth turning into your next video.",
  );
  const [assetPrompt, setAssetPrompt] = useState("");
  const [assetPlan, setAssetPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);
  const [savedAvatarId, setSavedAvatarId] = useState("");
  const saveAvatarProject = (plan = assetPlan) => {
    const saved = saveAvatarAsset({
      _id: savedAvatarId || undefined,
      title: `${selected.name} presenter project`,
      presenter: selected,
      image: selected.image,
      description: script,
      script,
      assetPlan: plan,
      type: "avatar",
    });
    setSavedAvatarId(saved._id);
    return saved;
  };
  const planAsset = async (type) => {
    setLoading(true);
    const res = await api.chatCopilot({
      persona: "nova",
      actionType: "custom",
      prompt: `Write a concise production prompt for a ${type}. Selected presenter: ${selected.name}, ${selected.role}. Script: ${script}. Direction: ${assetPrompt}. Include lighting, framing and negative constraints.`,
    });
    setLoading(false);
    const plan = res?.reply || "Could not prepare a generation prompt.";
    setAssetPlan(plan);
    saveAvatarProject(plan);
  };
  const improveScript = async () => {
    if (!script.trim()) return;
    setScriptLoading(true);
    const res = await api.polishText({ contentHtml: `<p>${script}</p>`, tone: "natural, engaging presenter narration" });
    setScriptLoading(false);
    if (res?.success && res.polishedHtml) setScript(res.polishedHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  };
  const previewVoice = () => {
    if (!script.trim() || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.94;
    utterance.onend = () => setIsPreviewingVoice(false);
    setIsPreviewingVoice(true);
    window.speechSynthesis.speak(utterance);
  };
  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-pink-300">
            Avatar Studio
          </p>
          <h1 className="mt-3 whitespace-nowrap font-outfit text-3xl font-black sm:text-4xl">
            Choose the face of your next story.
          </h1>
          <p className="mt-4 leading-7 text-slate-400">
            Pick from ten presenters, prepare their voice and script, then
            create a visual production brief.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {avatarData.map((avatar) => (
                <button
                  key={avatar.name}
                  onClick={() => setSelected(avatar)}
                  className={`overflow-hidden rounded-2xl border text-left transition ${selected.name === avatar.name ? "border-pink-300 ring-2 ring-pink-400/25" : "border-white/10 hover:border-white/30"}`}
                >
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="aspect-square w-full object-cover"
                  />
                  <span className="block p-2 text-xs font-bold">
                    {avatar.name}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-pink-300/20 bg-pink-400/[0.06] p-4">
              <img
                src={selected.image}
                alt=""
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div>
                <p className="font-bold">{selected.name}</p>
                <p className="text-xs text-slate-400">
                  {selected.role} · {selected.voice}
                </p>
              </div>
            </div>
          </section>
          <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 sm:p-7">
            <div className="flex items-center gap-2">
              <Mic2 className="h-5 w-5 text-cyan-300" />
              <h2 className="font-bold">Presenter settings</h2>
            </div>
            <label className="mt-6 block text-xs font-bold text-slate-300">
              Voice
            </label>
            <select className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm">
              <option>{selected.voice}</option>
              <option>Natural Narrator</option>
              <option>Energetic Creator</option>
            </select>
            <label className="mt-5 block text-xs font-bold text-slate-300">
              Presenter script
            </label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={7}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-slate-200 focus:outline-none focus:border-pink-300/50"
            />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={previewVoice} className="flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] p-3 text-xs font-bold hover:bg-white/10">
                <Play className="h-4 w-4" />
                {isPreviewingVoice ? "Playing..." : "Preview voice"}
              </button>
              <button type="button" disabled={scriptLoading} onClick={improveScript} className="flex items-center justify-center gap-2 rounded-xl border border-violet-300/25 bg-violet-400/10 p-3 text-xs font-bold text-violet-100 hover:bg-violet-400/20 disabled:opacity-50">
                <Wand2 className="h-4 w-4" />
                {scriptLoading ? "Improving..." : "Improve script"}
              </button>
            </div>
            <button
              onClick={() => {
                saveAvatarProject();
                navigate("/vlog-editor", {
                  state: {
                    repurposedScript: script,
                    projectTitle: `${selected.name} presenter video`,
                    selectedAvatar: {
                      id: `avatar-${selected.name.toLowerCase()}`,
                      name: selected.name,
                      voice: selected.voice,
                      avatarImg: selected.image,
                    },
                  },
                });
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 p-3 font-bold"
            >
              Use in Vlog Studio <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => saveAvatarProject()}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-pink-300/30 bg-pink-400/10 p-3 text-xs font-bold text-pink-100 hover:bg-pink-400/20"
            >
              Save avatar project
            </button>
          </section>
        </div>
        <section className="mt-6 rounded-3xl border border-violet-300/20 bg-gradient-to-br from-violet-500/10 to-slate-950 p-6 sm:p-7">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-300" />
            <h2 className="font-bold">Avatar image & video generation</h2>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Prepare an image or video scene prompt for your selected presenter.
          </p>
          <input
            value={assetPrompt}
            onChange={(e) => setAssetPrompt(e.target.value)}
            placeholder="e.g. neon studio, close-up, confident expression"
            className="mt-4 w-full rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm"
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              disabled={loading}
              onClick={() => planAsset("avatar image")}
              className="flex items-center justify-center gap-2 rounded-xl border border-pink-300/25 bg-pink-400/10 p-3 text-sm font-bold text-pink-100 hover:bg-pink-400/20"
            >
              <ImageIcon className="h-4 w-4" />
              Generate image prompt
            </button>
            <button
              disabled={loading}
              onClick={() => planAsset("avatar video scene")}
              className="flex items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-400/10 p-3 text-sm font-bold text-cyan-100 hover:bg-cyan-400/20"
            >
              <Video className="h-4 w-4" />
              {loading ? "Preparing..." : "Generate video prompt"}
            </button>
          </div>
          {assetPlan && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">
              {assetPlan}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default AvatarEditor;
