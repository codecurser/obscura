import React, { useState, useRef, useEffect, useCallback } from 'react';
import { teamMembers } from '../../data/teamData';
import TeamCard from './TeamCard';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function TeamSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const trackRef = useRef(null);
  const dragStartX = useRef(0);
  const currentDragX = useRef(0);
  const autoPlayTimerRef = useRef(null);
  const { playDialTick } = useViewfinder();

  const filterTabs = [
    { key: 'all', label: `All Collective (${teamMembers.length})` },
    { key: 'board', label: `Leadership (${teamMembers.filter(m => m.category === 'board').length})` },
    { key: 'core', label: `Core Team (${teamMembers.filter(m => m.category === 'core').length})` }
  ];

  const filteredMembers = activeCategory === 'all'
    ? teamMembers
    : teamMembers.filter(m => m.category === activeCategory);

  // Update cards visible per screen size
  const updateCardsPerView = useCallback(() => {
    const w = window.innerWidth;
    if (w <= 560) {
      setCardsPerView(1);
    } else if (w <= 860) {
      setCardsPerView(2);
    } else if (w <= 1200) {
      setCardsPerView(3);
    } else {
      setCardsPerView(4);
    }
  }, []);

  useEffect(() => {
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, [updateCardsPerView]);

  const maxIndex = Math.max(0, filteredMembers.length - cardsPerView);

  // Reset index if category changes or exceeds maxIndex
  useEffect(() => {
    setCurrentIndex(prev => Math.min(prev, maxIndex));
  }, [filteredMembers.length, maxIndex]);

  const handleCategoryChange = (key) => {
    setActiveCategory(key);
    setCurrentIndex(0);
    playDialTick();
  };

  const goToSlide = (index) => {
    const clamped = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(clamped);
    playDialTick();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    playDialTick();
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    playDialTick();
  }, [maxIndex, playDialTick]);

  // Robust Auto Slider with Pause on Hover
  useEffect(() => {
    if (isPaused || isDragging || maxIndex === 0) return;

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPaused, isDragging, maxIndex]);

  // Touch and Mouse Drag / Swipe Handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setIsPaused(true);
    dragStartX.current = e.touches[0].clientX;
    currentDragX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    currentDragX.current = e.touches[0].clientX;
    const diff = currentDragX.current - dragStartX.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);
    const diff = currentDragX.current - dragStartX.current;
    const threshold = 50;

    if (diff < -threshold) {
      handleNext();
    } else if (diff > threshold) {
      handlePrev();
    }
    setDragOffset(0);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsPaused(true);
    dragStartX.current = e.clientX;
    currentDragX.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    currentDragX.current = e.clientX;
    const diff = currentDragX.current - dragStartX.current;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);
    const diff = currentDragX.current - dragStartX.current;
    const threshold = 60;

    if (diff < -threshold) {
      handleNext();
    } else if (diff > threshold) {
      handlePrev();
    }
    setDragOffset(0);
  };

  // Calculate slide displacement
  const getCardOffset = () => {
    if (!trackRef.current || !trackRef.current.firstElementChild) return 0;
    const cardEl = trackRef.current.firstElementChild;
    const gap = window.innerWidth <= 860 ? (window.innerWidth <= 560 ? 0 : 20) : (window.innerWidth <= 1200 ? 24 : 28);
    const cardWidth = cardEl.offsetWidth;
    const baseOffset = currentIndex * (cardWidth + gap);
    return baseOffset - (isDragging ? dragOffset : 0);
  };

  const currentOffset = getCardOffset();

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

          {/* Carousel Controls with Counter */}
          <div className="team-carousel-nav">
            <button
              className="team-carousel-btn"
              id="teamPrevBtn"
              onClick={handlePrev}
              aria-label="Previous Team Member"
              title="Previous Team Member"
            >
              ❮
            </button>
            <span className="team-slide-counter">
              {String(currentIndex + 1).padStart(2, '0')} / {String(maxIndex + 1).padStart(2, '0')}
            </span>
            <button
              className="team-carousel-btn"
              id="teamNextBtn"
              onClick={handleNext}
              aria-label="Next Team Member"
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
          onMouseLeave={() => {
            setIsPaused(false);
            if (isDragging) handleMouseUp();
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div
            className="team-carousel-track"
            id="teamTrack"
            ref={trackRef}
            style={{
              transform: `translateX(-${currentOffset}px)`,
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0, 0, 1)'
            }}
          >
            {filteredMembers.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>

        {/* Carousel Pagination Indicator Dots */}
        {maxIndex > 0 && (
          <div className="team-carousel-pagination">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                className={`team-dot ${currentIndex === idx ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
