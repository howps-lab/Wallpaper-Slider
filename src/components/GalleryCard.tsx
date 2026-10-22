import React, { useState } from 'react';
import { GalleryItem } from '../types/gallery';
import { cyberAudio } from '../utils/cyberAudio';
import { Play, Eye } from 'lucide-react';

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
  activeIndex: number;
  totalItems: number;
  onSelect: (index: number) => void;
  onExpand: (item: GalleryItem) => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  item,
  index,
  activeIndex,
  totalItems,
  onSelect,
  onExpand,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate circular offset distance (-total/2 to +total/2)
  let offset = index - activeIndex;
  const half = Math.floor(totalItems / 2);
  if (offset > half) offset -= totalItems;
  if (offset < -half) offset += totalItems;

  const isActive = offset === 0;
  const absOffset = Math.abs(offset);

  // Hidden if too far in carousel
  if (absOffset > 2) {
    return null;
  }

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const step1 = isMobile ? 185 : isTablet ? 245 : 295;
  const step2 = isMobile ? 320 : isTablet ? 445 : 525;

  // Calculate 3D transformation values
  const getTransform = () => {
    if (offset === 0) {
      return {
        x: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        zIndex: 40,
      };
    }

    const direction = offset < 0 ? -1 : 1;

    if (absOffset === 1) {
      return {
        x: direction * step1,
        z: isMobile ? -60 : -90,
        rotateY: direction * (isMobile ? -18 : -24),
        scale: isMobile ? 0.86 : 0.84,
        opacity: isMobile ? 0.65 : 0.78,
        zIndex: 25,
      };
    }

    // absOffset === 2
    return {
      x: direction * step2,
      z: isMobile ? -120 : -180,
      rotateY: direction * (isMobile ? -28 : -36),
      scale: isMobile ? 0.70 : 0.68,
      opacity: isMobile ? 0.25 : 0.42,
      zIndex: 15,
    };
  };

  const t = getTransform();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) {
      cyberAudio.playExpand();
      onExpand(item);
    } else {
      cyberAudio.playCardSlide();
      onSelect(index);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    cyberAudio.playCardHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute top-1/2 left-1/2 cursor-pointer transition-all duration-500 ease-out preserve-3d will-change-transform ${
        isActive ? 'pointer-events-auto' : 'pointer-events-auto hover:opacity-95'
      }`}
      style={{
        transform: `translate(-50%, -50%) translate3d(${t.x}px, 0px, ${t.z}px) rotateY(${t.rotateY}deg) scale(${t.scale})`,
        opacity: t.opacity,
        zIndex: t.zIndex,
        width: 'clamp(325px, 26.5vw, 385px)',
        height: 'clamp(455px, 58vh, 528px)',
      }}
      role="button"
      tabIndex={0}
      aria-label={`${item.title} - ${item.category}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      {/* Outer Card Glass Frame */}
      <div
        className={`relative w-full h-full rounded-2xl overflow-hidden transition-all duration-500 bg-[#08090B]/85 backdrop-blur-xl flex flex-col justify-between ${
          isActive
            ? 'shadow-[0_0_35px_rgba(0,229,255,0.4)]'
            : 'shadow-[0_15px_30px_rgba(0,0,0,0.6)]'
        }`}
        style={{
          border: isActive
            ? `1.5px solid ${item.accentColor}`
            : '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: isActive
            ? `0 0 30px ${item.accentColor}44, inset 0 0 15px ${item.accentColor}22`
            : undefined,
        }}
      >
        {/* Thumbnail Background Image - Clean & True to Original */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
              isHovered || isActive ? 'scale-105' : 'scale-100'
            }`}
          />
        </div>

        {/* Top Header Section inside Card */}
        <div className="relative z-10 p-6 flex items-start justify-between">
          <div>
            {/* Index Number */}
            <span
              className="font-orbitron font-extrabold text-3xl tracking-wider block drop-shadow-md"
              style={{
                color: isActive ? item.accentColor : '#E8F1F5',
                textShadow: isActive ? `0 0 12px ${item.accentColor}` : undefined,
              }}
            >
              {item.indexStr}
            </span>

            {/* Unboxed Category Metadata (Zero-Pill Rule) */}
            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-mono tracking-widest text-slate-300">
              <span style={{ color: item.accentColor }}>//</span>
              <span className="uppercase">{item.category}</span>
            </div>
          </div>

          {/* Holographic Status Indicator */}
          <div className="flex items-center gap-1.5 pt-1">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{
                backgroundColor: isActive ? item.accentColor : 'rgba(255,255,255,0.4)',
                boxShadow: isActive ? `0 0 8px ${item.accentColor}` : undefined,
              }}
            />
            <span className="text-[10px] font-mono tracking-widest text-slate-400">
              {isActive ? 'SYNCED' : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* Center Hover / Active Action Glyphs */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none">
          {isActive ? (
            <div
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black/70 backdrop-blur-md border transition-all duration-300 ${
                isHovered
                  ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto text-cyan-300 bg-cyan-950/40'
                  : 'opacity-0 translate-y-2 scale-95 pointer-events-none text-white/80'
              }`}
              style={{
                borderColor: isHovered ? item.accentColor : 'rgba(255, 255, 255, 0.2)',
                boxShadow: isHovered ? `0 0 20px ${item.accentColor}44` : undefined,
              }}
            >
              <Play className="w-4 h-4 fill-current" />
              <span className="text-xs font-mono tracking-widest uppercase">
                Expand & Play
              </span>
            </div>
          ) : (
            <div
              className={`p-3.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/70 transition-all duration-300 ${
                isHovered ? 'scale-110 opacity-100 text-cyan-400 border-cyan-400' : 'opacity-0'
              }`}
            >
              <Eye className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Bottom Title & Subtitle Section - Positioned closer to the bottom */}
        <div className="relative z-10 px-6 pb-4 pt-0">
          <h3
            className="font-chakra font-bold text-xl leading-tight tracking-wide text-white transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
            style={{
              color: isActive ? '#FFFFFF' : '#E8F1F5',
            }}
          >
            {item.title}
          </h3>
          <p className="text-sm text-slate-200 font-rajdhani font-medium tracking-wide mt-1 line-clamp-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
            {item.subtitle}
          </p>
        </div>

        {/* Corner HUD Brackets */}
        <div
          className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 pointer-events-none"
          style={{ borderColor: isActive ? item.accentColor : 'rgba(255,255,255,0.2)' }}
        />
        <div
          className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 pointer-events-none"
          style={{ borderColor: isActive ? item.accentColor : 'rgba(255,255,255,0.2)' }}
        />
        <div
          className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 pointer-events-none"
          style={{ borderColor: isActive ? item.accentColor : 'rgba(255,255,255,0.2)' }}
        />
        <div
          className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 pointer-events-none"
          style={{ borderColor: isActive ? item.accentColor : 'rgba(255,255,255,0.2)' }}
        />
      </div>
    </div>
  );
};
