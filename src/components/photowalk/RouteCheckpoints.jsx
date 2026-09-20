import React, { useState } from 'react';
import { useViewfinder } from '../../context/ViewfinderContext';

export function RouteCheckpoints({ steps }) {
  const [activeStep, setActiveStep] = useState(1);
  const { playDialTick } = useViewfinder();

  const handleStepClick = (id) => {
    setActiveStep(id);
    playDialTick();
  };

  return (
    <div className="route-preview-container">
      <div className="route-header">
        <h4>Interactive Expedition Route</h4>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
          CLICK WAYPOINT
        </span>
      </div>
      <div className="route-steps-list">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`route-step-item ${activeStep === step.id ? 'active' : ''}`}
            onClick={() => handleStepClick(step.id)}
            style={{ cursor: 'pointer' }}
          >
            <span className="step-name">{step.name}</span>
            <span className="route-step-time">{step.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GearChecklist({ items }) {
  const [checkedItems, setCheckedItems] = useState(() => {
    const state = {};
    items.forEach((item) => {
      state[item.id] = item.checked;
    });
    return state;
  });
  const { playDialTick } = useViewfinder();

  const handleToggle = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
    playDialTick();
  };

  return (
    <div className="gear-checklist-box">
      <div className="gear-checklist-title">RECOMMENDED GEAR CHECKLIST</div>
      <div className="gear-tags">
        {items.map((item) => (
          <label key={item.id} className="gear-tag" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={!!checkedItems[item.id]}
              onChange={() => handleToggle(item.id)}
            />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );
}
