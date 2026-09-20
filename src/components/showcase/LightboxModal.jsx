import React, { useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { useViewfinder } from '../../context/ViewfinderContext';

export default function LightboxModal() {
  const { lightboxOpen, activePhoto, closeLightbox, nextLightbox, prevLightbox, photoLikes, likePhoto } = useModal();
  const { playShutterClick, showToast, playDialTick } = useViewfinder();

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextLightbox, prevLightbox]);

  if (!lightboxOpen || !activePhoto) return null;

  const currentLikes = photoLikes[activePhoto.id] !== undefined ? photoLikes[activePhoto.id] : activePhoto.likes;

  const handleLike = () => {
    likePhoto(activePhoto.id);
    playShutterClick();
    showToast(`❤️ Liked "${activePhoto.title}"!`);
  };

  return (
    <div
      className="lightbox-modal active"
      id="lightboxModal"
      role="dialog"
      aria-modal="true"
      aria-label="Photo Lightbox"
      onClick={(e) => {
        if (e.target.classList.contains('lightbox-modal')) closeLightbox();
      }}
    >
      <button className="lightbox-close-btn" id="lightboxCloseBtn" onClick={closeLightbox} aria-label="Close Lightbox">
        ✕
      </button>
      <button
        className="lightbox-nav-btn lightbox-nav-prev"
        id="lightboxPrevBtn"
        onClick={() => {
          playDialTick();
          prevLightbox();
        }}
        aria-label="Previous Photo"
      >
        ❮
      </button>
      <button
        className="lightbox-nav-btn lightbox-nav-next"
        id="lightboxNextBtn"
        onClick={() => {
          playDialTick();
          nextLightbox();
        }}
        aria-label="Next Photo"
      >
        ❯
      </button>

      <div className="lightbox-container">
        <div className="lightbox-media-area">
          <img src={activePhoto.imgSrc} alt={activePhoto.title} className="lightbox-main-img" id="lightboxMainImg" />
        </div>

        {/* EXIF HUD Telemetry Panel */}
        <div className="lightbox-exif-panel">
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: '800', color: 'var(--accent-gold)', marginBottom: '6px' }}>
              EXIF METADATA TELEMETRY
            </div>
            <h3 className="exif-title" id="lightboxTitle">{activePhoto.title}</h3>
            <p id="lightboxCategory" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: '700' }}>
              EXHIBITION ARCHIVE • {activePhoto.genre.toUpperCase()}
            </p>

            <div className="exif-grid">
              <div className="exif-box">
                <span className="exif-tag">CAMERA BODY</span>
                <div className="exif-val" id="exifCamera">{activePhoto.camera}</div>
              </div>
              <div className="exif-box">
                <span className="exif-tag">LENS ATTACHED</span>
                <div className="exif-val" id="exifLens">{activePhoto.lens}</div>
              </div>
              <div className="exif-box">
                <span className="exif-tag">SHUTTER SPEED</span>
                <div className="exif-val" id="exifShutter">{activePhoto.shutter}</div>
              </div>
              <div className="exif-box">
                <span className="exif-tag">APERTURE</span>
                <div className="exif-val" id="exifAperture">{activePhoto.aperture}</div>
              </div>
              <div className="exif-box">
                <span className="exif-tag">ISO SENSITIVITY</span>
                <div className="exif-val" id="exifIso">{activePhoto.iso}</div>
              </div>
              <div className="exif-box">
                <span className="exif-tag">FOCAL LENGTH</span>
                <div className="exif-val" id="exifFocal">{activePhoto.focal}</div>
              </div>
              <div className="exif-box">
                <span className="exif-tag">COLOR PROFILE</span>
                <div className="exif-val" id="exifProfile">{activePhoto.profile}</div>
              </div>
              <div className="exif-box">
                <span className="exif-tag">LOCATION</span>
                <div className="exif-val" id="exifLocation">{activePhoto.location}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <button className="btn btn-secondary btn-sm" id="lightboxLikeBtn" onClick={handleLike} style={{ width: '100%' }}>
              ♥ Like Exposure ({currentLikes})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
