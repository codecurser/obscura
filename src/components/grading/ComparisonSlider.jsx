import React, { useState, useRef, useCallback } from 'react';

export default function ComparisonSlider({ activeLutFilter }) {
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;
    setSliderPos(pos);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      className="comparison-wrapper"
      id="gradingComparisonWrapper"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      {/* Graded Master Image (Underneath) */}
      <div className="comparison-img-box comparison-img-after">
        <img
          src="/assets/images/slider_graded.webp"
          alt="Graded Cinematic Master"
          loading="lazy"
          decoding="async"
          style={{ filter: activeLutFilter }}
        />
      </div>

      {/* RAW Flat Log Image (Clipped overlay) */}
      <div
        className="comparison-img-box comparison-img-before"
        id="comparisonBeforeBox"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src="/assets/images/slider_raw.webp"
          alt="Uncompressed RAW Log Sensor Output"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Slider Drag Handle */}
      <div
        className="comparison-slider-handle"
        id="comparisonSliderHandle"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={() => setIsDragging(true)}
      >
        <div className="handle-center-circle">↔</div>
      </div>

      {/* Labels */}
      <div className="comparison-label label-raw">◀ RAW 12-BIT S-LOG3</div>
      <div className="comparison-label label-graded">35MM FILM GRADE MASTER ▶</div>
    </div>
  );
}
