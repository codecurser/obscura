import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function ShowcaseCard({ photo, list, index = 0, isCollageView = true }) {
  const { openLightbox, photoLikes, likePhoto } = useModal();
  const { playDialTick } = useViewfinder();
  const [isHeartPopping, setIsHeartPopping] = useState(false);

  const handleClick = () => {
    playDialTick();
    openLightbox(photo, list);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    likePhoto(photo.id);
    setIsHeartPopping(true);
    setTimeout(() => setIsHeartPopping(false), 400);
  };

  const likes = photoLikes[photo.id] !== undefined ? photoLikes[photo.id] : photo.likes;

  // Compute collage spanning logic
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

  const aspectClass = photo.aspect === 'landscape' ? 'landscape' : (photo.aspect === 'square' ? 'square' : '');

  return (
    <div
      className={`showcase-item collage-animated-enter ${aspectClass} ${collageSpanClass}`}
      onClick={handleClick}
      style={{
        animationDelay: `${Math.min(index * 45, 600)}ms`
      }}
    >
      <img
        src={photo.imgSrc}
        alt={photo.title}
        className="showcase-img"
        loading="lazy"
        decoding="async"
      />
      <div className="showcase-overlay"></div>
      <div className="laser-scanner-line"></div>
      
      {/* Reticle Focus Indicator on Hover */}
      <div className="showcase-reticle-hover">
        [ ✛ ]
      </div>

      <div className="showcase-hud-top">
        <span className="showcase-genre-badge">{photo.genreBadge}</span>
        <span className="showcase-lens-badge">{photo.lensBadge}</span>
      </div>

      <div className="showcase-info-bottom">
        <h3 className="showcase-title">{photo.title}</h3>
        <div className="showcase-meta">
          <span className="showcase-optic-spec">{photo.opticSpec}</span>
          <button
            className={`showcase-likes ${isHeartPopping ? 'heart-pop-active' : ''}`}
            onClick={handleLike}
            title="Like this photo"
            aria-label="Like"
          >
            ♥ {likes}
          </button>
        </div>
      </div>
    </div>
  );
}
