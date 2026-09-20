import React, { useState, useEffect } from 'react';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function Navbar() {
  const { hudActive, toggleHud, soundEnabled, toggleSound, playDialTick } = useViewfinder();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    playDialTick();
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container nav-container">
        <a href="#hero" className="brand-logo" id="brandLogo" onClick={playDialTick}>
          <img src="/assets/images/obscura_hero_transparent.png" alt="OBSCURA official logo" className="brand-logo-img" />
        </a>

        <nav>
          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`} id="navLinks">
            <li><a href="#showcase" className="nav-link" onClick={handleNavClick}>Showcase</a></li>
            <li><a href="#photowalk" className="nav-link" onClick={handleNavClick}>Photowalks</a></li>
            <li><a href="#grading" className="nav-link" onClick={handleNavClick}>Color Lab</a></li>
            <li><a href="#masterclass" className="nav-link" onClick={handleNavClick}>Workshops</a></li>
            <li><a href="#team" className="nav-link" onClick={handleNavClick}>Team</a></li>
          </ul>
        </nav>

        <div className="nav-actions">
          {/* Viewfinder HUD Toggle */}
          <button
            className={`hud-toggle-btn ${hudActive ? 'active' : ''}`}
            id="hudToggleBtn"
            onClick={toggleHud}
            title="Toggle Camera Viewfinder HUD (Hotkey: V)"
          >
            <span className="hud-dot"></span>
            <span className="btn-text">HUD: {hudActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/obscura_sharda/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-icon-only"
            title="Follow @obscura_sharda on Instagram"
            aria-label="Instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          {/* Sound Effect Toggle */}
          <button
            className={`btn-secondary btn-icon-only ${soundEnabled ? 'active' : ''}`}
            id="soundToggleBtn"
            onClick={toggleSound}
            title="Toggle Shutter Audio Feedback"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
              {soundEnabled ? (
                <>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </>
              ) : (
                <line x1="23" y1="9" x2="17" y2="15"></line>
              )}
            </svg>
          </button>

          <a href="#team" className="btn btn-primary btn-sm" onClick={playDialTick}>Meet The Team</a>
          <button
            className="mobile-menu-btn"
            id="mobileMenuBtn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
