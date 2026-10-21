import React from 'react';
import { X, Layers, Monitor, Sliders, Smartphone, Sparkles, Volume2 } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-[#08090B] border border-cyan-500/40 p-6 shadow-[0_0_40px_rgba(0,229,255,0.25)] space-y-5"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="font-orbitron text-sm font-bold tracking-widest text-white">
              AETHERIS // 3D SLIDER SPECIFICATION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Features Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-rajdhani">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-mono font-semibold text-cyan-400 text-[11px]">
              <Layers className="w-3.5 h-3.5" />
              <span>3D PERSPECTIVE CAROUSEL</span>
            </div>
            <p className="text-slate-300">
              Preserved 3D depth with dynamic yaw rotation, scale attenuation, and neon bloom illumination.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-mono font-semibold text-emerald-400 text-[11px]">
              <Monitor className="w-3.5 h-3.5" />
              <span>CINEMATIC EXPANSION</span>
            </div>
            <p className="text-slate-300">
              Click any card to smoothly zoom into high-res full bleed video playback with telemetry HUD.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-mono font-semibold text-purple-400 text-[11px]">
              <Volume2 className="w-3.5 h-3.5" />
              <span>PROCEDURAL AUDIO</span>
            </div>
            <p className="text-slate-300">
              Web Audio API synthesized UI haptics and ambient drone frequencies tailored per asset.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-mono font-semibold text-amber-400 text-[11px]">
              <Smartphone className="w-3.5 h-3.5" />
              <span>TOUCH & SWIPE</span>
            </div>
            <p className="text-slate-300">
              Intuitive mobile gestures, keyboard shortcuts (←/→, Space, Esc), and pill navigation buttons.
            </p>
          </div>
        </div>

        {/* Controls Guide */}
        <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-slate-400 space-y-1.5">
          <div className="text-slate-300 font-semibold mb-1">// SHORTCUTS:</div>
          <div className="flex justify-between">
            <span>PREVIOUS / NEXT CARD</span>
            <span className="text-cyan-400">ArrowLeft / ArrowRight</span>
          </div>
          <div className="flex justify-between">
            <span>EXPAND / PLAY VIDEO</span>
            <span className="text-cyan-400">Click Card or Spacebar</span>
          </div>
          <div className="flex justify-between">
            <span>CLOSE EXPANDED VIEW</span>
            <span className="text-cyan-400">Escape Key</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-white/10">
          <span>AI STUDIO DEPLOYMENT</span>
          <span className="text-cyan-400 font-medium">ONLINE · READY</span>
        </div>
      </div>
    </div>
  );
};
