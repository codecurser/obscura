import React, { useEffect } from 'react';
import { useViewfinder } from '../../context/ViewfinderContext';

export function ShutterFlash() {
  const { flashActive } = useViewfinder();
  return (
    <div
      className={`shutter-flash-overlay ${flashActive ? 'flash' : ''}`}
      aria-hidden="true"
    />
  );
}

export function Toast() {
  const { toastMessage, closeToast } = useViewfinder();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      closeToast();
    }, 2800);
    return () => clearTimeout(timer);
  }, [toastMessage, closeToast]);

  if (!toastMessage) return null;

  return (
    <div className="obscura-toast visible" role="status">
      <span className="toast-dot"></span>
      <span>{toastMessage}</span>
    </div>
  );
}
