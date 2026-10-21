import { useState } from 'react';
import { BackgroundVideo } from './components/BackgroundVideo';
import { TopHeader } from './components/TopHeader';
import { CinematicGallery } from './components/CinematicGallery';
import { InfoModal } from './components/InfoModal';

export default function App() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#08090B] text-[#E8F1F5] font-rajdhani selection:bg-cyan-500 selection:text-black">
      {/* 1. Full-Page Looping Background Video */}
      <BackgroundVideo videoSrc="/assets/aistudio/background_video_1280_720_c5a61ffd.mp4" />

      {/* 2. Top Header HUD */}
      <TopHeader onOpenInfo={() => setIsInfoOpen(true)} />

      {/* 3. Main 3D Slider & Interactive Cinematic Experience */}
      <main className="relative z-10 w-full h-full">
        <CinematicGallery />
      </main>

      {/* 4. Specification & Shortcuts Guide Modal */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}
