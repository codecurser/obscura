import React from 'react';

export default function HeroVideo() {
  return (
    <section className="hero-video-section" id="hero">
      <div className="hero-video-viewport">
        <video
          className="hero-video-player"
          src="/assets/videos/obscura_hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
    </section>
  );
}
