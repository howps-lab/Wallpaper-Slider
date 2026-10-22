import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GALLERY_ITEMS } from '../data/galleryItems';
import { GalleryItem } from '../types/gallery';
import { GalleryCard } from './GalleryCard';
import { GalleryNavigation } from './GalleryNavigation';
import { ExpandedVideoViewer } from './ExpandedVideoViewer';
import { cyberAudio } from '../utils/cyberAudio';

export const CinematicGallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedItem, setExpandedItem] = useState<GalleryItem | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const lastNavTimeRef = useRef<number>(0);

  const totalItems = GALLERY_ITEMS.length;

  // Circular navigation with debounce lock
  const handleNext = useCallback(() => {
    const now = Date.now();
    if (now - lastNavTimeRef.current < 280) return;
    lastNavTimeRef.current = now;

    setActiveIndex((prev) => (prev + 1) % totalItems);
    if (expandedItem) {
      const nextIdx = (activeIndex + 1) % totalItems;
      setExpandedItem(GALLERY_ITEMS[nextIdx]);
    }
  }, [totalItems, activeIndex, expandedItem]);

  const handlePrev = useCallback(() => {
    const now = Date.now();
    if (now - lastNavTimeRef.current < 280) return;
    lastNavTimeRef.current = now;

    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
    if (expandedItem) {
      const prevIdx = (activeIndex - 1 + totalItems) % totalItems;
      setExpandedItem(GALLERY_ITEMS[prevIdx]);
    }
  }, [totalItems, activeIndex, expandedItem]);

  const handleSelect = useCallback(
    (index: number) => {
      const now = Date.now();
      if (now - lastNavTimeRef.current < 250) return;
      lastNavTimeRef.current = now;
      setActiveIndex(index);
    },
    []
  );

  const handleExpand = useCallback((item: GalleryItem) => {
    setExpandedItem(item);
  }, []);

  const handleCloseExpanded = useCallback(() => {
    setExpandedItem(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal is open, its internal handler manages Escape/Arrows
      if (expandedItem) return;

      if (e.key === 'ArrowRight') {
        cyberAudio.playCardSlide();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        cyberAudio.playCardSlide();
        handlePrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        cyberAudio.playExpand();
        handleExpand(GALLERY_ITEMS[activeIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleExpand, activeIndex, expandedItem]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;

    // Check if horizontal swipe is dominant and above threshold
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        cyberAudio.playCardSlide();
        handleNext();
      } else {
        cyberAudio.playCardSlide();
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Autoplay timer (auto pauses when expanded)
  useEffect(() => {
    if (!isAutoplay || expandedItem) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoplay, expandedItem, handleNext]);

  const activeCard = GALLERY_ITEMS[activeIndex];

  return (
    <div
      className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden select-none px-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main 3D Perspective Gallery Stage - Centered on Screen */}
      <div className="relative w-full flex items-center justify-center translate-y-2 sm:translate-y-3 md:translate-y-4">
        {/* Subtle Ambient Radial Glow behind the Active Card */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-700 blur-[150px] opacity-25"
          style={{
            backgroundColor: activeCard.accentColor,
          }}
        />

        {/* 3D Container with Shared Perspective - 20% larger */}
        <div className="relative w-full max-w-7xl h-[490px] sm:h-[540px] flex items-center justify-center perspective-container">
          {GALLERY_ITEMS.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
              activeIndex={activeIndex}
              totalItems={totalItems}
              onSelect={handleSelect}
              onExpand={handleExpand}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation positioned directly below the centered cards */}
      <div className="w-full flex justify-center mt-4 sm:mt-6 translate-y-2 sm:translate-y-3 md:translate-y-4 z-30">
        <GalleryNavigation
          currentIndex={activeIndex}
          totalItems={totalItems}
          onPrev={handlePrev}
          onNext={handleNext}
          isAutoplay={isAutoplay}
          onToggleAutoplay={() => setIsAutoplay((prev) => !prev)}
          accentColor={activeCard.accentColor}
        />
      </div>

      {/* Enlarged Cinematic Video Player Modal */}
      {expandedItem && (
        <ExpandedVideoViewer
          item={expandedItem}
          onClose={handleCloseExpanded}
          onPrev={handlePrev}
          onNext={handleNext}
          currentIndex={activeIndex}
          totalItems={totalItems}
        />
      )}
    </div>
  );
};
