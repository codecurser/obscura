import React, { useEffect, useState } from 'react';

export default function CameraCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a, button, input, select, textarea, .showcase-item, .team-card, .lut-preset-btn, .clickable')
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div
      className={`camera-cursor ${hovering ? 'hovering' : ''}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`
      }}
      aria-hidden="true"
    >
      <div className="cursor-bracket-tl"></div>
      <div className="cursor-bracket-tr"></div>
      <div className="cursor-bracket-bl"></div>
      <div className="cursor-bracket-br"></div>
      <div className="cursor-dot-center"></div>
    </div>
  );
}
