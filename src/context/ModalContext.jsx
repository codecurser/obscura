import React, { createContext, useContext, useState } from 'react';
import { showcasePhotos } from '../data/showcaseData';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [currentPhotos, setCurrentPhotos] = useState(showcasePhotos);
  const [photoLikes, setPhotoLikes] = useState(() => {
    const initial = {};
    showcasePhotos.forEach(p => {
      initial[p.id] = p.likes;
    });
    return initial;
  });
  const [rsvpOpen, setRsvpOpen] = useState(false);

  const openLightbox = (photo, list = showcasePhotos) => {
    setCurrentPhotos(list);
    const idx = list.findIndex(p => p.id === photo.id);
    setLightboxIndex(idx !== -1 ? idx : 0);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex === null || currentPhotos.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % currentPhotos.length);
  };

  const prevLightbox = () => {
    if (lightboxIndex === null || currentPhotos.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + currentPhotos.length) % currentPhotos.length);
  };

  const likePhoto = (id) => {
    setPhotoLikes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const openRsvp = () => setRsvpOpen(true);
  const closeRsvp = () => setRsvpOpen(false);

  const activePhoto = lightboxIndex !== null && currentPhotos[lightboxIndex] ? currentPhotos[lightboxIndex] : null;

  return (
    <ModalContext.Provider
      value={{
        lightboxOpen: lightboxIndex !== null,
        activePhoto,
        openLightbox,
        closeLightbox,
        nextLightbox,
        prevLightbox,
        photoLikes,
        likePhoto,
        rsvpOpen,
        openRsvp,
        closeRsvp
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
