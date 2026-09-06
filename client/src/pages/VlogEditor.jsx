import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TimelineEditor from '../components/TimelineEditor';
import NovaVlogDirector from '../components/NovaVlogDirector';
import AudienceSimulator from '../components/AudienceSimulator';
import { useBlog } from '../context/BlogContext';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  Play,
  Pause,
  Monitor,
  Smartphone,
  Square,
  Bot,
  Share2,
  Download,
  Sparkles,
  Layers,
  Wand2,
  CheckCircle2,
  RotateCcw,
  Maximize2,
  AlertTriangle,
  Upload,
  FileVideo,
  MonitorPlay,
  Radio,
  Tv,
  FolderPlus,
  PlayCircle,
  StopCircle,
  Trash2,
  X,
  FilePenLine,
  Lightbulb,
  Scissors,
  Captions,
  Image as ImageIcon,
  RefreshCw,
  ArrowRight,
  Volume2,
  VolumeX,
  Crop,
  RotateCw,
  Gauge,
  SlidersHorizontal,
  Split,
  Save,
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, TwitterIcon, LinkedinIcon } from '../components/SocialIcons';

const AI_AVATARS = [
  {
    id: 'aria-tech',
    name: 'Aria - Tech Lead',
    role: 'AI Neural Presenter',
    voice: 'Neural Studio Female',
    avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    color: '#6366f1',
  },
  {
    id: 'kael-cyber',
    name: 'Cyber Kael - Futurist',
    role: 'Synth Specialist',
    voice: 'Synth Cyber Male',
    avatarImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    color: '#06b6d4',
  },
  {
    id: 'nova-creative',
    name: 'Frame - Creative Host',
    role: 'Vlog Storyteller',
    voice: 'Warm British Female',
    avatarImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    color: '#ec4899',
  },
  {
    id: 'ethan-exec',
    name: 'Ethan - Executive Host',
    role: 'Corporate Presenter',
    voice: 'Deep US Male',
    avatarImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    color: '#10b981',
  },
];

const FILTER_STYLES = ['Cyberpunk', 'Cinematic Dark', 'Warm Vintage', 'Neon Matrix', 'HDR Boost'];

const AVD_PRESET_CLIPS = [
  {
    id: 'avd-preset-1',
    name: 'Android 15 App UI Showcase',
    description: 'Pixel 9 Pro Android Studio AVD recording (1080p, 60fps)',
    duration: 30,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&auto=format&fit=crop&q=80',
    tag: 'Android AVD',
  },
  {
    id: 'avd-preset-2',
    name: 'Cyberpunk Mobile App Demo',
    description: 'AVD Simulator screen capture with dark cyber UI',
    duration: 25,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
    tag: 'Mobile UI',
  },
  {
    id: 'avd-preset-3',
    name: 'Spatial AR Mobile Experience',
    description: '3D AR viewport interaction from PC emulator',
    duration: 40,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    tag: 'Spatial 3D',
  },
];

const VlogEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { consumeAiCredits, saveVlogProject, publishToPlatforms, showToast } = useBlog();
  const projectIdRef = useRef(`vlog_${Date.now()}`);

  // Project state
  const [projectTitle, setProjectTitle] = useState('Your Next Great Story');
  const [aspectRatio, setAspectRatio] = useState('16:9'); // '16:9' | '9:16' | '1:1'
  const [filterStyle, setFilterStyle] = useState('Cyberpunk');
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [editingSuggestions, setEditingSuggestions] = useState('');
  const [showAdvancedTimeline, setShowAdvancedTimeline] = useState(false);
  const [manualEdits, setManualEdits] = useState({ muted: false, speed: '1x', rotation: 0, crop: 'Fit', volume: 80 });

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(14); // seconds
  const [totalDuration, setTotalDuration] = useState(120);

  // AI Avatar state
  const [selectedAvatar, setSelectedAvatar] = useState(AI_AVATARS[0]);
  const [avatarScript, setAvatarScript] = useState(
    'Write your presenter script here, or upload a video and start editing it with the tools below.'
  );

  useEffect(() => {
    if (location.state?.repurposedScript) {
      setAvatarScript(location.state.repurposedScript);
      showToast('Loaded repurposed blog script into Vlog Studio!');
    }
    if (location.state?.projectTitle) {
      setProjectTitle(location.state.projectTitle);
    }
    if (location.state?.selectedAvatar) {
      setSelectedAvatar((current) => ({ ...current, ...location.state.selectedAvatar }));
    }
  }, [location.state]);

  // Import Video & Screen Capture state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importTab, setImportTab] = useState('pc_file'); // 'pc_file' | 'window_rec' | 'avd_preset'
  const [activeVideoSource, setActiveVideoSource] = useState(null); // { url, name, isCustom, duration }
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Video & Capture refs
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const videoPlayerRef = useRef(null);

  // Synchronize HTML5 video playback with player state
  useEffect(() => {
    if (videoPlayerRef.current && activeVideoSource?.url) {
      if (isPlaying) {
        videoPlayerRef.current.play().catch((e) => console.log('Video play interrupted', e));
      } else {
        videoPlayerRef.current.pause();
      }
    }
  }, [isPlaying, activeVideoSource]);

  useEffect(() => {
    if (videoPlayerRef.current && activeVideoSource?.url) {
      if (Math.abs(videoPlayerRef.current.currentTime - currentTime) > 1.5) {
        videoPlayerRef.current.currentTime = currentTime;
      }
    }
  }, [currentTime, activeVideoSource]);

  useEffect(() => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = Number.parseFloat(manualEdits.speed) || 1;
      videoPlayerRef.current.volume = manualEdits.muted ? 0 : manualEdits.volume / 100;
    }
  }, [manualEdits, activeVideoSource]);

  // Handle Local PC Video File Upload
  const handleSelectPCFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showToast('Please select a valid video file (.mp4, .webm, .mov)', 'error');
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = objectUrl;

    tempVideo.onloadedmetadata = () => {
      window.URL.revokeObjectURL(tempVideo.src);
      const durationSeconds = Math.round(tempVideo.duration) || 30;

      const newClip = {
        id: `v_pc_${Date.now()}`,
        name: file.name,
        start: currentTime,
        duration: durationSeconds,
        speed: 1,
        color: 'bg-emerald-600/60 border-emerald-400',
        videoUrl: objectUrl,
      };

      setTimelineTracks((prev) => ({
        ...prev,
        video: [...prev.video, newClip],
      }));

      setActiveVideoSource({
        url: objectUrl,
        name: file.name,
        isCustom: true,
        duration: durationSeconds,
      });

      if (currentTime + durationSeconds > totalDuration) {
        setTotalDuration(currentTime + durationSeconds);
      }

      setImportModalOpen(false);
      showToast(`🎬 Imported "${file.name}" (${durationSeconds}s) from PC file explorer!`);
    };
  };

  // Handle Live Window / AVD Screen Capture
  const handleStartWindowCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'window' },
        audio: true,
      });

      recordedChunksRef.current = [];
      const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? { mimeType: 'video/webm;codecs=vp9' }
        : { mimeType: 'video/webm' };

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        clearInterval(recordingTimerRef.current);
        setIsScreenRecording(false);

        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const blobUrl = URL.createObjectURL(blob);
        const durationSec = recordingDuration || 15;

        const clipName = `AVD Window Rec ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        const newClip = {
          id: `v_rec_${Date.now()}`,
          name: clipName,
          start: currentTime,
          duration: durationSec,
          speed: 1,
          color: 'bg-rose-600/60 border-rose-400',
          videoUrl: blobUrl,
        };

        setTimelineTracks((prev) => ({
          ...prev,
          video: [...prev.video, newClip],
        }));

        setActiveVideoSource({
          url: blobUrl,
          name: clipName,
          isCustom: true,
          duration: durationSec,
        });

        if (currentTime + durationSec > totalDuration) {
          setTotalDuration(currentTime + durationSec);
        }

        stream.getTracks().forEach((track) => track.stop());

        setImportModalOpen(false);
        showToast(`🎥 Captured & imported AVD Window video clip (${durationSec}s)!`);
      };

      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      };

      mediaRecorder.start(1000);
      setIsScreenRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      showToast('🔴 Recording active window... Click "Stop Recording" when done.');
    } catch (err) {
      console.error('Error starting screen capture:', err);
      showToast('Could not start window capture. Permission denied or unsupported.', 'error');
    }
  };

  const handleStopWindowCapture = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSelectAVDPreset = (preset) => {
    const newClip = {
      id: `v_preset_${Date.now()}`,
      name: preset.name,
      start: currentTime,
      duration: preset.duration,
      speed: 1,
      color: 'bg-cyan-600/60 border-cyan-400',
      videoUrl: preset.videoUrl,
    };

    setTimelineTracks((prev) => ({
      ...prev,
      video: [...prev.video, newClip],
    }));

    setActiveVideoSource({
      url: preset.videoUrl,
      name: preset.name,
      isCustom: true,
      duration: preset.duration,
    });

    if (currentTime + preset.duration > totalDuration) {
      setTotalDuration(currentTime + preset.duration);
    }

    setImportModalOpen(false);
    showToast(`📱 Added "${preset.name}" to video timeline!`);
  };

  // Timeline Tracks EDL state
  const [timelineTracks, setTimelineTracks] = useState({
    video: [
      { id: 'v1', name: '3D Cyber Intro Clip', start: 0, duration: 15, speed: 1, color: 'bg-indigo-600/60 border-indigo-400' },
      { id: 'v2', name: 'Aria Avatar Presenter', start: 15, duration: 45, speed: 1, color: 'bg-cyan-600/60 border-cyan-400' },
      { id: 'v3', name: 'Spatial B-Roll Mesh', start: 60, duration: 30, speed: 1, color: 'bg-purple-600/60 border-purple-400' },
    ],
    audio: [
      { id: 'a1', name: 'Cyberpunk Synthwave Track', start: 0, duration: 90, color: 'bg-emerald-600/60 border-emerald-400' },
    ],
    subtitle: [
      { id: 's1', name: 'Auto Kinetic Captions (EN)', start: 0, duration: 90, color: 'bg-amber-600/60 border-amber-400' },
    ],
    text: [],
  });

  // Export Render Modal state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportResolution, setExportResolution] = useState('1080p');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // 1-Click Multi-Platform Publish Modal
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['youtube', 'instagram', 'twitter', 'linkedin', 'tiktok']);
  const [isPublishing, setIsPublishing] = useState(false);

  const saveCurrentProject = async (overrides = {}) => {
    try {
      return await saveVlogProject({
        id: projectIdRef.current,
        title: projectTitle.trim() || 'Untitled Vlog Project',
        aspectRatio,
        filterStyle,
        durationSeconds: totalDuration,
        avatar: { ...selectedAvatar, script: avatarScript },
        activeVideoSource,
        manualEdits,
        edl: { tracks: timelineTracks },
        ...overrides,
      });
    } catch (error) {
      showToast(error.message || 'Could not save the video project.', 'error');
      return null;
    }
  };

  // Playhead scrubber simulation
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalDuration]);

  // Nova Auto-Caption apply handler
  const handleApplyNovaCaptions = (captionsClips) => {
    setTimelineTracks((prev) => ({
      ...prev,
      subtitle: captionsClips.map((c) => ({
        ...c,
        name: c.text,
      })),
    }));
  };

  // Nova B-Roll apply handler
  const handleApplyNovaBRoll = (brollItem) => {
    const newClip = {
      id: `broll_${Date.now()}`,
      name: brollItem.title,
      start: currentTime,
      duration: brollItem.duration || 15,
      transitionIn: brollItem.transition || 'crossfade',
      color: brollItem.color || 'bg-purple-600/60 border-purple-400',
    };

    setTimelineTracks((prev) => ({
      ...prev,
      video: [...prev.video, newClip],
    }));
    showToast(`🎬 Added "${brollItem.title}" to video timeline!`);
  };

  const handleGetEditingSuggestions = async () => {
    setSuggestionsLoading(true);
    const res = await api.chatCopilot({
      persona: 'nova',
      actionType: 'custom',
      prompt: `Give 4 concise, practical editing suggestions for this vlog. Title: ${projectTitle}. Script: ${avatarScript}. Include one suggestion each for pacing, visuals, captions and opening hook.`,
    });
    setSuggestionsLoading(false);
    if (res?.success && res.reply) setEditingSuggestions(res.reply);
    else showToast(res?.message || 'Could not load editing suggestions.', 'error');
  };

  // Auto-Save EDL callback
  const handleAutoSaveEDL = async (updatedTracks) => {
    await saveCurrentProject({ edl: { tracks: updatedTracks } });
  };

  // Export Render Execution with Polling
  const handleStartExportRender = async () => {
    setIsExporting(true);
    setExportProgress(10);

    const vlogId = 'vlog_export_' + Date.now();
    await api.renderVlog(vlogId, { resolution: exportResolution });

    // Poll status until 100%
    const interval = setInterval(async () => {
      const res = await api.getRenderStatus(vlogId);
      if (res && res.progress) {
        setExportProgress(res.progress);
        if (res.progress >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setExportModalOpen(false);

          await saveCurrentProject({ publishedPlatforms: selectedPlatforms });

          showToast('🎬 Render Export Complete! Video saved to Media Vault.');
        }
      }
    }, 1000);
  };

  // Multi-Platform Publish Execution
  const handleExecutePublish = async () => {
    if (selectedPlatforms.length === 0) {
      showToast('Please select at least one platform to publish!', 'error');
      return;
    }
    setIsPublishing(true);

    setTimeout(async () => {
      setIsPublishing(false);
      setPublishModalOpen(false);

      await saveCurrentProject({ publishedPlatforms: selectedPlatforms });

      await publishToPlatforms(projectTitle, selectedPlatforms, 'Vlog');
    }, 2500);
  };

  const formatTimecode = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Mobile Viewport Desktop Notice */}
        <div className="md:hidden max-w-7xl mx-auto px-4 pt-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Desktop recommended for frame-accurate multi-track video editing.</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-1">
                <Video className="w-4 h-4" />
                <span>VLOXAI VIDEO CREATION STUDIO</span>
              </div>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="text-xl sm:text-3xl font-extrabold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none font-outfit"
              />
              <p className="mt-2 text-xs text-slate-400">Upload your footage, edit it manually, or use AI for scripts, avatars, captions and creative direction—all in one place.</p>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Aspect Ratio Switcher */}
              <div className="p-1 rounded-xl glass-panel border border-slate-800 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                    aspectRatio === '16:9' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="16:9 Landscape (YouTube/Desktop)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">16:9</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                    aspectRatio === '9:16' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="9:16 Shorts/Reels (Instagram/TikTok)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">9:16</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio('1:1')}
                  className={`p-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                    aspectRatio === '1:1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="1:1 Square (LinkedIn/X Feed)"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">1:1</span>
                </button>
              </div>

              <div className="order-first flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => saveCurrentProject()}
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/15 px-4 py-2.5 text-sm font-bold text-indigo-100 transition hover:bg-indigo-500/25"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Project</span>
                </button>
                {/* Import Video Trigger */}
                <button
                  type="button"
                  onClick={() => setImportModalOpen(true)}
                  className="flex shrink-0 items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Video</span>
                </button>

                <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.025] p-1.5">
                {/* Export Video Trigger */}
                <button
                  type="button"
                  onClick={() => setExportModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm shadow-md hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Export</span>
                </button>

                {/* Share / 1-Click Multi-Platform Broadcast */}
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share & Broadcast</span>
                </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Studio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Left 7 Cols: Video Viewport & Controls */}
            <div className="lg:col-span-7 space-y-4">
              <div className="glass-panel-glow p-4 rounded-3xl border border-indigo-500/30 flex flex-col justify-between h-[430px] relative overflow-hidden">
                {/* Viewport Box */}
                <div
                  className={`relative w-full h-full mx-auto bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center transition-all ${
                    aspectRatio === '9:16'
                      ? 'max-w-[220px]'
                      : aspectRatio === '1:1'
                      ? 'max-w-[340px]'
                      : 'w-full'
                  }`}
                >
                  {/* Active imported video or fallback AI presenter canvas */}
                  {activeVideoSource?.url ? (
                    <video
                      ref={videoPlayerRef}
                      src={activeVideoSource.url}
                      className={`absolute inset-0 w-full h-full object-cover transition-all ${
                        filterStyle === 'Cyberpunk'
                          ? 'hue-rotate-60 contrast-125 saturate-150'
                          : filterStyle === 'Neon Matrix'
                          ? 'hue-rotate-180 contrast-200'
                          : filterStyle === 'Warm Vintage'
                          ? 'sepia contrast-100'
                          : filterStyle === 'Cinematic Dark'
                          ? 'brightness-90 contrast-125'
                          : ''
                      }`}
                      loop
                      muted={manualEdits.muted}
                      playsInline
                      style={{ transform: `rotate(${manualEdits.rotation}deg) scale(${manualEdits.crop === 'Fill' ? 1.12 : 1})`, objectFit: manualEdits.crop === 'Fill' ? 'cover' : 'contain' }}
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-cover bg-center transition-all ${
                        filterStyle === 'Cyberpunk'
                          ? 'hue-rotate-60 contrast-125 saturate-150'
                          : filterStyle === 'Neon Matrix'
                          ? 'hue-rotate-180 contrast-200'
                          : filterStyle === 'Warm Vintage'
                          ? 'sepia contrast-100'
                          : filterStyle === 'Cinematic Dark'
                          ? 'brightness-90 contrast-125'
                          : ''
                      }`}
                      style={{
                        backgroundImage: `url(${selectedAvatar.avatarImg})`,
                        transform: `rotate(${manualEdits.rotation}deg) scale(${manualEdits.crop === 'Fill' ? 1.12 : 1})`,
                      }}
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Active Custom Video Badge / Switcher */}
                  {activeVideoSource && (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-extrabold shadow-lg flex items-center gap-1.5 border border-emerald-400/50 backdrop-blur-md">
                        <FileVideo className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{activeVideoSource.name}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveVideoSource(null)}
                        className="w-6 h-6 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center justify-center cursor-pointer shadow-md"
                        title="Switch back to AI Avatar Presenter"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* AI Presenter LipSync Animated Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel border border-indigo-500/40 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-cyan-400 overflow-hidden shrink-0 shadow-md">
                        <img src={selectedAvatar.avatarImg} alt={selectedAvatar.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block">
                          AI LIPSYNC ACTIVE • {selectedAvatar.voice}
                        </span>
                        <p className="text-xs text-white font-medium line-clamp-2">
                          "{avatarScript}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Kinetic Text Overlay (Rendered from Text Layer) */}
                  {timelineTracks.text && timelineTracks.text.length > 0 && (
                    <div className="absolute top-10 left-0 right-0 text-center pointer-events-none px-4">
                      <span className="px-4 py-1.5 rounded-xl bg-slate-950/80 border border-rose-500/40 text-rose-300 text-xs font-black tracking-wider uppercase font-outfit shadow-2xl animate-pulse">
                        {timelineTracks.text[0]?.textOverlay?.content || 'VLOX AI SPATIAL ENGINE'}
                      </span>
                    </div>
                  )}

                  {/* Filter Tag Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                    Filter: {filterStyle}
                  </div>

                  {/* Live Recording Indicator */}
                  {isPlaying && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/80 text-white text-[10px] font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white" />
                      <span>REC LIVE</span>
                    </div>
                  )}
                </div>

                {/* Viewport Playback Controller Bar */}
                <div className="mt-3 flex items-center justify-between gap-4 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <div className="font-mono text-xs text-slate-300">
                      <span>{formatTimecode(currentTime)}</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-slate-400">{formatTimecode(totalDuration)}</span>
                    </div>
                  </div>

                  {/* Filter Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 hidden sm:inline">Filter:</span>
                    <select
                      value={filterStyle}
                      onChange={(e) => setFilterStyle(e.target.value)}
                      className="px-3 py-1.5 rounded-xl glass-input text-xs text-white bg-slate-900 focus:outline-none"
                    >
                      {FILTER_STYLES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-emerald-300" /><h2 className="text-sm font-bold text-white">Manual video editing</h2></div><p className="mt-1 text-xs text-slate-400">Quick edits for your current video. Advanced clip editing stays in the timeline when needed.</p></div><span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold text-emerald-200">{activeVideoSource ? activeVideoSource.name : 'Avatar preview'}</span></div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <button type="button" onClick={() => { setCurrentTime(Math.max(0, currentTime - 5)); showToast('Trim start moved 5 seconds earlier.'); }} className="manual-video-tool"><Scissors className="w-4 h-4 text-emerald-300" /><span>Trim start</span></button>
                  <button type="button" onClick={() => { setTimelineTracks((prev) => ({ ...prev, video: [...prev.video, { id: `split_${Date.now()}`, name: 'Split clip marker', start: currentTime, duration: 1, color: 'bg-amber-600/60 border-amber-400' }] })); showToast('Split marker added at the playhead.'); }} className="manual-video-tool"><Split className="w-4 h-4 text-amber-300" /><span>Split clip</span></button>
                  <button type="button" onClick={() => setManualEdits((prev) => ({ ...prev, speed: prev.speed === '1x' ? '1.25x' : prev.speed === '1.25x' ? '0.75x' : '1x' }))} className="manual-video-tool"><Gauge className="w-4 h-4 text-cyan-300" /><span>Speed: {manualEdits.speed}</span></button>
                  <button type="button" onClick={() => setManualEdits((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))} className="manual-video-tool"><RotateCw className="w-4 h-4 text-violet-300" /><span>Rotate</span></button>
                  <button type="button" onClick={() => setManualEdits((prev) => ({ ...prev, crop: prev.crop === 'Fit' ? 'Fill' : 'Fit' }))} className="manual-video-tool"><Crop className="w-4 h-4 text-pink-300" /><span>Crop: {manualEdits.crop}</span></button>
                  <button type="button" onClick={() => setManualEdits((prev) => ({ ...prev, muted: !prev.muted }))} className="manual-video-tool">{manualEdits.muted ? <VolumeX className="w-4 h-4 text-rose-300" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}<span>{manualEdits.muted ? 'Unmute audio' : 'Mute audio'}</span></button>
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/8 bg-slate-950/50 px-3 py-2"><Volume2 className="w-4 h-4 text-slate-400" /><input type="range" min="0" max="100" value={manualEdits.volume} onChange={(e) => setManualEdits((prev) => ({ ...prev, volume: Number(e.target.value) }))} className="accent-emerald-400 w-full" /><span className="w-8 text-right text-xs font-mono text-slate-400">{manualEdits.volume}</span></div>
              </section>
            </div>

            {/* Right 5 Cols: Nova Vlog Director & Avatar Presenter Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-panel p-5 rounded-3xl border border-amber-400/20">
                <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><div className="p-2 rounded-xl bg-amber-400/10 text-amber-300"><Lightbulb className="w-4 h-4" /></div><div><h3 className="text-sm font-bold text-white">AI editing suggestions</h3><p className="text-[11px] text-slate-400">Find the next best improvement for your video</p></div></div><button type="button" disabled={suggestionsLoading} onClick={handleGetEditingSuggestions} className="shrink-0 rounded-xl border border-amber-300/25 bg-amber-400/10 px-3 py-2 text-[11px] font-bold text-amber-100 transition hover:bg-amber-400/20 disabled:opacity-50">{suggestionsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Suggest edits'}</button></div>
                {!editingSuggestions ? <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] text-slate-400"><span className="rounded-lg bg-white/[0.035] px-2 py-2"><Scissors className="mb-1 w-3.5 h-3.5 text-amber-300" />Pacing</span><span className="rounded-lg bg-white/[0.035] px-2 py-2"><ImageIcon className="mb-1 w-3.5 h-3.5 text-amber-300" />Visuals</span><span className="rounded-lg bg-white/[0.035] px-2 py-2"><Captions className="mb-1 w-3.5 h-3.5 text-amber-300" />Captions</span></div> : <p className="mt-4 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/8 bg-slate-950/60 p-3 text-xs leading-5 text-slate-300">{editingSuggestions}</p>}
              </div>

              {/* Nova AI Director Component */}
              <NovaVlogDirector
                projectTitle={projectTitle}
                selectedAvatar={selectedAvatar}
                avatarScript={avatarScript}
                setAvatarScript={setAvatarScript}
                onApplyCaptions={handleApplyNovaCaptions}
                onApplyBRoll={handleApplyNovaBRoll}
              />

              {/* Audience Simulator Persona Testing Panel */}
              <AudienceSimulator title={projectTitle} script={avatarScript} />

              {/* Avatar Selector Panel */}
              <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white font-outfit">Select Neural Presenter</span>
                  <span className="text-[10px] text-cyan-400 font-mono">4 Studio Voice Avatars</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {AI_AVATARS.map((av) => {
                    const isSelected = selectedAvatar.id === av.id;
                    return (
                      <div
                        key={av.id}
                        onClick={() => setSelectedAvatar(av)}
                        className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <img src={av.avatarImg} alt={av.name} className="w-8 h-8 rounded-xl object-cover" />
                        <div className="overflow-hidden">
                          <h5 className="text-[11px] font-bold truncate">{av.name}</h5>
                          <p className="text-[9px] opacity-75 truncate">{av.voice}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Advanced timeline stays out of the way until it is needed. */}
          <section className="mt-2 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><div className="flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-300" /><h2 className="text-sm font-bold text-white">Advanced timeline</h2></div><p className="mt-1 text-xs text-slate-400">Use this only when you want precise clip timing, multiple tracks or detailed scene changes.</p></div>
              <button type="button" onClick={() => setShowAdvancedTimeline((value) => !value)} className="rounded-xl border border-indigo-300/25 bg-indigo-400/10 px-4 py-2.5 text-xs font-bold text-indigo-100 transition hover:bg-indigo-400/20">{showAdvancedTimeline ? 'Hide timeline' : 'Open advanced timeline'}</button>
            </div>
            {showAdvancedTimeline && <div className="mt-5 border-t border-white/10 pt-5"><TimelineEditor tracks={timelineTracks} setTracks={setTimelineTracks} currentTime={currentTime} setCurrentTime={setCurrentTime} totalDuration={totalDuration} setTotalDuration={setTotalDuration} isPlaying={isPlaying} setIsPlaying={setIsPlaying} onAutoSave={handleAutoSaveEDL} onOpenImportModal={() => setImportModalOpen(true)} showToast={showToast} /></div>}
          </section>
        </div>
      </div>

      {/* Hidden File Input for PC Video Files */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleSelectPCFile}
      />

      {/* Video Import Modal (PC File Explorer / AVD Window Record / Presets) */}
      <AnimatePresence>
        {importModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl glass-panel-glow border border-emerald-500/40 p-8 text-slate-200 space-y-6"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 font-mono">
                    PC FILE & AVD WINDOW IMPORT ENGINE
                  </span>
                  <h3 className="text-2xl font-extrabold text-white font-outfit mt-1">
                    Import Video Media
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isScreenRecording) handleStopWindowCapture();
                    setImportModalOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Import Tabs */}
              <div className="flex items-center gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setImportTab('pc_file')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    importTab === 'pc_file'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Browse PC Files</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImportTab('window_rec')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    importTab === 'window_rec'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MonitorPlay className="w-4 h-4" />
                  <span>Window / AVD Rec</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImportTab('avd_preset')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    importTab === 'avd_preset'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tv className="w-4 h-4" />
                  <span>AVD Presets</span>
                </button>
              </div>

              {/* Tab 1: Local PC File Explorer Upload */}
              {importTab === 'pc_file' && (
                <div className="space-y-4 py-4 text-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-8 rounded-3xl border-2 border-dashed border-slate-700 hover:border-emerald-500/80 bg-slate-900/40 hover:bg-slate-900/80 transition-all cursor-pointer group flex flex-col items-center justify-center space-y-3"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-outfit">
                        Click or Drag Video Files Here
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports <span className="text-emerald-300 font-mono">.MP4, .WEBM, .MOV, .MKV, .AVI</span> videos from PC explorer or AVD exports
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:scale-105 transition-transform cursor-pointer"
                    >
                      Browse Video File 📁
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Live Window / AVD Screen Capture */}
              {importTab === 'window_rec' && (
                <div className="space-y-6 py-4 text-center">
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                      <Radio className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-outfit">
                        Live PC Window & AVD Capture
                      </h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                        Select any open PC window (e.g., <span className="text-cyan-300 font-semibold">Android Studio AVD Emulator</span>, browser, or desktop software) to record live directly into the editor timeline.
                      </p>
                    </div>

                    {isScreenRecording ? (
                      <div className="py-4 space-y-3 bg-rose-950/40 border border-rose-500/40 rounded-2xl">
                        <div className="flex items-center justify-center gap-2 text-rose-400 font-mono text-sm font-bold animate-pulse">
                          <span className="w-3 h-3 rounded-full bg-rose-500" />
                          <span>RECORDING ACTIVE WINDOW • {formatTimecode(recordingDuration)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleStopWindowCapture}
                          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl shadow-rose-600/30 hover:scale-105 transition-transform cursor-pointer flex items-center gap-2 mx-auto"
                        >
                          <StopCircle className="w-4 h-4" />
                          <span>Stop Recording & Import Clip</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStartWindowCapture}
                        className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-cyan-500/25 hover:scale-105 transition-transform cursor-pointer flex items-center gap-2 mx-auto"
                      >
                        <MonitorPlay className="w-4 h-4" />
                        <span>Select Window & Start Recording 🎥</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Preset AVD Emulator Clips */}
              {importTab === 'avd_preset' && (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {AVD_PRESET_CLIPS.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-800 relative">
                          <img src={preset.thumbnail} alt={preset.name} className="w-full h-full object-cover opacity-80" />
                          <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold text-emerald-300 bg-slate-950/80 px-1 rounded">
                            {preset.duration}s
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[9px] font-bold border border-indigo-500/30">
                              {preset.tag}
                            </span>
                            <h5 className="text-xs font-bold text-white">{preset.name}</h5>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{preset.description}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectAVDPreset(preset)}
                        className="px-4 py-2 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                      >
                        + Add Clip
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (isScreenRecording) handleStopWindowCapture();
                    setImportModalOpen(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Export Render Modal */}
      <AnimatePresence>
        {exportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl glass-panel-glow border border-indigo-500/40 p-8 text-slate-200 space-y-6"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-white font-outfit">Export Rendered Vlog</h3>
                  <p className="text-xs text-slate-400 font-mono">Server EDL Render Engine</p>
                </div>
                <button onClick={() => setExportModalOpen(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              {isExporting ? (
                <div className="py-8 text-center space-y-4">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                    <span className="text-xs font-mono font-bold text-white">{exportProgress}%</span>
                  </div>
                  <p className="text-sm font-bold text-white">Rendering MP4 timeline video...</p>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">Resolution</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['720p', '1080p', '4K Ultra'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setExportResolution(r)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                            exportResolution === r
                              ? 'bg-indigo-600 border-indigo-400 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setExportModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleStartExportRender}
                      className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-500/25 hover:scale-105 transition-transform"
                    >
                      Start Render Export 🎬
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 1-Click Multi-Platform Publisher Modal */}
      <AnimatePresence>
        {publishModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl rounded-3xl glass-panel-glow border border-cyan-500/40 p-8 text-slate-200"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                    SIMULTANEOUS BROADCAST
                  </span>
                  <h3 className="text-2xl font-extrabold text-white font-outfit mt-1">
                    1-Click Multi-Platform Publish
                  </h3>
                </div>
                <button onClick={() => setPublishModalOpen(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              {/* Target Platforms Checkboxes */}
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold text-slate-300 block">Select Broadcast Networks:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'youtube', name: 'YouTube Shorts', icon: YoutubeIcon, color: 'text-red-500' },
                    { id: 'instagram', name: 'Instagram Reels', icon: InstagramIcon, color: 'text-pink-500' },
                    { id: 'twitter', name: 'X / Twitter', icon: TwitterIcon, color: 'text-cyan-400' },
                    { id: 'linkedin', name: 'LinkedIn Video', icon: LinkedinIcon, color: 'text-blue-400' },
                    { id: 'tiktok', name: 'TikTok Viral', icon: Sparkles, color: 'text-purple-400' },
                  ].map((p) => {
                    const isChecked = selectedPlatforms.includes(p.id);
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedPlatforms(selectedPlatforms.filter((x) => x !== p.id));
                          } else {
                            setSelectedPlatforms([...selectedPlatforms, p.id]);
                          }
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isChecked
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                            : 'bg-slate-900 border-slate-800 text-slate-400 opacity-60'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${p.color}`} />
                        <span className="text-xs font-bold">{p.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Publishing Progress Status */}
              {isPublishing ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-bold text-white">Transcoding & Broadcasting across selected networks...</p>
                  <p className="text-xs text-slate-400">Formatting tags, rendering thumbnail, and broadcasting APIs.</p>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPublishModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecutePublish}
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 text-white font-extrabold text-xs shadow-xl shadow-cyan-500/25 hover:scale-105 transition-transform"
                  >
                    Broadcast Now 🚀
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default VlogEditor;
