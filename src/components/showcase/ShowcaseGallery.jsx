import React, { useState, useEffect, useRef } from 'react';
import { showcasePhotos } from '../../data/showcaseData';
import ShowcaseCard from './ShowcaseCard';
import { useViewfinder } from '../../context/ViewfinderContext';
import { useModal } from '../../context/ModalContext';

export default function ShowcaseGallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [layoutMode, setLayoutMode] = useState('merged'); // 'merged' | 'collage' | 'grid'
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);
  const hasAutoExploded = useRef(false);

  const { playDialTick, playShutter } = useViewfinder();
  const { openLightbox } = useModal();

  const filterTabs = [
    { key: 'all', label: `All Disciplines (${showcasePhotos.length})` },
    { key: 'portrait', label: 'Portraits & Editorial' },
    { key: 'street', label: 'Street & Architecture' },
    { key: 'nature', label: 'Nature & Fine Art' },
    { key: 'cine', label: 'Cinematography & Live' }
  ];

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    setSpotlightIndex(0);
    playDialTick();
  };

  const explodeCollage = () => {
    setLayoutMode('collage');
    playShutter();
  };

  const mergePhotos = () => {
    setLayoutMode('merged');
    playDialTick();
  };

  const handleLayoutChange = (mode) => {
    setLayoutMode(mode);
    playDialTick();
  };

  // Scroll Listener: When user scrolls down into the section, auto-distort and explode the merged stack
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || hasAutoExploded.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const triggerThreshold = window.innerHeight * 0.7;

      // If the top of the section has entered the active reading zone
      if (rect.top <= triggerThreshold && rect.bottom >= 100) {
        if (layoutMode === 'merged') {
          hasAutoExploded.current = true;
          explodeCollage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [layoutMode]);

  const filteredPhotos = activeFilter === 'all'
    ? showcasePhotos
    : showcasePhotos.filter((p) => p.genre === activeFilter);

  // Automatic Live Spotlight Cycle in collage mode
  useEffect(() => {
    if (isHovered || layoutMode !== 'collage' || filteredPhotos.length === 0) return;

    const interval = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % filteredPhotos.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered, layoutMode, filteredPhotos.length]);

  // Duplicated list for continuous infinite horizontal filmstrip
  const filmstripPhotos = [...showcasePhotos, ...showcasePhotos];

  return (
    <section className="showcase-section section-spacing" id="showcase" ref={sectionRef}>
      <div className="container">
        <div className="section-header center">
          <span className="section-tag"><span className="pulse-dot"></span> LIVE ARCHIVE &amp; EXHIBITION</span>
          <h2 className="section-title">Visual <span className="accent-gradient">Showcase &amp; Collage</span></h2>
          <p className="section-subtitle">
            All 16 exhibition frames begin merged together in a single photographic stack. Scroll down or click to distort, explode, and scatter them across the living collage wall.
          </p>
        </div>

        {/* Live Continuous Filmstrip Ticker Strip */}
        <div className="showcase-filmstrip-wrapper" title="Live stream - Click any frame to inspect">
          <div className="filmstrip-track">
            {filmstripPhotos.map((photo, i) => (
              <div
                key={`${photo.id}-strip-${i}`}
                className="filmstrip-item"
                onClick={() => {
                  playDialTick();
                  openLightbox(photo, showcasePhotos);
                }}
              >
                <img
                  src={photo.imgSrc}
                  alt={photo.title}
                  className="filmstrip-thumb"
                  loading="lazy"
                />
                <div className="filmstrip-meta">
                  <span className="filmstrip-title">{photo.title}</span>
                  <span className="filmstrip-spec">{photo.lensBadge} • {photo.genreBadge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls Bar: Filters & View Switcher */}
        <div className="showcase-controls-bar">
          <div className="gallery-filter-bar" style={{ marginBottom: 0 }}>
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                className={`filter-btn ${activeFilter === tab.key ? 'active' : ''}`}
                data-filter={tab.key}
                onClick={() => handleFilterChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="gallery-view-toggle">
            <button
              className={`view-toggle-btn ${layoutMode === 'merged' ? 'active' : ''}`}
              onClick={mergePhotos}
              title="Merge all photos into a central stack"
            >
              🎴 Merged Stack
            </button>
            <button
              className={`view-toggle-btn ${layoutMode === 'collage' ? 'active' : ''}`}
              onClick={explodeCollage}
              title="Distort & Explode into Living Collage"
            >
              💥 Distorted Collage
            </button>
            <button
              className={`view-toggle-btn ${layoutMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleLayoutChange('grid')}
              title="Standard Uniform Grid Layout"
            >
              ▦ Clean Grid
            </button>
          </div>
        </div>

        {/* Gallery Grid / Merged Cluster with Live Explosion Transition */}
        <div
          key={`${activeFilter}-${layoutMode}`}
          className={`showcase-grid ${
            layoutMode === 'merged'
              ? 'layout-merged'
              : layoutMode === 'collage'
              ? 'layout-collage'
              : ''
          }`}
          id="showcaseGrid"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {filteredPhotos.map((photo, index) => (
            <ShowcaseCard
              key={photo.id}
              photo={photo}
              list={filteredPhotos}
              index={index}
              layoutMode={layoutMode}
              isSpotlighted={layoutMode === 'collage' && index === spotlightIndex}
              onStackClick={explodeCollage}
            />
          ))}

          {/* Action Prompt Pill when in Merged Deck Mode */}
          {layoutMode === 'merged' && (
            <div className="merged-deck-action-overlay">
              <button
                className="merged-deck-pill"
                onClick={explodeCollage}
              >
                💥 SCROLL DOWN OR CLICK TO EXPLODE 16 FRAMES
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
