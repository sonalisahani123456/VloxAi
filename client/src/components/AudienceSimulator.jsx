import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { api } from '../services/api';
import { Users, AlertTriangle, ChevronDown, ChevronUp, RefreshCw, Sparkles, MessageSquare } from 'lucide-react';

const AudienceSimulator = ({ title, contentHtml, script }) => {
  const { consumeAiCredits, showToast } = useBlog();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationData, setSimulationData] = useState(null);

  const handleSimulate = async () => {
    const contentToTest = contentHtml || script || title;
    if (!contentToTest || !contentToTest.trim()) {
      showToast('Write story text or enter a title first to simulate audience reaction', 'error');
      return;
    }
    if (!consumeAiCredits(5)) return;

    setIsLoading(true);
    const res = await api.simulateAudience({ title, contentHtml, script });
    setIsLoading(false);

    if (res && res.success) {
      setSimulationData(res);
      showToast('🎭 Audience Simulator generated reactions from 3 personas!');
    } else {
      showToast(res?.message || 'Error running audience simulation', 'error');
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-violet-500/30 space-y-4 shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-violet-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-outfit">Audience Simulator</h4>
            <p className="text-[10px] text-violet-300 font-mono">Reader & Viewer Persona Testing</p>
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
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSimulate}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-violet-600/30 via-purple-600/30 to-pink-600/20 border border-violet-500/40 text-violet-100 hover:brightness-110 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-violet-300" />
              ) : (
                <Sparkles className="w-4 h-4 text-pink-400" />
              )}
              <span>Simulate Reader Personas</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-violet-500/30 text-[10px] font-mono">5 Cr</span>
          </button>

          {simulationData && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">Predicted Audience Engagement:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-extrabold text-sm">
                  {simulationData.overallEngagement || '85%'}
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {(simulationData.personas || []).map((persona, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-900/90 border border-violet-500/20 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <span className="text-base">{persona.avatar || '👤'}</span>
                        <span>{persona.name}</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          persona.dropoffRisk?.includes('High') || persona.dropoffRisk?.includes('Medium')
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        Risk: {persona.dropoffRisk || 'Low'}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      "{persona.reaction}"
                    </p>

                    {persona.objection && (
                      <div className="p-2 rounded-xl bg-slate-950/80 border border-amber-500/30 text-[10px] text-amber-200 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>Objection:</strong> {persona.objection}</span>
                      </div>
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

export default AudienceSimulator;
