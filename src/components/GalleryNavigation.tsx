import React from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

interface GalleryNavigationProps {
  currentIndex: number;
  totalItems: number;
  onPrev: () => void;
  onNext: () => void;
  isAutoplay: boolean;
  onToggleAutoplay: () => void;
  accentColor?: string;
}

export const GalleryNavigation: React.FC<GalleryNavigationProps> = ({
  currentIndex,
  totalItems,
  onPrev,
  onNext,
  isAutoplay,
  onToggleAutoplay,
  accentColor = '#00E5FF',
}) => {
  const handlePrev = () => {
    cyberAudio.playCardSlide();
    onPrev();
  };

  const handleNext = () => {
    cyberAudio.playCardSlide();
    onNext();
  };

  return (
    <div className="flex flex-col items-center gap-4 z-30 select-none">
      {/* Main Pill Controls matching recommended_layout.jpg */}
      <div className="flex items-center gap-3">
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          className="group relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 hover:border-white/50 text-slate-200 hover:text-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,229,255,0.25)] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="font-chakra text-xs font-semibold tracking-widest uppercase">
            Prev
          </span>
        </button>

        {/* Center Indicator with Index Dots */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalItems }).map((_, idx) => (
              <span
                key={idx}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: idx === currentIndex ? '16px' : '6px',
                  height: '6px',
                  backgroundColor:
                    idx === currentIndex ? accentColor : 'rgba(255, 255, 255, 0.2)',
                  boxShadow:
                    idx === currentIndex
                      ? `0 0 10px ${accentColor}`
                      : 'none',
                }}
              />
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-400 font-medium">
            0{currentIndex + 1} <span className="text-slate-600">/</span> 0{totalItems}
          </span>

          {/* Autoplay Toggle */}
          <button
            onClick={onToggleAutoplay}
            className={`p-1 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-white ${
              isAutoplay ? 'text-cyan-400' : ''
            }`}
            title={isAutoplay ? 'Pause auto-rotation' : 'Start auto-rotation'}
            aria-label={isAutoplay ? 'Pause auto-rotation' : 'Start auto-rotation'}
          >
            {isAutoplay ? (
              <Pause className="w-3 h-3 text-cyan-400" />
            ) : (
              <Play className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="group relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 hover:border-white/50 text-slate-200 hover:text-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,229,255,0.25)] active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Next card"
        >
          <span className="font-chakra text-xs font-semibold tracking-widest uppercase">
            Next
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        </button>
      </div>

      {/* Subtle Keyboard / Gesture Guide */}
      <div className="hidden sm:flex items-center gap-4 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
        <span>[← / →] Navigate</span>
        <span aria-hidden="true">·</span>
        <span>[SPACE] Expand</span>
        <span aria-hidden="true">·</span>
        <span>[SWIPE] Mobile</span>
      </div>
    </div>
  );
};
