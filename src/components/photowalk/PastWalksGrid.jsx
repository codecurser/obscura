import React from 'react';
import { pastWalks } from '../../data/photowalkData';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function PastWalksGrid() {
  const { playDialTick } = useViewfinder();

  return (
    <div style={{ marginTop: '54px' }}>
      <div className="section-header">
        <span className="section-tag"><span className="pulse-dot"></span> ARCHIVES</span>
        <h3 style={{ fontSize: '1.65rem', fontWeight: '900', color: '#09090b' }}>Recent Photowalk Recaps</h3>
      </div>

      <div className="past-walks-grid">
        {pastWalks.map((walk) => (
          <div key={walk.id} className="past-walk-card">
            <div className="past-walk-header-row">
              <span className="past-walk-date">{walk.date}</span>
              {walk.reel ? (
                <span className="past-walk-badge-highlight">▶ REEL HIGHLIGHT</span>
              ) : (
                <span className="past-walk-tag-badge">
                  {walk.tag}
                </span>
              )}
            </div>

            <h4 className="past-walk-title">{walk.title}</h4>
            <p className="past-walk-desc">{walk.description}</p>

            <div className="past-walk-stats">
              <span>👥 {walk.stats.attendees}</span>
              <span>📸 {walk.stats.submissions}</span>
              {walk.reel && (
                <a
                  href={walk.reel.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="past-walk-reel-btn"
                  onClick={playDialTick}
                  title="Watch Instagram Reel"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span>Watch Reel ↗</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
