import React, { useEffect, useRef, useState, memo } from 'react';

interface BackgroundVideoProps {
  videoSrc?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = memo(({
  videoSrc = '/assets/aistudio/background_video_1280_720_c5a61ffd.mp4'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasAutoplayFailed, setHasAutoplayFailed] = useState<boolean>(false);

  // Play video on mount and whenever videoSrc changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasAutoplayFailed(false);
          })
          .catch((err) => {
            console.warn('Background video autoplay restricted:', err);
            setHasAutoplayFailed(true);
          });
      }
    };

    attemptPlay();

    video.addEventListener('canplay', attemptPlay);
    video.addEventListener('loadeddata', attemptPlay);

    return () => {
      video.removeEventListener('canplay', attemptPlay);
      video.removeEventListener('loadeddata', attemptPlay);
    };
  }, [videoSrc]);

  // Floating Cyber Particles on Canvas (subtle accent layer)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = [
      'rgba(0, 229, 255, ',   // Neon Cyan
      'rgba(255, 60, 172, ',  // Hot Magenta
      'rgba(139, 92, 255, '   // Cyber Violet
    ];

    const particleCount = Math.min(Math.floor((width * height) / 32000), 40);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.8,
        speedY: (Math.random() - 0.5) * 0.35 - 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const currentAlpha = p.alpha * (0.7 + 0.3 * Math.sin(time + i));

        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasAutoplayFailed(false);
      }).catch(err => {
        console.error('Failed manual play:', err);
      });
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* HTML5 Native Looping Video */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPlaying={() => setIsPlaying(true)}
        className="absolute inset-0 w-full h-full object-cover object-center opacity-35 transition-opacity duration-700"
      >
        <source src={videoSrc} type="video/mp4" />
        <source src="/background_video_1280_720.mp4" type="video/mp4" />
      </video>

      {/* Atmospheric Canvas Particle Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-60 mix-blend-screen"
      />

      {/* Subtle CRT Scanline Layer */}
      <div className="absolute inset-0 cyber-scanlines opacity-20 pointer-events-none" />

      {/* Soft Vignette Overlay to frame the screen without hiding the center neon waves */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/75 pointer-events-none" />

      {/* Graceful Autoplay Recovery Button (only if browser blocked autoplay) */}
      {hasAutoplayFailed && !isPlaying && (
        <div className="absolute bottom-6 right-6 z-50 pointer-events-auto">
          <button
            onClick={handleManualPlay}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider bg-black/70 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            RESUME BACKGROUND VIDEO
          </button>
        </div>
      )}
    </div>
  );
});

BackgroundVideo.displayName = 'BackgroundVideo';
