import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function PassGeneratorModal() {
  const { rsvpOpen, closeRsvp } = useModal();
  const { playShutterClick, showToast } = useViewfinder();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gear, setGear] = useState('');
  const [passGenerated, setPassGenerated] = useState(false);
  const [passId, setPassId] = useState('');

  if (!rsvpOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const generatedId = `OBS-PASS-${Math.floor(1000 + Math.random() * 9000)}`;
    setPassId(generatedId);
    setPassGenerated(true);
    playShutterClick();
    showToast(`✓ Creator Pass ${generatedId} Issued for ${name}!`);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setGear('');
    setPassGenerated(false);
    closeRsvp();
  };

  return (
    <div
      className="rsvp-modal active"
      id="rsvpModal"
      role="dialog"
      aria-modal="true"
      aria-label="RSVP Modal"
      onClick={(e) => {
        if (e.target.classList.contains('rsvp-modal')) closeRsvp();
      }}
    >
      <div className="rsvp-modal-card">
        <button
          className="lightbox-close-btn"
          id="rsvpModalClose"
          onClick={closeRsvp}
          style={{ top: '16px', right: '16px' }}
        >
          ✕
        </button>

        {!passGenerated ? (
          <>
            <span className="section-tag" style={{ marginBottom: '12px' }}>
              <span className="pulse-dot"></span> INSTANT PASS
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              RSVP For September Shutter Expedition
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Join fellow creators on Saturday, Sept 26 at 10:00 AM.
            </p>

            <form id="photowalkRsvpForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="rsvpName">Full Name</label>
                <input
                  type="text"
                  id="rsvpName"
                  className="form-input"
                  placeholder="e.g. Jordan Cole"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="rsvpEmail">Email Address</label>
                <input
                  type="email"
                  id="rsvpEmail"
                  className="form-input"
                  placeholder="jordan@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="rsvpGear">What camera gear will you bring?</label>
                <input
                  type="text"
                  id="rsvpGear"
                  className="form-input"
                  placeholder="e.g. Sony A7IV + 35mm f/1.4"
                  value={gear}
                  onChange={(e) => setGear(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                Confirm Spot &amp; Issue Pass
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <span className="section-tag" style={{ marginBottom: '16px', display: 'inline-flex' }}>
              ✓ ACCESS PASS CONFIRMED
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
              {passId}
            </h3>
            <p style={{ color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '20px' }}>
              EXPEDITION: SEPTEMBER 26 • 10:00 AM
            </p>

            <div
              style={{
                background: '#18181b',
                border: '2px solid var(--accent-gold)',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '24px'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>PASS HOLDER</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>{name}</div>
              
              <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>GEAR DECLARED</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e4e4e7', marginBottom: '12px' }}>{gear || 'Mirrorless Kit'}</div>

              <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>RENDEZVOUS</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e4e4e7' }}>Obscura Base • See you at 10</div>
            </div>

            <button className="btn btn-primary" onClick={handleReset} style={{ width: '100%' }}>
              Done &amp; Close Pass
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
