import React from 'react';
import { workshopsData, gearLockerItems } from '../../data/workshopsData';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function WorkshopsSection() {
  const { playDialTick } = useViewfinder();

  return (
    <section className="workshops-section section-spacing" id="masterclass">
      <div className="container">
        <div className="section-header center">
          <span className="section-tag"><span className="pulse-dot"></span> ACADEMY &amp; MASTERCLASSES</span>
          <h2 className="section-title">Workshops &amp; <span className="accent-gradient">Gear Locker</span></h2>
          <p className="section-subtitle">
            Hands-on technical masterclasses taught by Obscura directors and cinematographers. Access cinema lenses, gimbals, and lighting rigs.
          </p>
        </div>

        {/* Masterclass Cards Grid */}
        <div className="workshops-grid">
          {workshopsData.map((ws) => (
            <div key={ws.id} className="workshop-card" onClick={playDialTick}>
              <span className="workshop-tag">{ws.tag}</span>
              <h3 className="workshop-title">{ws.title}</h3>
              <p className="workshop-desc">{ws.description}</p>
              <div className="workshop-meta-row">
                <span className="ws-level">🎯 {ws.level}</span>
                <span className="ws-instructor">👤 {ws.instructor}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Gear Locker Preview Strip */}
        <div className="gear-locker-strip">
          <div className="gear-locker-header">
            <span className="locker-tag">CLUB INVENTORY</span>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Available Cine Gear in Vault</h4>
          </div>
          <div className="gear-chips-grid">
            {gearLockerItems.map((g, i) => (
              <div key={i} className="gear-chip">
                <span className="gear-name">🎥 {g.name}</span>
                <span className="gear-qty">{g.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
