import React, { useState, useRef, useEffect } from 'react';
import { teamMembers } from '../../data/teamData';
import TeamCard from './TeamCard';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function TeamSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const { playDialTick } = useViewfinder();

  const filterTabs = [
    { key: 'all', label: `All Collective (${teamMembers.length})` },
    { key: 'board', label: `Board & Leadership (${teamMembers.filter(m => m.category === 'board').length})` },
    { key: 'core', label: `Core Team (${teamMembers.filter(m => m.category === 'core').length})` }
  ];

  const filteredMembers = activeCategory === 'all'
    ? teamMembers
    : teamMembers.filter(m => m.category === activeCategory);

  const handleCategoryChange = (key) => {
    setActiveCategory(key);
    playDialTick();
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
  };

  const handlePrev = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
    playDialTick();
  };

  const handleNext = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
    playDialTick();
  };

  // Smooth auto-scrolling
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (!trackRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        trackRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, filteredMembers]);

  return (
    <section className="team-section section-spacing" id="team">
      <div className="container">
        <div className="section-header row-layout">
          <div>
            <span className="section-tag"><span className="pulse-dot"></span> THE COLLECTIVE</span>
            <h2 className="section-title">Leadership &amp; <span className="accent-gradient">Core Team</span></h2>
            <p className="section-subtitle">
              Meet the directors, cinematographers, colorists, and visual artists behind the Obscura collective.
            </p>
          </div>

          {/* Carousel Manual Controls */}
          <div className="team-carousel-nav-controls">
            <button
              className="carousel-arrow-btn"
              id="teamPrevBtn"
              onClick={handlePrev}
              title="Previous Team Member"
            >
              ❮
            </button>
            <button
              className="carousel-arrow-btn"
              id="teamNextBtn"
              onClick={handleNext}
              title="Next Team Member"
            >
              ❯
            </button>
          </div>
        </div>

        {/* Team Role Filter Pills */}
        <div className="team-role-filter-bar">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              className={`team-role-pill ${activeCategory === tab.key ? 'active' : ''}`}
              data-role={tab.key}
              onClick={() => handleCategoryChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Horizontal Carousel Viewport */}
        <div
          className="team-carousel-viewport"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="team-carousel-track" id="teamTrack" ref={trackRef}>
            {filteredMembers.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
