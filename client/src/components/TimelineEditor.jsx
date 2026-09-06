import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Music,
  Subtitles,
  Type,
  Scissors,
  Trash2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Zap,
  Sliders,
  Plus,
  Play,
  Pause,
  Layers,
  Sparkles,
  MoveHorizontal,
  Lock,
  Unlock,
  Upload,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Pin,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';

const TRANSITION_OPTIONS = ['none', 'crossfade', 'wipe', 'slide', 'zoom-blur'];
const SPEED_OPTIONS = [0.25, 0.5, 1, 1.5, 2, 4];

const TimelineEditor = ({
  tracks,
  setTracks,
  currentTime,
  setCurrentTime,
  totalDuration,
  setTotalDuration,
  isPlaying,
  setIsPlaying,
  onAutoSave,
  onOpenImportModal,
  showToast,
}) => {
  // Selection and History state
  const [selectedClipIds, setSelectedClipIds] = useState([]);
  const [rippleMode, setRippleMode] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1); // 1x to 4x
  const [historyStack, setHistoryStack] = useState([JSON.stringify(tracks)]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active clip editor modal / inline inspector state
  const [activeInspectorClip, setActiveInspectorClip] = useState(null);

  // Feature: Retention Heatmap Prediction state
  const [showRetentionCurve, setShowRetentionCurve] = useState(true);

  // Feature: Collaborative EDL Comments state
  const [edlComments, setEdlComments] = useState([
    {
      _id: 'cmt_seed_1',
      timestamp: 15,
      author: 'Nova Director',
      text: 'Add kinetic title zoom here for avatar intro beat',
      resolved: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'cmt_seed_2',
      timestamp: 45,
      author: 'Quill Editor',
      text: 'B-roll cutaway works great here! Check audio balance.',
      resolved: true,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [activeCommentModal, setActiveCommentModal] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedCommentPin, setSelectedCommentPin] = useState(null);

  // Auto-save debouncer
  const autoSaveTimerRef = useRef(null);

  // Retention Heatmap Curve Generator
  const generateRetentionCurve = () => {
    const points = [];
    const steps = 30;
    const duration = totalDuration || 120;

    for (let i = 0; i <= steps; i++) {
      const time = (i / steps) * duration;
      let retention = 92;

      let activeClipsCount = 0;
      let hasBRollOrAudio = false;

      Object.keys(tracks || {}).forEach((tk) => {
        (tracks[tk] || []).forEach((c) => {
          if (time >= c.start && time <= c.start + c.duration) {
            activeClipsCount++;
            if (tk === 'audio' || c.color?.includes('purple') || c.speed > 1) {
              hasBRollOrAudio = true;
            }
          }
        });
      });

      if (time > 15 && time < 45 && !hasBRollOrAudio) retention -= 18;
      if (time > 70 && time < 95 && activeClipsCount < 2) retention -= 22;
      if (hasBRollOrAudio) retention += 12;

      retention = Math.min(98, Math.max(40, retention));
      const x = (i / steps) * 100;
      const y = 100 - retention;
      points.push({ x, y, retention });
    }

    let d = `M 0 ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      d += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const fillD = `${d} L 100 100 L 0 100 Z`;
    return { pathD: d, fillD, points };
  };

  const { pathD, fillD } = generateRetentionCurve();

  // Handle Add Pinned Comment
  const handleAddCommentAtPlayhead = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newCmt = {
      _id: `cmt_${Date.now()}`,
      timestamp: currentTime,
      author: 'Vlox Creator',
      text: newCommentText.trim(),
      resolved: false,
      createdAt: new Date().toISOString(),
    };

    setEdlComments([...edlComments, newCmt]);
    setNewCommentText('');
    setActiveCommentModal(false);
    showToast(`📍 Comment pinned to EDL at ${currentTime}s!`);
  };

  const handleToggleResolveComment = (commentId) => {
    setEdlComments(
      edlComments.map((c) => (c._id === commentId ? { ...c, resolved: !c.resolved } : c))
    );
    showToast('Updated comment status');
  };

  const handleDeleteComment = (commentId) => {
    setEdlComments(edlComments.filter((c) => c._id !== commentId));
    setSelectedCommentPin(null);
    showToast('Comment deleted', 'info');
  };

  // Track history pushing helper
  const updateTracksWithHistory = (newTracks) => {
    setTracks(newTracks);
    const newStack = historyStack.slice(0, historyIndex + 1);
    newStack.push(JSON.stringify(newTracks));
    setHistoryStack(newStack);
    setHistoryIndex(newStack.length - 1);

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (onAutoSave) onAutoSave(newTracks);
    }, 10000);
  };

  // Undo / Redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      const prevTracks = JSON.parse(historyStack[prevIdx]);
      setTracks(prevTracks);
      setHistoryIndex(prevIdx);
      showToast('Undo performed', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIdx = historyIndex + 1;
      const nextTracks = JSON.parse(historyStack[nextIdx]);
      setTracks(nextTracks);
      setHistoryIndex(nextIdx);
      showToast('Redo performed', 'info');
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        handleRedo();
      } else if (e.key.toLowerCase() === 's') {
        handleSplitAtPlayhead();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedClipIds.length > 0) handleDeleteSelectedClips();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, historyStack, selectedClipIds, currentTime, tracks]);

  // Handle Clip Selection
  const handleClipSelect = (clipId, e) => {
    if (e && e.shiftKey) {
      if (selectedClipIds.includes(clipId)) {
        setSelectedClipIds(selectedClipIds.filter((id) => id !== clipId));
      } else {
        setSelectedClipIds([...selectedClipIds, clipId]);
      }
    } else {
      setSelectedClipIds([clipId]);
      for (const trackKey of Object.keys(tracks)) {
        const found = tracks[trackKey].find((c) => c.id === clipId);
        if (found) setActiveInspectorClip({ ...found, trackKey });
      }
    }
  };

  // Cut / Split Clip at Playhead
  const handleSplitAtPlayhead = () => {
    let splitOccurred = false;
    const newTracks = { ...tracks };

    Object.keys(newTracks).forEach((trackKey) => {
      const updatedClips = [];
      newTracks[trackKey].forEach((clip) => {
        const clipEnd = clip.start + clip.duration;
        const isTargeted = selectedClipIds.length === 0 || selectedClipIds.includes(clip.id);

        if (isTargeted && currentTime > clip.start && currentTime < clipEnd) {
          splitOccurred = true;
          const firstDuration = Math.round(currentTime - clip.start);
          const secondDuration = Math.round(clip.duration - firstDuration);

          const firstPart = {
            ...clip,
            duration: firstDuration,
            outPoint: clip.inPoint + firstDuration,
          };
          const secondPart = {
            ...clip,
            id: `${clip.id}_split_${Date.now()}`,
            name: `${clip.name} (Part 2)`,
            start: currentTime,
            duration: secondDuration,
            inPoint: clip.inPoint + firstDuration,
          };

          updatedClips.push(firstPart, secondPart);
        } else {
          updatedClips.push(clip);
        }
      });
      newTracks[trackKey] = updatedClips;
    });

    if (splitOccurred) {
      updateTracksWithHistory(newTracks);
      showToast('✂️ Clip split into two independent segments at playhead!');
    } else {
      showToast('No clip selected or intersected by playhead', 'error');
    }
  };

  // Delete Selected Clips
  const handleDeleteSelectedClips = () => {
    if (selectedClipIds.length === 0) return;

    const newTracks = { ...tracks };
    Object.keys(newTracks).forEach((trackKey) => {
      let currentTrackClips = newTracks[trackKey].filter((c) => !selectedClipIds.includes(c.id));

      if (rippleMode) {
        currentTrackClips = currentTrackClips.map((c, index) => {
          if (index === 0) return c;
          const prevClip = currentTrackClips[index - 1];
          const prevEnd = prevClip.start + prevClip.duration;
          return { ...c, start: prevEnd };
        });
      }
      newTracks[trackKey] = currentTrackClips;
    });

    updateTracksWithHistory(newTracks);
    setSelectedClipIds([]);
    setActiveInspectorClip(null);
    showToast(rippleMode ? '🗑️ Clip removed & gap closed (Ripple Delete)' : '🗑️ Clip deleted', 'info');
  };

  // Update Inspector Clip Property
  const handleUpdateClipProperty = (clipId, property, value) => {
    const newTracks = { ...tracks };
    Object.keys(newTracks).forEach((trackKey) => {
      newTracks[trackKey] = newTracks[trackKey].map((c) => {
        if (c.id === clipId) {
          const updated = { ...c, [property]: value };
          if (property === 'speed') {
            const originalDuration = c.originalDuration || c.duration;
            updated.duration = Math.round(originalDuration / value);
            updated.originalDuration = originalDuration;
          }
          return updated;
        }
        return c;
      });
    });

    updateTracksWithHistory(newTracks);
    if (activeInspectorClip && activeInspectorClip.id === clipId) {
      setActiveInspectorClip({ ...activeInspectorClip, [property]: value });
    }
  };

  // Add Text Overlay Track Clip
  const handleAddTextOverlay = () => {
    const newClip = {
      id: `text_${Date.now()}`,
      name: 'Dynamic Text Overlay',
      start: currentTime,
      duration: 10,
      color: 'bg-rose-600/60 border-rose-400',
      textOverlay: {
        content: 'VLOX AI SPATIAL ENGINE',
        x: 50,
        y: 80,
        font: 'Outfit',
        animation: 'typewriter',
      },
    };

    const newTracks = {
      ...tracks,
      text: [...(tracks.text || []), newClip],
    };
    updateTracksWithHistory(newTracks);
    showToast('📝 Text overlay layer added to timeline!');
  };

  // Scrubber ruler seek handler
  const handleRulerClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = Math.round(percentage * totalDuration);

    let snappedTime = newTime;
    Object.keys(tracks).forEach((tk) => {
      tracks[tk].forEach((c) => {
        if (Math.abs(c.start - newTime) <= 1) snappedTime = c.start;
        if (Math.abs(c.start + c.duration - newTime) <= 1) snappedTime = c.start + c.duration;
      });
    });

    setCurrentTime(snappedTime);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
      {/* Timeline Action Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-outfit">Multi-Track Timeline Engine</h3>
            <p className="text-[10px] text-slate-400 font-mono">EDL Non-Destructive Desktop Editor</p>
          </div>
        </div>

        {/* Editing Tools Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Feature Toggle: Retention Heatmap Overlay */}
          <button
            type="button"
            onClick={() => setShowRetentionCurve(!showRetentionCurve)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showRetentionCurve
                ? 'bg-gradient-to-r from-cyan-600/40 to-violet-600/40 border-cyan-500/50 text-cyan-200 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Toggle Predicted Retention Attention Curve Overlay"
          >
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Retention Curve</span>
          </button>

          {/* Feature: Add Collaborative EDL Comment at Playhead */}
          <button
            type="button"
            onClick={() => setActiveCommentModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/30 border border-amber-500/40 text-amber-200 hover:bg-amber-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
            title="Add Timestamp-Pinned EDL Comment"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Pin Comment</span>
          </button>

          <div className="w-px h-6 bg-slate-800" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              disabled={historyIndex === 0}
              onClick={handleUndo}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={historyIndex >= historyStack.length - 1}
              onClick={handleRedo}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Cut / Split at Playhead */}
          <button
            type="button"
            onClick={handleSplitAtPlayhead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
            title="Split Clip at Playhead (Hotkey: S)"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Split (S)</span>
          </button>

          {/* Delete Selected Clip */}
          <button
            type="button"
            disabled={selectedClipIds.length === 0}
            onClick={handleDeleteSelectedClips}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/30 border border-rose-500/40 text-rose-200 hover:bg-rose-600 hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-30"
            title="Delete Selected Clip (Hotkey: Delete)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          {/* Ripple Mode Toggle */}
          <button
            type="button"
            onClick={() => setRippleMode(!rippleMode)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              rippleMode
                ? 'bg-cyan-600/30 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Ripple Mode (Closes gap on clip delete)"
          >
            {rippleMode ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Ripple</span>
          </button>

          {/* Import Media Button */}
          {onOpenImportModal && (
            <button
              type="button"
              onClick={onOpenImportModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:brightness-110 text-xs font-extrabold shadow-lg shadow-emerald-500/20 cursor-pointer transition-all hover:scale-105"
              title="Import Video from PC File or Record AVD Window"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>+ Import Video</span>
            </button>
          )}

          {/* Timeline Zoom Slider */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
            <ZoomOut
              className="w-3.5 h-3.5 cursor-pointer hover:text-white"
              onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
            />
            <span className="text-[10px] font-mono font-bold w-7 text-center">{zoomLevel}x</span>
            <ZoomIn
              className="w-3.5 h-3.5 cursor-pointer hover:text-white"
              onClick={() => setZoomLevel(Math.min(4, zoomLevel + 0.5))}
            />
          </div>
        </div>
      </div>

      {/* Feature 1: Retention Heatmap Prediction Curve SVG Overlay Band */}
      {showRetentionCurve && (
        <div className="relative h-11 bg-slate-950/90 rounded-2xl border border-cyan-500/30 overflow-hidden p-1 shadow-inner flex flex-col justify-between">
          <div className="absolute top-1 left-3 z-10 flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              Predicted Retention Heatmap Curve
            </span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold">
              EDL Pace Math
            </span>
          </div>

          <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="retentionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="retentionFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={fillD} fill="url(#retentionFill)" />
            <path d={pathD} fill="none" stroke="url(#retentionGradient)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      )}

      {/* Scrubber Time Ruler Bar + Feature 2: Collaborative EDL Comment Pins */}
      <div
        onClick={handleRulerClick}
        className="h-9 bg-slate-950/90 rounded-xl border border-slate-800 relative cursor-pointer overflow-hidden flex items-center px-4 font-mono text-[10px] text-slate-400 select-none"
      >
        {[0, 15, 30, 45, 60, 75, 90, 105, 120].map((t) => (
          <div
            key={t}
            className="absolute top-0 bottom-0 flex flex-col justify-between border-l border-slate-800 pl-1 py-1"
            style={{ left: `${(t / totalDuration) * 100}%` }}
          >
            <span>{t}s</span>
          </div>
        ))}

        {/* Render Collaborative EDL Comment Pin Markers on Ruler */}
        {edlComments.map((cmt) => {
          const leftPct = (cmt.timestamp / totalDuration) * 100;
          return (
            <div
              key={cmt._id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCommentPin(cmt);
              }}
              className={`absolute top-1 -ml-2.5 z-20 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125 shadow-md ${
                cmt.resolved
                  ? 'bg-emerald-500/80 text-white ring-2 ring-emerald-300'
                  : 'bg-amber-500/90 text-slate-950 ring-2 ring-amber-300 animate-pulse'
              }`}
              style={{ left: `${leftPct}%` }}
              title={`Comment by ${cmt.author} at ${cmt.timestamp}s: ${cmt.text}`}
            >
              <MessageSquare className="w-3 h-3" />
            </div>
          );
        })}
      </div>

      {/* Comment Detail Popover Drawer when pin clicked */}
      {selectedCommentPin && (
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 flex items-start justify-between gap-3 text-xs shadow-xl animate-fadeIn">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300 font-mono">
                📍 Pinned at {selectedCommentPin.timestamp}s
              </span>
              <span className="text-[10px] text-slate-400 font-mono">By {selectedCommentPin.author}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                  selectedCommentPin.resolved
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {selectedCommentPin.resolved ? 'Resolved' : 'Pending'}
              </span>
            </div>
            <p className="text-white font-medium">"{selectedCommentPin.text}"</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleToggleResolveComment(selectedCommentPin._id)}
              className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 text-[10px] font-bold cursor-pointer transition-all"
            >
              {selectedCommentPin.resolved ? 'Unresolve' : 'Mark Resolved'}
            </button>

            <button
              type="button"
              onClick={() => handleDeleteComment(selectedCommentPin._id)}
              className="p-1 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-200 text-[10px] cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setSelectedCommentPin(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add Pinned Comment Modal Form */}
      {activeCommentModal && (
        <form onSubmit={handleAddCommentAtPlayhead} className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 font-outfit">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Add EDL Timeline Comment at {currentTime}s</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveCommentModal(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Type comment (e.g. Add B-roll cutaway, fix audio mix...)"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            autoFocus
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveCommentModal(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
            >
              Pin Comment
            </button>
          </div>
        </form>
      )}

      {/* Timeline Tracks Grid Container */}
      <div className="space-y-3 relative overflow-x-auto min-h-[220px]">
        {/* Playhead Scrubber Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 z-30 pointer-events-none transition-all duration-150"
          style={{
            left: `${(currentTime / totalDuration) * 100}%`,
          }}
        >
          <div className="w-3.5 h-3.5 bg-cyan-400 rounded-full -ml-1.5 -mt-1 shadow-lg shadow-cyan-400/80 flex items-center justify-center">
            <span className="w-1 h-1 bg-slate-950 rounded-full" />
          </div>
        </div>

        {/* Track 1: Video Track */}
        <div className="flex items-center gap-3">
          <div className="w-28 flex items-center gap-2 text-xs font-bold text-indigo-300 shrink-0">
            <Film className="w-4 h-4 text-indigo-400" />
            <span>Video Track</span>
          </div>
          <div className="flex-1 h-12 bg-slate-950/80 rounded-xl border border-slate-800 relative overflow-hidden flex items-center px-1">
            {(tracks.video || []).map((clip) => {
              const isSelected = selectedClipIds.includes(clip.id);
              return (
                <div
                  key={clip.id}
                  onClick={(e) => handleClipSelect(clip.id, e)}
                  className={`absolute h-9 px-3 rounded-lg border ${
                    clip.color || 'bg-indigo-600/60 border-indigo-400'
                  } text-white font-bold text-[11px] flex items-center justify-between shadow-md cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-cyan-400 border-white scale-[1.02] z-20' : 'hover:opacity-90'
                  }`}
                  style={{
                    left: `${(clip.start / totalDuration) * 100}%`,
                    width: `${(clip.duration / totalDuration) * 100}%`,
                  }}
                >
                  <span className="truncate">{clip.name}</span>
                  <div className="flex items-center gap-1 text-[9px] font-mono opacity-80 shrink-0">
                    {clip.speed && clip.speed !== 1 && (
                      <span className="px-1 rounded bg-slate-950/60 text-cyan-300">{clip.speed}x</span>
                    )}
                    <span>{clip.duration}s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track 2: Audio Track */}
        <div className="flex items-center gap-3">
          <div className="w-28 flex items-center gap-2 text-xs font-bold text-emerald-300 shrink-0">
            <Music className="w-4 h-4 text-emerald-400" />
            <span>Audio Track</span>
          </div>
          <div className="flex-1 h-10 bg-slate-950/80 rounded-xl border border-slate-800 relative overflow-hidden flex items-center px-1">
            {(tracks.audio || []).map((clip) => {
              const isSelected = selectedClipIds.includes(clip.id);
              return (
                <div
                  key={clip.id}
                  onClick={(e) => handleClipSelect(clip.id, e)}
                  className={`absolute h-7 px-3 rounded-lg border ${
                    clip.color || 'bg-emerald-600/60 border-emerald-400'
                  } text-white font-bold text-[11px] flex items-center justify-between shadow-md cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-cyan-400 border-white scale-[1.02] z-20' : 'hover:opacity-90'
                  }`}
                  style={{
                    left: `${(clip.start / totalDuration) * 100}%`,
                    width: `${(clip.duration / totalDuration) * 100}%`,
                  }}
                >
                  <span className="truncate">{clip.name}</span>
                  <span className="text-[9px] font-mono opacity-80">{clip.duration}s</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track 3: Subtitles / Auto Captions */}
        <div className="flex items-center gap-3">
          <div className="w-28 flex items-center gap-2 text-xs font-bold text-amber-300 shrink-0">
            <Subtitles className="w-4 h-4 text-amber-400" />
            <span>Captions</span>
          </div>
          <div className="flex-1 h-10 bg-slate-950/80 rounded-xl border border-slate-800 relative overflow-hidden flex items-center px-1">
            {(tracks.subtitle || tracks.caption || []).map((clip) => {
              const isSelected = selectedClipIds.includes(clip.id);
              return (
                <div
                  key={clip.id}
                  onClick={(e) => handleClipSelect(clip.id, e)}
                  className={`absolute h-7 px-3 rounded-lg border ${
                    clip.color || 'bg-amber-600/60 border-amber-400'
                  } text-white font-bold text-[11px] flex items-center justify-between shadow-md cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-cyan-400 border-white scale-[1.02] z-20' : 'hover:opacity-90'
                  }`}
                  style={{
                    left: `${(clip.start / totalDuration) * 100}%`,
                    width: `${(clip.duration / totalDuration) * 100}%`,
                  }}
                >
                  <span className="truncate">{clip.text || clip.name}</span>
                  <span className="text-[9px] font-mono opacity-80">{clip.duration}s</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track 4: Text Overlay Track */}
        {tracks.text && tracks.text.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-28 flex items-center gap-2 text-xs font-bold text-rose-300 shrink-0">
              <Type className="w-4 h-4 text-rose-400" />
              <span>Text Layers</span>
            </div>
            <div className="flex-1 h-10 bg-slate-950/80 rounded-xl border border-slate-800 relative overflow-hidden flex items-center px-1">
              {tracks.text.map((clip) => {
                const isSelected = selectedClipIds.includes(clip.id);
                return (
                  <div
                    key={clip.id}
                    onClick={(e) => handleClipSelect(clip.id, e)}
                    className={`absolute h-7 px-3 rounded-lg border ${
                      clip.color || 'bg-rose-600/60 border-rose-400'
                    } text-white font-bold text-[11px] flex items-center justify-between shadow-md cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-cyan-400 border-white scale-[1.02] z-20' : 'hover:opacity-90'
                    }`}
                    style={{
                      left: `${(clip.start / totalDuration) * 100}%`,
                      width: `${(clip.duration / totalDuration) * 100}%`,
                    }}
                  >
                    <span className="truncate">{clip.textOverlay?.content || clip.name}</span>
                    <span className="text-[9px] font-mono opacity-80">{clip.duration}s</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected Clip Inspector Drawer */}
      {activeInspectorClip && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 font-mono font-bold">
              INSPECTOR: {activeInspectorClip.name}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Speed Multiplier */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Speed:</span>
              <select
                value={activeInspectorClip.speed || 1}
                onChange={(e) =>
                  handleUpdateClipProperty(
                    activeInspectorClip.id,
                    'speed',
                    parseFloat(e.target.value)
                  )
                }
                className="px-2 py-1 rounded-lg bg-slate-900 text-white border border-slate-800 focus:outline-none"
              >
                {SPEED_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}x
                  </option>
                ))}
              </select>
            </div>

            {/* Transition preset */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Transition:</span>
              <select
                value={activeInspectorClip.transitionIn || 'none'}
                onChange={(e) =>
                  handleUpdateClipProperty(activeInspectorClip.id, 'transitionIn', e.target.value)
                }
                className="px-2 py-1 rounded-lg bg-slate-900 text-white border border-slate-800 focus:outline-none capitalize"
              >
                {TRANSITION_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setActiveInspectorClip(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineEditor;
