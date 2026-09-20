import React, { useState } from 'react';
import ComparisonSlider from './ComparisonSlider';
import { LutPresets, WaveformOscilloscope, lutPresetsList } from './LutPresets';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function ColorGradingLab() {
  const [activeLut, setActiveLut] = useState(lutPresetsList[0]);
  const [controls, setControls] = useState({
    exposure: 0,
    contrast: 100,
    highlights: 0,
    shadows: 0,
    temp: 5600,
    tint: 0
  });

  const { playDialTick } = useViewfinder();

  const handleSliderChange = (field, val) => {
    setControls((prev) => ({
      ...prev,
      [field]: parseFloat(val)
    }));
    playDialTick();
  };

  // Combine LUT filter with colorist slider transforms
  const dynamicFilter = `${activeLut.filter} brightness(${1 + controls.exposure * 0.15}) contrast(${controls.contrast}%)`;

  return (
    <section className="grading-section section-spacing" id="grading">
      <div className="container">
        <div className="section-header center">
          <span className="section-tag"><span className="pulse-dot"></span> POST-PRODUCTION MASTERY</span>
          <h2 className="section-title">DaVinci <span className="accent-gradient">Color Grading Lab</span></h2>
          <p className="section-subtitle">
            Drag the interactive slider to compare flat 12-bit RAW sensor output against the finalized 35mm Hollywood film grade. Toggle LUT presets and monitor RGB waveform telemetry live.
          </p>
        </div>

        <div className="grading-studio-card">
          {/* Interactive Split Comparison Slider */}
          <ComparisonSlider activeLutFilter={dynamicFilter} />

          {/* 6 Interactive LUT Presets */}
          <LutPresets activeLut={activeLut} onSelectLut={setActiveLut} />

          {/* Colorist Sliders & Real-Time Waveform Oscilloscope */}
          <div className="grading-controls-grid">
            <div className="grading-sliders-box">
              <div className="sim-slider-row">
                <div className="sim-label-row">
                  <span>EXPOSURE COMP (EV)</span>
                  <span className="sim-val-display">{controls.exposure > 0 ? `+${controls.exposure}` : controls.exposure} EV</span>
                </div>
                <input
                  type="range"
                  className="sim-range-input"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={controls.exposure}
                  onChange={(e) => handleSliderChange('exposure', e.target.value)}
                />
              </div>

              <div className="sim-slider-row">
                <div className="sim-label-row">
                  <span>CONTRAST CURVE</span>
                  <span className="sim-val-display">{controls.contrast}%</span>
                </div>
                <input
                  type="range"
                  className="sim-range-input"
                  min="50"
                  max="150"
                  step="1"
                  value={controls.contrast}
                  onChange={(e) => handleSliderChange('contrast', e.target.value)}
                />
              </div>

              <div className="sim-slider-row">
                <div className="sim-label-row">
                  <span>COLOR TEMPERATURE</span>
                  <span className="sim-val-display">{controls.temp}K</span>
                </div>
                <input
                  type="range"
                  className="sim-range-input"
                  min="3200"
                  max="7500"
                  step="100"
                  value={controls.temp}
                  onChange={(e) => handleSliderChange('temp', e.target.value)}
                />
              </div>
            </div>

            {/* RGB Waveform Monitor */}
            <WaveformOscilloscope controls={controls} />
          </div>
        </div>
      </div>
    </section>
  );
}
