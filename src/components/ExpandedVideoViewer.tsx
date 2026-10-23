import React, { useEffect, useRef, useState } from 'react';
import { GalleryItem } from '../types/gallery';
import { cyberAudio } from '../utils/cyberAudio';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  Radio,
  Cpu
} from 'lucide-react';

interface ExpandedVideoViewerProps {
  item: GalleryItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalItems: number;
}

export const ExpandedVideoViewer: React.FC<ExpandedVideoViewerProps> = ({
  item,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  totalItems,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  // Keyboard navigation & Escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cyberAudio.playClose();
        onClose();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Video source loading & auto-play
  useEffect(() => {
    setVideoError(false);
    setIsBuffering(true);
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch((err) => {
          console.warn('Playback error or policy blocked autoplay:', err);
          // Auto-fallback to muted if audio policy blocked it
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
          }).catch(() => {
            setIsPlaying(false);
            setIsBuffering(false);
          });
        });
    }
  }, [item.video]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Fullscreen change listener to sync isFullscreen state
  useEffect(() => {
    const onFullscreenChange = () => {
      const isFull = !!(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
    );

    if (!isCurrentlyFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen().catch((err) => {
          console.warn('Video fullscreen request failed:', err);
        });
      } else if ((video as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        (video as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      } else if ((video as unknown as { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
        (video as unknown as { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
      } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
        (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const current = video.currentTime;
    const total = video.duration || 1;
    setProgress((current / total) * 100);
    setCurrentTime(formatTime(current));
    setDuration(formatTime(total));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * (video.duration || 1);
  };

  const handleRetry = () => {
    setVideoError(false);
    setIsBuffering(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-2xl transition-all duration-500 animate-fadeIn"
      onClick={onClose}
    >
      {/* Outer Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-[88dvh] max-h-[820px] rounded-3xl overflow-hidden bg-[#08090B] border border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col md:flex-row"
        style={{
          boxShadow: `0 0 50px ${item.accentColor}33, 0 25px 60px rgba(0,0,0,0.8)`,
          borderColor: `${item.accentColor}66`,
        }}
      >
        {/* Holographic Top Banner Bar */}
        <div className="absolute top-0 inset-x-0 h-1 z-30 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

        {/* Close Button Top Right */}
        <button
          onClick={() => {
            cyberAudio.playClose();
            onClose();
          }}
          className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white border border-white/20 hover:border-cyan-400 transition-all duration-300 backdrop-blur-md cursor-pointer shadow-lg active:scale-95"
          aria-label="Close enlarged video"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Playback Viewport (Left / Top) */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
          {/* Native HTML5 Video Element */}
          {!videoError ? (
            <video
              ref={videoRef}
              src={item.video}
              poster={item.image}
              loop
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              onError={() => {
                console.warn('Video failed to load:', item.video);
                setVideoError(true);
                setIsBuffering(false);
              }}
              className={`w-full h-full cursor-pointer transition-all duration-300 ${
                isFullscreen ? 'object-contain bg-black' : 'object-cover object-center'
              }`}
              onClick={togglePlay}
            />
          ) : (
            /* Elegant Image Fallback if Video Error */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="relative z-10 p-6 rounded-2xl bg-black/80 border border-white/20 backdrop-blur-md max-w-sm">
                <p className="text-sm font-mono text-cyan-300 mb-3">
                  // OPTICAL FEED ACTIVE // VIDEO STREAM RECOVERING
                </p>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-xs font-mono tracking-wider transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  RETRY VIDEO STREAM
                </button>
              </div>
            </div>
          )}

          {/* Buffering Indicator */}
          {isBuffering && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* In-Video Minimal Controls Overlay */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20 space-y-2">
            {/* Interactive Progress Bar */}
            <div
              onClick={handleSeek}
              className="group/seek relative w-full h-2 rounded-full bg-white/20 hover:h-2.5 transition-all cursor-pointer overflow-hidden"
            >
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${progress}%`,
                  backgroundColor: item.accentColor,
                  boxShadow: `0 0 10px ${item.accentColor}`,
                }}
              />
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-3">
                {/* Play / Pause Button */}
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </button>

                {/* Sound Mute / Unmute Button */}
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                  )}
                </button>

                {/* Time Display */}
                <span className="tracking-widest text-[11px] text-slate-400">
                  {currentTime} <span className="text-slate-600">/</span> {duration}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Resolution Badge */}
                <span className="hidden sm:inline-block text-[10px] text-cyan-400 font-mono tracking-widest">
                  HD STREAM // {item.specs.resolution}
                </span>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative & Diagnostic HUD Panel (Right / Bottom) */}
        <div className="w-full md:w-[360px] lg:w-[400px] flex flex-col justify-between p-6 overflow-y-auto bg-[#08090B]/95 border-t md:border-t-0 md:border-l border-white/10">
          <div className="space-y-4">
            {/* Top Index and Category */}
            <div className="flex items-center justify-between">
              <span
                className="font-orbitron font-extrabold text-3xl tracking-wider"
                style={{
                  color: item.accentColor,
                  textShadow: `0 0 15px ${item.accentColor}88`,
                }}
              >
                {item.indexStr}
              </span>

              <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-slate-400">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.accentColor }}
                />
                <span className="uppercase">FEED ONLINE</span>
              </div>
            </div>

            {/* Unboxed Category Kicker */}
            <div className="flex items-center gap-1.5 text-xs font-mono tracking-widest text-slate-300">
              <span style={{ color: item.accentColor }}>//</span>
              <span className="uppercase">{item.category}</span>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h2 className="font-chakra font-bold text-2xl text-white tracking-wide leading-tight">
                {item.title}
              </h2>
              <p className="text-sm font-rajdhani text-slate-400 font-medium mt-1">
                {item.subtitle}
              </p>
            </div>

            {/* Narrative Description */}
            <p className="text-xs text-slate-300 leading-relaxed font-rajdhani border-l-2 border-white/20 pl-3">
              {item.description}
            </p>

            {/* Technical Diagnostic Specifications (Clean Unboxed Layout) */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-[11px] font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  SOFTWARE
                </span>
                <span className="text-slate-200">{item.specs.clearance}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  OUTPUT
                </span>
                <span className="text-slate-200">{item.specs.coordinates}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  DURATION
                </span>
                <span className="text-slate-200">{item.specs.bandwidth}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  AI MODEL
                </span>
                <span className="text-slate-200">{item.specs.audioFreq}</span>
              </div>
            </div>
          </div>

          {/* Bottom Fast Navigation Controls */}
          <div className="pt-6 border-t border-white/10 mt-4 flex items-center justify-between">
            <button
              onClick={() => {
                cyberAudio.playCardSlide();
                onPrev();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white text-xs font-mono tracking-wider transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              PREV
            </button>

            <span className="text-xs font-mono text-slate-400">
              0{currentIndex + 1} <span className="text-slate-600">/</span> 0{totalItems}
            </span>

            <button
              onClick={() => {
                cyberAudio.playCardSlide();
                onNext();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white text-xs font-mono tracking-wider transition-colors cursor-pointer"
            >
              NEXT
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
