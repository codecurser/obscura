import React, { useState, useEffect, useRef } from 'react';
import { showcasePhotos } from '../../data/showcaseData';
import ShowcaseCard from './ShowcaseCard';
import { useViewfinder } from '../../context/ViewfinderContext';
import { useModal } from '../../context/ModalContext';

export default function ShowcaseGallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [layoutMode, setLayoutMode] = useState('collage'); // 'collage' | 'grid'
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { playDialTick } = useViewfinder();
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

  const handleLayoutChange = (mode) => {
    setLayoutMode(mode);
    playDialTick();
  };

  const filteredPhotos = activeFilter === 'all'
    ? showcasePhotos
    : showcasePhotos.filter((p) => p.genre === activeFilter);

  // Automatic Live Spotlight Cycle (every 4.5s, pauses on hover)
  useEffect(() => {
    if (isHovered || filteredPhotos.length === 0) return;

    const interval = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % filteredPhotos.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered, filteredPhotos.length]);

  // Duplicated list for continuous infinite horizontal filmstrip
  const filmstripPhotos = [...showcasePhotos, ...showcasePhotos];

  return (
    <section className="showcase-section section-spacing" id="showcase">
      <div className="container">
        <div className="section-header center">
          <span className="section-tag"><span className="pulse-dot"></span> LIVE ARCHIVE &amp; EXHIBITION</span>
          <h2 className="section-title">Visual <span className="accent-gradient">Collage Wall</span></h2>
          <p className="section-subtitle">
            A dynamic, living exhibition collage from the Obscura visual collective. Frames continuously float, spotlight, and pulse with live telemetry data.
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
              className={`view-toggle-btn ${layoutMode === 'collage' ? 'active' : ''}`}
              onClick={() => handleLayoutChange('collage')}
              title="Living Asymmetric Collage Layout"
            >
              🌟 Living Collage
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

        {/* Gallery Dynamic Living Collage Wall with Keyed Transition Animation */}
        <div
          key={`${activeFilter}-${layoutMode}`}
          className={`showcase-grid ${layoutMode === 'collage' ? 'layout-collage' : ''}`}
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
              isCollageView={layoutMode === 'collage'}
              isSpotlighted={layoutMode === 'collage' && index === spotlightIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
