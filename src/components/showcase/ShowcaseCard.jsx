import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useViewfinder } from '../../context/ViewfinderContext';

const STACK_OFFSETS = [
  { x: -18, y: -22, rot: -10, scale: 0.94 },
  { x: 24, y: 16, rot: 9, scale: 0.95 },
  { x: -28, y: 22, rot: -12, scale: 0.93 },
  { x: 20, y: -16, rot: 11, scale: 0.96 },
  { x: -10, y: 8, rot: -6, scale: 0.98 },
  { x: 30, y: -24, rot: 14, scale: 0.91 },
  { x: -22, y: -12, rot: -8, scale: 0.94 },
  { x: 16, y: 28, rot: 8, scale: 0.92 },
  { x: -18, y: 16, rot: -11, scale: 0.95 },
  { x: 26, y: -14, rot: 13, scale: 0.93 },
  { x: -14, y: -26, rot: -7, scale: 0.96 },
  { x: 22, y: 20, rot: 10, scale: 0.94 },
  { x: -16, y: -6, rot: -13, scale: 0.97 },
  { x: 14, y: -18, rot: 7, scale: 0.97 },
  { x: -20, y: 12, rot: -9, scale: 0.95 },
  { x: 0, y: 0, rot: 0, scale: 1.0 }
];

export default function ShowcaseCard({
  photo,
  list,
  index = 0,
  layoutMode = 'collage', // 'merged' | 'collage' | 'grid'
  isSpotlighted = false,
  onStackClick = null
}) {
  const { openLightbox, photoLikes, likePhoto } = useModal();
  const { playDialTick, playShutter } = useViewfinder();
  const [isHeartPopping, setIsHeartPopping] = useState(false);

  const isMerged = layoutMode === 'merged';
  const isCollageView = layoutMode === 'collage';

  const handleClick = (e) => {
    if (isMerged && onStackClick) {
      onStackClick();
      return;
    }
    playShutter();
    openLightbox(photo, list);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    playDialTick();
    likePhoto(photo.id);
    setIsHeartPopping(true);
    setTimeout(() => setIsHeartPopping(false), 400);
  };

  const likes = photoLikes[photo.id] !== undefined ? photoLikes[photo.id] : photo.likes;

  // Collage Spanning
  let collageSpanClass = '';
  if (isCollageView) {
    if (index === 0 || index === 7 || index === 11) {
      collageSpanClass = 'span-2-col';
    } else if (index === 2 || index === 9) {
      collageSpanClass = 'span-2-row';
    } else if (index === 4) {
      collageSpanClass = 'span-large';
    }
  }

  // Assign staggered organic float class when in collage mode
  const floatClass = isCollageView ? `float-live-${(index % 3) + 1}` : '';
  const aspectClass = photo.aspect === 'landscape' ? 'landscape' : (photo.aspect === 'square' ? 'square' : '');

  // Stacked transform
  const stackOffset = STACK_OFFSETS[index % STACK_OFFSETS.length];

  const mergedStyle = isMerged
    ? {
        transform: `translate(${stackOffset.x}px, ${stackOffset.y}px) rotate(${stackOffset.rot}deg) scale(${stackOffset.scale})`,
        zIndex: index + 1
      }
    : {
        animationDelay: `${Math.min(index * 45, 600)}ms`
      };

  return (
    <div
      className={`showcase-item ${isMerged ? 'merged-stacked' : 'collage-animated-enter'} ${aspectClass} ${collageSpanClass} ${floatClass} ${isSpotlighted ? 'spotlight-active-card' : ''}`}
      onClick={handleClick}
      style={mergedStyle}
      title={isMerged ? 'Click to explode & distort photos into collage' : 'Click to inspect raw EXIF'}
    >
      {/* Physical Photomount Washi-Tape Accent */}
      {isCollageView && <div className="card-tape-accent"></div>}

      <img
        src={photo.imgSrc}
        alt={photo.title}
        className="showcase-img"
        loading="lazy"
        decoding="async"
      />
      
      <div className="showcase-overlay"></div>
      <div className="laser-scanner-line"></div>

      {/* Live Spotlight Badge */}
      {isSpotlighted && !isMerged && (
        <div className="spotlight-live-pill">
          <span className="pulse-dot"></span> LIVE SPOTLIGHT
        </div>
      )}

      {/* Reticle Focus Indicator on Hover */}
      <div className="showcase-reticle-hover">
        <span>[ ✛ ]</span>
        <span className="reticle-label">{isMerged ? 'CLICK TO EXPLODE' : `LOCKED • ${photo.shutter || '1/500s'}`}</span>
      </div>

      <div className="showcase-hud-top">
        <span className="showcase-genre-badge">{photo.genreBadge}</span>
        <span className="showcase-lens-badge">{photo.lensBadge}</span>
      </div>

      <div className="showcase-info-bottom">
        <h3 className="showcase-title">{photo.title}</h3>
        <div className="showcase-meta">
          <span className="showcase-optic-spec">
            {photo.camera} • {photo.opticSpec}
          </span>
          <button
            className={`showcase-likes ${isHeartPopping ? 'heart-pop-active' : ''}`}
            onClick={handleLike}
            title="Like this photograph"
            aria-label="Like"
          >
            ♥ {likes}
          </button>
        </div>
      </div>
    </div>
  );
}
