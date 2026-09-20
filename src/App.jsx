import React from 'react';
import { ViewfinderProvider } from './context/ViewfinderContext';
import { ModalProvider } from './context/ModalContext';

// Common Overlays
import CameraCursor from './components/common/CameraCursor';
import ViewfinderHUD from './components/common/ViewfinderHUD';
import { ShutterFlash, Toast } from './components/common/Toast';

// Layout & Sections
import Navbar from './components/layout/Navbar';
import HeroVideo from './components/hero/HeroVideo';
import PhotowalkSection from './components/photowalk/PhotowalkSection';
import ShowcaseGallery from './components/showcase/ShowcaseGallery';
import ColorGradingLab from './components/grading/ColorGradingLab';
import WorkshopsSection from './components/workshops/WorkshopsSection';
import TeamSection from './components/team/TeamSection';
import Footer from './components/layout/Footer';

// Modals
import LightboxModal from './components/showcase/LightboxModal';
import PassGeneratorModal from './components/pass/PassGeneratorModal';

export default function App() {
  return (
    <ViewfinderProvider>
      <ModalProvider>
        {/* Custom Focus Cursor */}
        <CameraCursor />

        {/* Film Grain Ambient Background */}
        <div className="film-grain-overlay" aria-hidden="true" />

        {/* Shutter Flash Animation */}
        <ShutterFlash />

        {/* Fullscreen Camera Viewfinder HUD */}
        <ViewfinderHUD />

        {/* Ambient Lighting Glow */}
        <div className="ambient-glow-top" aria-hidden="true" />

        {/* Application Navigation */}
        <Navbar />

        {/* Main Sections */}
        <main>
          {/* 1. Hero Video Section */}
          <HeroVideo />

          {/* 2. Photowalk Announcements & Past Recaps */}
          <PhotowalkSection />

          {/* 3. Visual Showcase (16 Exhibition Photos) */}
          <ShowcaseGallery />

          {/* 4. DaVinci Color Grading Lab */}
          <ColorGradingLab />

          {/* 5. Workshops & Masterclasses */}
          <WorkshopsSection />

          {/* 6. Leadership & Core Team Carousel */}
          <TeamSection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Modals & Toasts */}
        <LightboxModal />
        <PassGeneratorModal />
        <Toast />
      </ModalProvider>
    </ViewfinderProvider>
  );
}
