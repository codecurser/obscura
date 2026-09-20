import React from 'react';
import { useModal } from '../../context/ModalContext';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function ShowcaseCard({ photo, list }) {
  const { openLightbox, photoLikes } = useModal();
  const { playDialTick } = useViewfinder();

  const handleClick = () => {
    playDialTick();
    openLightbox(photo, list);
  };

  const likes = photoLikes[photo.id] !== undefined ? photoLikes[photo.id] : photo.likes;

  return (
    <div
      className={`showcase-item ${photo.aspect === 'landscape' ? 'landscape' : (photo.aspect === 'square' ? 'square' : '')}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={photo.imgSrc}
        alt={photo.title}
        className="showcase-img"
        loading="lazy"
        decoding="async"
      />
      <div className="showcase-overlay"></div>
      <div className="showcase-hud-top">
        <span className="showcase-genre-badge">{photo.genreBadge}</span>
        <span className="showcase-lens-badge">{photo.lensBadge}</span>
      </div>
      <div className="showcase-info-bottom">
        <h3 className="showcase-title">{photo.title}</h3>
        <div className="showcase-meta">
          <span className="showcase-optic-spec">{photo.opticSpec}</span>
          <span className="showcase-likes">♥ {likes}</span>
        </div>
      </div>
    </div>
  );
}
