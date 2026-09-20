import React, { useState } from 'react';
import { photographyTips } from '../../data/photographyTipsData';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function PhotographyTipsSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const { playDialTick } = useViewfinder();

  const filterTabs = [
    { key: 'all', label: `All Principles (${photographyTips.length})` },
    { key: 'composition', label: 'Composition & Framing' },
    { key: 'lighting', label: 'Lighting & Color' },
    { key: 'exposure', label: 'Exposure & Optics' }
  ];

  const handleFilterChange = (key) => {
    setActiveCategory(key);
    playDialTick();
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
    playDialTick();
  };

  const filteredTips = activeCategory === 'all'
    ? photographyTips
    : photographyTips.filter(t => t.category === activeCategory);

  return (
    <section className="tips-section section-spacing" id="tips">
      <div className="container">
        <div className="section-header center">
          <span className="section-tag"><span className="pulse-dot"></span> OBSCURA FIELD GUIDE</span>
          <h2 className="section-title">Photography Laws &amp; <span className="accent-gradient">Mastery Principles</span></h2>
          <p className="section-subtitle">
            Fundamental rules of visual composition, lighting architecture, and sensor physics curated by Obscura cinematographers to elevate every frame you capture.
          </p>
        </div>

        {/* Category Filters */}
        <div className="tips-filter-bar">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              className={`filter-btn ${activeCategory === tab.key ? 'active' : ''}`}
              onClick={() => handleFilterChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tips Grid */}
        <div className="tips-grid">
          {filteredTips.map((tip) => {
            const isExpanded = expandedId === tip.id;

            return (
              <div
                key={tip.id}
                className={`tip-card ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleExpand(tip.id)}
              >
                {/* Visual Header & Badges */}
                <div className="tip-card-header">
                  <div className="tip-badge-row">
                    <span className="tip-main-badge">{tip.badge}</span>
                    <span className="tip-tag-badge">{tip.tag}</span>
                  </div>
                  <span className="tip-id-badge">RULE #{String(tip.id).padStart(2, '0')}</span>
                </div>

                {/* Card Title & Subtitle */}
                <div className="tip-card-body">
                  <h3 className="tip-title">{tip.title}</h3>
                  <span className="tip-subtitle">{tip.subtitle}</span>
                  <p className="tip-summary">{tip.summary}</p>

                  {/* Key Takeaways */}
                  <div className="tip-keypoints">
                    {tip.keyPoints.map((point, idx) => (
                      <span key={idx} className="tip-point-pill">
                        ✓ {point}
                      </span>
                    ))}
                  </div>

                  {/* Pro Field Technique Box */}
                  <div className="tip-pro-box">
                    <div className="tip-pro-header">
                      <span className="tip-pro-icon">💡</span>
                      <span className="tip-pro-label">PRO FIELD TECHNIQUE</span>
                    </div>
                    <p className="tip-pro-text">{tip.proTip}</p>
                  </div>
                </div>

                {/* Card Telemetry Footer */}
                <div className="tip-card-footer">
                  <span className="tip-telemetry">{tip.telemetry}</span>
                  <span className="tip-expand-hint">
                    {isExpanded ? 'LESS ▲' : 'DETAILS ▼'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
