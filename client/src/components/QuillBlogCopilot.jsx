import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { api } from '../services/api';
import AudienceSimulator from './AudienceSimulator';
import {
  Feather,
  Wand2,
  Sparkles,
  Tag,
  AlertCircle,
  TrendingUp,
  Check,
  RefreshCw,
  Zap,
  Fingerprint,
  Video,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

// Gemini may occasionally return Markdown even when asked for HTML.
// Convert the common Markdown markers so the visual editor never shows ** or ***.
const normalizeArticleHtml = (value = '') => {
  const clean = value.replace(/```html|```markdown|```/gi, '').trim();
  if (/<(?:h[1-6]|p|ul|ol|li|blockquote|strong|em)[\s>]/i.test(clean)) {
    return clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*{3,}/g, '');
  }

  const lines = clean.split('\n');
  const blocks = [];
  let listItems = [];
  const flushList = () => {
    if (listItems.length) blocks.push(`<ul>${listItems.map((item) => `<li>${item}</li>`).join('')}</ul>`);
    listItems = [];
  };
  lines.forEach((line) => {
    const text = line.trim();
    if (!text) return;
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
    if (/^[-*]\s+/.test(formatted)) { listItems.push(formatted.replace(/^[-*]\s+/, '')); return; }
    flushList();
    if (/^###\s+/.test(formatted)) blocks.push(`<h3>${formatted.replace(/^###\s+/, '')}</h3>`);
    else if (/^##\s+/.test(formatted)) blocks.push(`<h2>${formatted.replace(/^##\s+/, '')}</h2>`);
    else if (/^#\s+/.test(formatted)) blocks.push(`<h1>${formatted.replace(/^#\s+/, '')}</h1>`);
    else blocks.push(`<p>${formatted}</p>`);
  });
  flushList();
  return blocks.join('');
};

const QuillBlogCopilot = ({ title, subTitle, category, contentHtml, setContentHtml, setTitle, setSeoKeywords }) => {
  const { consumeAiCredits, showToast } = useBlog();
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = useState(null); // 'outline' | 'polish' | 'seo' | 'headline' | 'factcheck' | 'voicedna' | 'repurpose'

  // Headline A/B state
  const [headlineVariants, setHeadlineVariants] = useState([]);
  // Fact check state
  const [factFlags, setFactFlags] = useState([]);
  // Voice DNA state
  const [voiceDnaData, setVoiceDnaData] = useState(null);
  // Cross-format Repurposing state
  const [repurposedVlogScript, setRepurposedVlogScript] = useState(null);

  // 1. Generate Outline
  const handleGenerateOutline = async () => {
    if (!title.trim()) {
      showToast('Please enter a story title first to generate an outline', 'error');
      return;
    }
    if (!consumeAiCredits(10)) return;

    setLoadingAction('outline');
    const res = await api.generateOutline({ title, subTitle, category });
    setLoadingAction(null);

    if (res && res.success && res.outline) {
      setContentHtml(normalizeArticleHtml(res.outline));
      showToast('✨ Scribe generated a structured story outline!');
    } else {
      showToast(res.message || 'Error generating outline', 'error');
    }
  };

  // 2. Polish Tone & Prose
  const handlePolishTone = async () => {
    if (!contentHtml.trim()) {
      showToast('No text content to polish!', 'error');
      return;
    }
    if (!consumeAiCredits(5)) return;

    setLoadingAction('polish');
    const res = await api.polishText({ contentHtml, tone: 'executive editorial' });
    setLoadingAction(null);

    if (res && res.success && res.polishedHtml) {
      setContentHtml(res.polishedHtml);
      showToast('✒️ Scribe polished your draft for clarity and flow!');
    } else {
      showToast(res.message || 'Error polishing text', 'error');
    }
  };

  // 3. Voice DNA Continuity Checker
  const handleVoiceDnaCheck = async () => {
    if (!contentHtml.trim()) {
      showToast('Write or generate story content to check Voice DNA drift', 'error');
      return;
    }
    if (!consumeAiCredits(5)) return;

    setLoadingAction('voicedna');
    const res = await api.analyzeVoiceDna({ contentHtml });
    setLoadingAction(null);

    if (res && res.success) {
      setVoiceDnaData(res);
      showToast('🧬 Voice DNA continuity check complete!');
    } else {
      showToast(res?.message || 'Error checking Voice DNA', 'error');
    }
  };

  // 4. Cross-Format Repurposing: Blog -> Vlog
  const handleRepurposeToVlog = async () => {
    if (!title.trim() && !contentHtml.trim()) {
      showToast('Enter a title or blog text first to repurpose into a vlog script', 'error');
      return;
    }
    if (!consumeAiCredits(10)) return;

    setLoadingAction('repurpose');
    // Reuses existing generateVlogScript endpoint!
    const res = await api.generateVlogScript({
      title: title || 'Blog Story',
      avatarName: 'Quill Digital Presenter',
      avatarVoice: 'Executive Studio Voice',
    });
    setLoadingAction(null);

    if (res && res.success && res.script) {
      setRepurposedVlogScript(res.script);
      showToast('🎬 Blog successfully repurposed into Vlog Presenter Script!');
    } else {
      showToast(res?.message || 'Error repurposing to vlog', 'error');
    }
  };

  // 5. Headline A/B Generator
  const handleHeadlineAB = async () => {
    if (!title.trim()) {
      showToast('Enter a title first for A/B variant testing', 'error');
      return;
    }
    if (!consumeAiCredits(5)) return;

    setLoadingAction('headline');
    const res = await api.generateHeadlineAB({ title, category });
    setLoadingAction(null);

    if (res && res.success && res.variants) {
      setHeadlineVariants(res.variants);
      showToast('📈 Scribe created 3 headline options!');
    } else {
      showToast(res.message || 'Error generating headlines', 'error');
    }
  };

  // 6. Fact Check Draft
  const handleFactCheck = async () => {
    if (!contentHtml.trim()) {
      showToast('Write or generate story content to run fact-checker', 'error');
      return;
    }
    if (!consumeAiCredits(5)) return;

    setLoadingAction('factcheck');
    const res = await api.factCheckDraft({ contentHtml });
    setLoadingAction(null);

    if (res && res.success && res.flags) {
      setFactFlags(res.flags);
      showToast(
        res.flags.length > 0
          ? `🔍 Scribe flagged ${res.flags.length} claim(s) for verification`
          : '✅ Scribe found no unverified claims in this draft.'
      );
    } else {
      showToast(res.message || 'Error running fact check', 'error');
    }
  };

  // 7. Generate SEO Tags
  const handleSeoTags = async () => {
    if (!title.trim()) {
      showToast('Enter a title first for SEO tag extraction', 'error');
      return;
    }
    if (!consumeAiCredits(5)) return;

    setLoadingAction('seo');
    const res = await api.generateSeoTags({ title, category, contentHtml });
    setLoadingAction(null);

    if (res && res.success && res.tags) {
      setSeoKeywords(res.tags);
      showToast('🏷️ Scribe generated SEO tags!');
    } else {
      showToast(res.message || 'Error generating SEO tags', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel-glow p-6 rounded-3xl border border-indigo-500/30 space-y-6">
        {/* Copilot Persona Header */}
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-outfit">Scribe — Editorial Intelligence</h3>
              <p className="text-[10px] text-indigo-300 font-mono">AI writing partner</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
            Editorial AI
          </span>
        </div>

        {/* Action 1: Auto Outline */}
        <div className="space-y-2">
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={handleGenerateOutline}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-600 hover:text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              {loadingAction === 'outline' ? (
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span>Generate Full Outline</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/30 text-[10px] font-mono">10 Cr</span>
          </button>
        </div>

        {/* Action 2: Voice DNA Continuity Checker */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={handleVoiceDnaCheck}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-violet-600/20 border border-violet-500/40 text-violet-200 hover:bg-violet-600 hover:text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              {loadingAction === 'voicedna' ? (
                <RefreshCw className="w-4 h-4 animate-spin text-violet-300" />
              ) : (
                <Fingerprint className="w-4 h-4" />
              )}
              <span>Voice DNA Continuity Check</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-violet-500/30 text-[10px] font-mono">5 Cr</span>
          </button>

          {voiceDnaData && (
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-violet-500/30 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-violet-300">
                <span>Dominant Tone: {voiceDnaData.fingerprint?.dominantTone}</span>
                <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-200">
                  Consistency: {voiceDnaData.fingerprint?.consistencyScore}
                </span>
              </div>

              {voiceDnaData.driftFlags?.length > 0 ? (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] text-amber-300 font-bold font-mono block">
                    ⚠️ Tone Drift Callouts:
                  </span>
                  {voiceDnaData.driftFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-1"
                    >
                      <p className="text-[11px] font-medium text-amber-200 border-l-2 border-amber-400 pl-2">
                        "{flag.snippet}"
                      </p>
                      <p className="text-[10px] text-amber-300 font-bold">{flag.issue}</p>
                      <p className="text-[10px] text-slate-400 italic">Suggestion: {flag.suggestion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-emerald-400 font-medium">
                  ✅ Excellent! Your draft maintains consistent brand voice fingerprint.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action 3: Cross-Format Repurposing (Blog -> Vlog) */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={handleRepurposeToVlog}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-pink-600/20 border border-pink-500/40 text-pink-200 hover:bg-pink-600 hover:text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              {loadingAction === 'repurpose' ? (
                <RefreshCw className="w-4 h-4 animate-spin text-pink-300" />
              ) : (
                <Video className="w-4 h-4 text-pink-400" />
              )}
              <span>Turn Blog into Vlog Script</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-pink-500/30 text-[10px] font-mono">10 Cr</span>
          </button>

          {repurposedVlogScript && (
            <div className="p-3 rounded-2xl bg-slate-950/90 border border-pink-500/40 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-pink-300 font-mono block">
                🎬 Repurposed Avatar Presenter Script:
              </span>
              <p className="text-[11px] text-slate-300 italic max-h-24 overflow-y-auto p-2 rounded-xl bg-slate-900 border border-slate-800">
                "{repurposedVlogScript}"
              </p>
              <button
                type="button"
                onClick={() => navigate('/vlog-editor', { state: { repurposedScript: repurposedVlogScript, projectTitle: `Vlog: ${title}` } })}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer hover:brightness-110"
              >
                <span>Launch in Vlog AI Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Action 4: Polish Tone & Cadence */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={handlePolishTone}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-200 hover:bg-purple-600 hover:text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              {loadingAction === 'polish' ? (
                <RefreshCw className="w-4 h-4 animate-spin text-purple-300" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Polish Tone & Readability</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/30 text-[10px] font-mono">5 Cr</span>
          </button>
        </div>

        {/* Action 5: Headline A/B Generator */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={handleHeadlineAB}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-600 hover:text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              {loadingAction === 'headline' ? (
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              <span>Headline A/B Tester</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/30 text-[10px] font-mono">5 Cr</span>
          </button>

          {headlineVariants.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold text-cyan-300 font-mono block">
                Suggested CTR Variants:
              </span>
              {headlineVariants.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-white leading-snug">{item.headline}</p>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold shrink-0">
                      {item.predictedCTR}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic">{item.ctrReason}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setTitle(item.headline);
                      showToast('Applied title variant!');
                    }}
                    className="px-2 py-1 rounded bg-indigo-600/40 hover:bg-indigo-600 text-white text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 mt-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Apply Title</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action 6: Fact-Check Flag Advisory */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={handleFactCheck}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-600/20 border border-amber-500/40 text-amber-200 hover:bg-amber-600 hover:text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              {loadingAction === 'factcheck' ? (
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>Fact-Check Draft Flags</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/30 text-[10px] font-mono">5 Cr</span>
          </button>

          {factFlags.length > 0 && (
            <div className="space-y-2 pt-2">
              {factFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs space-y-1"
                >
                  <p className="text-[11px] font-bold text-amber-300 font-mono">
                    ⚠️ Claim: "{flag.claim}"
                  </p>
                  <p className="text-[10px] text-slate-300">{flag.reason}</p>
                  <p className="text-[10px] text-slate-400 italic">Suggestion: {flag.suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action 7: SEO Meta Tags */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={handleSeoTags}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-600 hover:text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Generate SEO Tags</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-[10px] font-mono">5 Cr</span>
          </button>
        </div>
      </div>

      {/* Audience Simulator Panel */}
      <AudienceSimulator title={title} contentHtml={contentHtml} />
    </div>
  );
};

export default QuillBlogCopilot;
