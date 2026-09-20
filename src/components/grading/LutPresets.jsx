import React, { useEffect, useRef } from 'react';
import { useViewfinder } from '../../context/ViewfinderContext';

export const lutPresetsList = [
  { id: 'kodak', label: '🎞️ Kodak Portra 400', filter: 'contrast(1.15) saturate(1.2) sepia(0.12)' },
  { id: 'cinestill', label: '🌆 CineStill 800T', filter: 'contrast(1.3) saturate(1.35) hue-rotate(-15deg)' },
  { id: 'cyber', label: '⚡ Matrix Cyberpunk', filter: 'contrast(1.4) saturate(1.4) hue-rotate(85deg) brightness(0.95)' },
  { id: 'hollywood', label: '🎬 Teal & Orange Blockbuster', filter: 'contrast(1.25) saturate(1.3) sepia(0.2) hue-rotate(-20deg)' },
  { id: 'noir', label: '🖤 Tri-X 400 Noir', filter: 'grayscale(1) contrast(1.6) brightness(0.9)' },
  { id: 'bleach', label: '🛡️ Bleach Bypass', filter: 'contrast(1.7) saturate(0.55) brightness(1.05)' }
];

export function LutPresets({ activeLut, onSelectLut }) {
  const { playDialTick } = useViewfinder();

  const handleSelect = (lut) => {
    onSelectLut(lut);
    playDialTick();
  };

  return (
    <div className="lut-presets-bar">
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
        SELECT LUT EMULATION:
      </span>
      {lutPresetsList.map((lut) => (
        <button
          key={lut.id}
          className={`lut-preset-btn ${activeLut.id === lut.id ? 'active' : ''}`}
          onClick={() => handleSelect(lut)}
        >
          {lut.label}
        </button>
      ))}
    </div>
  );
}

export function WaveformOscilloscope({ controls }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let y = 20; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const time = Date.now() * 0.003;
      const exposureOffset = (controls.exposure - 0) * 15;
      const contrastMult = controls.contrast / 100;

      // RGB Waveform curves
      const channels = [
        { color: 'rgba(239, 68, 68, 0.75)', freq: 0.04, offset: 0 },
        { color: 'rgba(34, 197, 94, 0.75)', freq: 0.05, offset: 2 },
        { color: 'rgba(59, 130, 246, 0.75)', freq: 0.035, offset: 4 }
      ];

      channels.forEach((ch) => {
        ctx.beginPath();
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 1.8;
        for (let x = 0; x < canvas.width; x += 4) {
          const baseWave = Math.sin(x * ch.freq + time + ch.offset) * 22 * contrastMult;
          const detail = Math.sin(x * 0.12 - time) * 8;
          const y = (canvas.height / 2) + baseWave + detail - exposureOffset;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [controls]);

  return (
    <div className="oscilloscope-card">
      <div className="oscilloscope-header">
        <span className="scope-title">RGB PARADE OSCILLOSCOPE</span>
        <span className="scope-status">LIVE TELEMETRY</span>
      </div>
      <canvas ref={canvasRef} width="320" height="180" className="scope-canvas" />
      <div className="scope-footer-specs">
        <span>IRE: 0 - 100</span>
        <span>CH: R/G/B DUAL-BUS</span>
        <span>REC.709 MASTER</span>
      </div>
    </div>
  );
}
