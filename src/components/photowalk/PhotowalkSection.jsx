import React from 'react';
import { upcomingWalk } from '../../data/photowalkData';
import CountdownTimer from './CountdownTimer';
import { RouteCheckpoints, GearChecklist } from './RouteCheckpoints';
import PastWalksGrid from './PastWalksGrid';
import { useModal } from '../../context/ModalContext';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function PhotowalkSection() {
  const { openRsvp } = useModal();
  const { playDialTick } = useViewfinder();

  const handleRsvpClick = () => {
    playDialTick();
    openRsvp();
  };

  return (
    <section className="photowalk-section section-spacing" id="photowalk">
      <div className="container">
        <div className="section-header center">
          <span className="section-tag"><span className="pulse-dot"></span> COMMUNITY EXPEDITIONS</span>
          <h2 className="section-title">Photowalk <span className="accent-gradient">Announcements</span></h2>
          <p className="section-subtitle">Grab your glass and walk the city streets with fellow filmmakers and photographers. All skill levels welcome.</p>
        </div>

        {/* Featured Upcoming Photowalk Banner Card */}
        <div className="photowalk-featured-card">
          <div className="photowalk-media-box">
            <img
              src={upcomingWalk.image}
              alt={upcomingWalk.title}
              className="photowalk-banner-img"
              loading="lazy"
              decoding="async"
            />
            <div className="photowalk-media-overlay"></div>
            <span className="photowalk-tag-badge">{upcomingWalk.tag}</span>

            <CountdownTimer targetDate={upcomingWalk.targetDate} />
          </div>

          {/* Photowalk Details & Itinerary */}
          <div className="photowalk-details-box">
            <div>
              <div className="walk-date-row">
                <span>📅 {upcomingWalk.date}</span>
                <span>📍 {upcomingWalk.location}</span>
              </div>
              <h3 className="walk-title">{upcomingWalk.title}</h3>
              <p className="walk-desc">{upcomingWalk.description}</p>

              {/* Metadata Grid */}
              <div className="walk-meta-grid">
                {upcomingWalk.stats.map((st, i) => (
                  <div key={i} className="walk-meta-card">
                    <div className="walk-meta-icon">{st.icon}</div>
                    <div className="walk-meta-info">
                      <span className="meta-title">{st.title}</span>
                      <span className="meta-val">{st.val}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Route Checkpoints */}
              <RouteCheckpoints steps={upcomingWalk.routeSteps} />

              {/* Recommended Gear Checklist */}
              <GearChecklist items={upcomingWalk.gearItems} />
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '20px' }}>
              <button className="btn btn-primary" id="openRsvpModalBtn" onClick={handleRsvpClick}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                RSVP For This Walk (Free)
              </button>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                Instant ticket badge issued
              </span>
            </div>
          </div>
        </div>

        {/* Past Photowalk Archives */}
        <PastWalksGrid />
      </div>
    </section>
  );
}
