import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Terminal, Info } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

interface TopHeaderProps {
  onOpenInfo: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenInfo }) => {
  const [timeStr, setTimeStr] = useState('');
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setTimeStr(`UTC ${hours}:${mins}:${secs}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    cyberAudio.setMuted(newMuted);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between pointer-events-none">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="w-8 h-8 rounded-lg bg-black/60 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
          <Terminal className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-orbitron font-extrabold text-sm sm:text-base tracking-widest text-white drop-shadow">
              AETHERIS
            </h1>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold tracking-widest">
              // 3D ARCHIVE
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-400 tracking-wider hidden sm:block">
            NEURAL PROJECTION ENGINE · VER 4.8
          </p>
        </div>
      </div>

      {/* Right Controls HUD */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Live System Timestamp */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{timeStr}</span>
        </div>

        {/* Ambient Sound Toggle */}
        <button
          onClick={handleToggleSound}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 backdrop-blur-md border cursor-pointer ${
            !isMuted
              ? 'bg-cyan-950/40 border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
              : 'bg-black/50 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
          }`}
          title={isMuted ? 'Enable Ambient Cyber Synthesizer' : 'Mute Ambient Audio'}
        >
          {!isMuted ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">SYNTH ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AUDIO MUTED</span>
            </>
          )}
        </button>

        {/* System Info / Shortcuts Trigger */}
        <button
          onClick={onOpenInfo}
          className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-cyan-400 text-slate-400 hover:text-white transition-all cursor-pointer"
          aria-label="System info and shortcuts"
          title="System Guide"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
