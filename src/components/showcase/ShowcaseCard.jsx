import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function ShowcaseCard({
  photo,
  list,
  index = 0,
  isCollageView = true,
  isSpotlighted = false
}) {
  const { openLightbox, photoLikes, likePhoto } = useModal();
  const { playDialTick, playShutter } = useViewfinder();
  const [isHeartPopping, setIsHeartPopping] = useState(false);

  const handleClick = () => {
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

  // Assign staggered organic float class
  const floatClass = isCollageView ? `float-live-${(index % 3) + 1}` : '';
  const aspectClass = photo.aspect === 'landscape' ? 'landscape' : (photo.aspect === 'square' ? 'square' : '');

  return (
    <div
      className={`showcase-item collage-animated-enter ${aspectClass} ${collageSpanClass} ${floatClass} ${isSpotlighted ? 'spotlight-active-card' : ''}`}
      onClick={handleClick}
      style={{
        animationDelay: `${Math.min(index * 50, 600)}ms`
      }}
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
      {isSpotlighted && (
        <div className="spotlight-live-pill">
          <span className="pulse-dot"></span> LIVE SPOTLIGHT
        </div>
      )}

      {/* Reticle Focus Indicator on Hover */}
      <div className="showcase-reticle-hover">
        <span>[ ✛ ]</span>
        <span className="reticle-label">LOCKED • {photo.shutter || '1/500s'}</span>
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
