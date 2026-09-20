import React, { useState } from 'react';
import { showcasePhotos } from '../../data/showcaseData';
import ShowcaseCard from './ShowcaseCard';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function ShowcaseGallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { playDialTick } = useViewfinder();

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

  const filteredPhotos = activeFilter === 'all'
    ? showcasePhotos
    : showcasePhotos.filter((p) => p.genre === activeFilter);

  return (
    <section className="showcase-section section-spacing" id="showcase">
      <div className="container">
        <div className="section-header center">
          <span className="section-tag"><span className="pulse-dot"></span> CURATED EXHIBITION</span>
          <h2 className="section-title">Visual <span className="accent-gradient">Showcase</span></h2>
          <p className="section-subtitle">
            Explore curated high-fidelity frames from the Obscura visual archive. Click any photograph to view raw EXIF telemetry and camera specs.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="gallery-filter-bar">
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

        {/* Gallery Grid (All 16 Exhibition Frames) */}
        <div className="showcase-grid" id="showcaseGrid">
          {filteredPhotos.map((photo) => (
            <ShowcaseCard key={photo.id} photo={photo} list={filteredPhotos} />
          ))}
        </div>
      </div>
    </section>
  );
}
