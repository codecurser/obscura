import React from 'react';
import { pastWalks } from '../../data/photowalkData';

export default function PastWalksGrid() {
  return (
    <div style={{ marginTop: '60px' }}>
      <div className="section-header">
        <span className="section-tag">ARCHIVES</span>
        <h3 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Recent Photowalk Recaps</h3>
      </div>
      <div className="past-walks-grid">
        {pastWalks.map((walk) => (
          <div key={walk.id} className="past-walk-card">
            <div className="past-walk-header-row">
              <span className="past-walk-date">{walk.date}</span>
              {walk.reel ? (
                <span className="past-walk-badge-highlight">▶ REEL HIGHLIGHT</span>
              ) : (
                <span className="section-tag" style={{ padding: '3px 10px', fontSize: '0.7rem' }}>
                  {walk.tag}
                </span>
              )}
            </div>

            <h4 className="past-walk-title">{walk.title}</h4>
            <p style={{ fontSize: '0.9rem' }}>{walk.description}</p>

            {walk.reel && (
              <div className="past-walk-video-container">
                <iframe
                  src={walk.reel.embedUrl}
                  className="past-walk-reel-frame"
                  title={`${walk.title} Instagram Reel`}
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency="true"
                  allowFullScreen={true}
                />
              </div>
            )}

            <div className="past-walk-stats" style={{ marginTop: 'auto' }}>
              <span>👥 {walk.stats.attendees}</span>
              <span>📸 {walk.stats.submissions}</span>
              {walk.reel && (
                <a
                  href={walk.reel.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="past-walk-ig-link"
                >
                  Watch Reel ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
