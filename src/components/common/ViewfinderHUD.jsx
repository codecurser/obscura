import React from 'react';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function ViewfinderHUD() {
  const { hudActive } = useViewfinder();

  return (
    <div
      className={`viewfinder-hud-layer ${hudActive ? 'active' : ''}`}
      aria-hidden="true"
    >
      <div className="vf-grid-lines">
        <div className="vf-grid-cell"></div>
        <div className="vf-grid-cell"></div>
        <div className="vf-grid-cell"></div>
        <div className="vf-grid-cell"></div>
        <div className="vf-grid-cell"></div>
        <div className="vf-grid-cell"></div>
        <div className="vf-grid-cell"></div>
        <div className="vf-grid-cell"></div>
        <div className="vf-grid-cell"></div>
      </div>
      <div className="vf-crosshair"></div>
      <div className="vf-telemetry-top">
        <span>● REC [ 4K DCI • 24.00 FPS ]</span>
        <span>ISO 400 • 1/50s • f/1.4 • 5600K</span>
        <span>BAT 98% [ 14.4V ]</span>
      </div>
      <div className="vf-telemetry-bottom">
        <span>AF-C [ EYE TRACKING ACTIVE ]</span>
        <span>LUT: KODAK 2383 PRINT</span>
        <span>AUDIO: -12dB CH1 / CH2</span>
      </div>
    </div>
  );
}
