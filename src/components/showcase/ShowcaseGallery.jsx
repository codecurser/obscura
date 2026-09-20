import React, { useState } from 'react';
import { showcasePhotos } from '../../data/showcaseData';
import ShowcaseCard from './ShowcaseCard';
import { useViewfinder } from '../../context/ViewfinderContext';
import { useModal } from '../../context/ModalContext';

export default function ShowcaseGallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [layoutMode, setLayoutMode] = useState('collage'); // 'collage' | 'grid'
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
    playDialTick();
  };

  const handleLayoutChange = (mode) => {
    setLayoutMode(mode);
    playDialTick();
  };

  const filteredPhotos = activeFilter === 'all'
    ? showcasePhotos
    : showcasePhotos.filter((p) => p.genre === activeFilter);

  // Duplicated list for seamless infinite horizontal filmstrip
  const filmstripPhotos = [...showcasePhotos, ...showcasePhotos];

  return (
    <section className="showcase-section section-spacing" id="showcase">
      <div className="container">
        <div className="section-header center">
          <span className="section-tag"><span className="pulse-dot"></span> CURATED EXHIBITION</span>
          <h2 className="section-title">Visual <span className="accent-gradient">Showcase</span></h2>
          <p className="section-subtitle">
            Explore curated high-fidelity frames from the Obscura visual archive. Click any photograph to view raw EXIF telemetry, color grading profiles, and optics data.
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
              title="Dynamic Magazine Collage Layout"
            >
              🖼️ Collage Flow
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

        {/* Gallery Dynamic Collage / Grid with Keyed Transition Animation */}
        <div
          key={`${activeFilter}-${layoutMode}`}
          className={`showcase-grid ${layoutMode === 'collage' ? 'layout-collage' : ''}`}
          id="showcaseGrid"
        >
          {filteredPhotos.map((photo, index) => (
            <ShowcaseCard
              key={photo.id}
              photo={photo}
              list={filteredPhotos}
              index={index}
              isCollageView={layoutMode === 'collage'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
