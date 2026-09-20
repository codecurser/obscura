import React, { useState } from 'react';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function Footer() {
  const { showToast, playShutterClick } = useViewfinder();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    playShutterClick();
    showToast(`✓ Subscribed ${email} to Obscura Dispatches!`);
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#hero" className="brand-logo">
              <img src="/assets/images/obscura_hero_transparent.png" alt="OBSCURA official logo" className="brand-logo-img" />
            </a>
            <p>The premier collective for photography, videography, color science, and visual exploration.</p>
            <div style={{ marginTop: '18px' }}>
              <a
                href="https://www.instagram.com/obscura_sharda/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Follow @obscura_sharda</span>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#showcase">Curated Showcase</a></li>
              <li><a href="#photowalk">Photowalks</a></li>
              <li><a href="#grading">Color Grading Lab</a></li>
              <li><a href="#tips">Photography Laws &amp; Guide</a></li>
              <li><a href="#team">Leadership &amp; Team</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Social &amp; Community</h4>
            <ul>
              <li>
                <a
                  href="https://www.instagram.com/obscura_sharda/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', fontWeight: '700' }}
                >
                  📸 Instagram (@obscura_sharda)
                </a>
              </li>
              <li><a href="#photowalk">Upcoming Photowalks</a></li>
              <li><a href="#masterclass">Workshops &amp; Gear</a></li>
              <li><a href="#team">Core Members</a></li>
              <li><a href="#photowalk">Route Checkpoints</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Photowalk Dispatches</h4>
            <p style={{ fontSize: '0.88rem', marginBottom: '16px' }}>Receive notifications for secret rooftop walks and gear drops.</p>
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                className="form-input"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: '10px 14px', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-primary btn-sm">Join</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 OBSCURA COLLECTIVE. ALL RIGHTS RESERVED.</span>
          <span>
            <a
              href="https://www.instagram.com/obscura_sharda/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'underline' }}
            >
              @obscura_sharda
            </a>{' '}
            • SHUTTER: 1/8000s • ISO 100 • RAW 14-BIT • KODAK 2383 EMULATION
          </span>
        </div>
      </div>
    </footer>
  );
}
