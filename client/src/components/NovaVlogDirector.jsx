import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { api } from '../services/api';
import {
  Clapperboard,
  Wand2,
  Sparkles,
  Subtitles,
  Film,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  RefreshCw,
  Plus,
  PenTool,
  ArrowRight,
} from 'lucide-react';

const NovaVlogDirector = ({
  projectTitle,
  selectedAvatar,
  avatarScript,
  setAvatarScript,
  onApplyShotList,
  onApplyCaptions,
  onApplyBRoll,
}) => {
  const { consumeAiCredits, showToast } = useBlog();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null); // 'script' | 'shotlist' | 'captions' | 'broll' | 'repurpose'

  const [shotList, setShotList] = useState([]);
  const [brollSuggestions, setBrollSuggestions] = useState([]);
  const [repurposedBlogOutline, setRepurposedBlogOutline] = useState(null);

  // 1. Script Writer
  const handleGenerateScript = async () => {
    if (!consumeAiCredits(10)) return;
    setLoadingAction('script');

    const res = await api.generateVlogScript({
      title: projectTitle,
      avatarName: selectedAvatar?.name,
      avatarVoice: selectedAvatar?.voice,
    });
    setLoadingAction(null);

    if (res && res.success && res.script) {
      setAvatarScript(res.script);
      showToast('🎬 Frame created a high-energy presenter script!');
    } else {
      showToast(res.message || 'Error generating script', 'error');
    }
  };

  // 2. Cross-Format Repurposing: Vlog -> Blog Outline
  const handleRepurposeToBlog = async () => {
    if (!projectTitle.trim() && !avatarScript.trim()) {
      showToast('Enter a project title or script first to repurpose into a blog article', 'error');
      return;
    }
    if (!consumeAiCredits(10)) return;

    setLoadingAction('repurpose');
    // Reuses existing generateOutline endpoint!
    const res = await api.generateOutline({
      title: projectTitle || 'Vlog Story Breakdown',
      subTitle: avatarScript ? avatarScript.substring(0, 100) + '...' : '',
      category: 'Vlog Adaptation',
    });
    setLoadingAction(null);

    if (res && res.success && res.outline) {
      setRepurposedBlogOutline(res.outline);
      showToast('📝 Vlog successfully repurposed into Blog Story Outline!');
    } else {
      showToast(res?.message || 'Error repurposing to blog', 'error');
    }
  };

  // 3. Shot List Generator
  const handleGenerateShotList = async () => {
    if (!avatarScript.trim()) {
      showToast('Generate or enter a speech script first', 'error');
      return;
    }
    if (!consumeAiCredits(10)) return;
    setLoadingAction('shotlist');

    const res = await api.generateShotList({ script: avatarScript, title: projectTitle });
    setLoadingAction(null);

    if (res && res.success && res.shots) {
      setShotList(res.shots);
      showToast('🎥 Frame created a scene-by-scene shot list!');
    } else {
      showToast(res.message || 'Error generating shot list', 'error');
    }
  };

  // 4. Auto-Caption Generator
  const handleGenerateCaptions = async () => {
    if (!avatarScript.trim()) {
      showToast('Script is empty! Cannot generate captions.', 'error');
      return;
    }
    if (!consumeAiCredits(5)) return;
    setLoadingAction('captions');

    const res = await api.generateAutoCaptions({ script: avatarScript });
    setLoadingAction(null);

    if (res && res.success && res.captions) {
      if (onApplyCaptions) onApplyCaptions(res.captions);
      showToast('💬 Auto-captions synchronized to speech pace (~150 wpm)!');
    } else {
      showToast(res.message || 'Error generating captions', 'error');
    }
  };

  // 5. B-Roll & Transition Suggester
  const handleGenerateBRoll = async () => {
    if (!avatarScript.trim()) {
      showToast('Script is required for B-Roll recommendations', 'error');
      return;
    }
    if (!consumeAiCredits(5)) return;
    setLoadingAction('broll');

    const res = await api.generateBRollSuggestions({ script: avatarScript });
    setLoadingAction(null);

    if (res && res.success && res.suggestions) {
      setBrollSuggestions(res.suggestions);
      showToast('✂️ Frame recommended B-roll cutaways and transitions!');
    } else {
      showToast(res.message || 'Error generating B-roll suggestions', 'error');
    }
  };

  return (
    <div className="glass-panel-glow rounded-3xl border border-cyan-500/40 p-5 space-y-4 shadow-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-md">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-outfit">Frame — Video Director</h4>
            <p className="text-[10px] text-cyan-300 font-mono">On-Set Script & Beat Director</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1">
          {/* Action grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loadingAction !== null}
              onClick={handleGenerateScript}
              className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-600 hover:text-white font-bold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              <span>Write Script (10 Cr)</span>
            </button>

            <button
              type="button"
              disabled={loadingAction !== null}
              onClick={handleGenerateShotList}
              className="p-3 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-600 hover:text-white font-bold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Film className="w-4 h-4" />
              <span>Shot List (10 Cr)</span>
            </button>

            <button
              type="button"
              disabled={loadingAction !== null}
              onClick={handleGenerateCaptions}
              className="p-3 rounded-2xl bg-amber-600/20 border border-amber-500/40 text-amber-200 hover:bg-amber-600 hover:text-white font-bold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Subtitles className="w-4 h-4" />
              <span>Auto Captions (5 Cr)</span>
            </button>

            <button
              type="button"
              disabled={loadingAction !== null}
              onClick={handleGenerateBRoll}
              className="p-3 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-200 hover:bg-purple-600 hover:text-white font-bold text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Layers className="w-4 h-4" />
              <span>B-Roll Suggester (5 Cr)</span>
            </button>
          </div>

          {/* Cross-Format Repurposing (Vlog -> Blog) */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              disabled={loadingAction !== null}
              onClick={handleRepurposeToBlog}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-pink-600/20 border border-pink-500/40 text-pink-200 hover:bg-pink-600 hover:text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                {loadingAction === 'repurpose' ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-pink-300" />
                ) : (
                  <PenTool className="w-4 h-4 text-pink-400" />
                )}
                <span>Turn Vlog into Blog Article</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-pink-500/30 text-[10px] font-mono">10 Cr</span>
            </button>

            {repurposedBlogOutline && (
              <div className="mt-2 p-3 rounded-2xl bg-slate-950/90 border border-pink-500/40 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-pink-300 font-mono block">
                  📝 Repurposed Blog Story Outline:
                </span>
                <div
                  className="text-[11px] text-slate-300 max-h-28 overflow-y-auto p-2 rounded-xl bg-slate-900 border border-slate-800 prose prose-invert text-left"
                  dangerouslySetInnerHTML={{ __html: repurposedBlogOutline }}
                />
                <button
                  type="button"
                  onClick={() => navigate('/create-blog', { state: { repurposedOutline: repurposedBlogOutline, title: `Blog: ${projectTitle}` } })}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer hover:brightness-110"
                >
                  <span>Launch in Blog Author Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Shot List Output Drawer */}
          {shotList.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-cyan-300 font-mono block">
                🎬 Director's Scene Beats:
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {shotList.map((shot, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400">
                      <span>{shot.timecode}</span>
                      <span>Framing: {shot.framing}</span>
                    </div>
                    <p className="text-white font-medium">{shot.beat}</p>
                    <p className="text-[10px] text-indigo-300 italic">Gesture: {shot.gesture}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* B-Roll Suggestions Output Drawer */}
          {brollSuggestions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-purple-300 font-mono block">
                ✂️ Recommended Cutaways & Transitions:
              </span>
              <div className="space-y-2">
                {brollSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 text-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        At {item.recommendedAt || '0:15'} • Transition: {item.transition}
                      </p>
                    </div>
                    {onApplyBRoll && (
                      <button
                        type="button"
                        onClick={() => onApplyBRoll(item)}
                        className="px-2.5 py-1 rounded.lg bg-purple-600/40 hover:bg-purple-600 text-white text-[10px] font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Clip</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NovaVlogDirector;
