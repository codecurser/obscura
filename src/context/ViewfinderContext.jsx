import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ViewfinderContext = createContext();

export function ViewfinderProvider({ children }) {
  const [hudActive, setHudActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [flashActive, setFlashActive] = useState(false);
  const audioCtxRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playShutterClick = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Click pulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.04);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);

      // Metallic mirror slap
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(80, now + 0.03);
      osc2.frequency.exponentialRampToValueAtTime(20, now + 0.08);
      gain2.gain.setValueAtTime(0.25, now + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.03);
      osc2.stop(now + 0.1);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  };

  const playDialTick = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.02);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      console.warn('Dial audio error:', e);
    }
  };

  const triggerShutterFlash = () => {
    playShutterClick();
    setFlashActive(true);
    setTimeout(() => {
      setFlashActive(false);
    }, 280);
  };

  const toggleHud = () => {
    setHudActive(prev => {
      const next = !prev;
      playDialTick();
      showToast(next ? '📷 Viewfinder HUD Active (Press V)' : 'Viewfinder HUD Disabled');
      return next;
    });
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      showToast(next ? '🔊 Shutter Audio Enabled' : '🔇 Audio Shutter Muted');
      return next;
    });
  };

  // Keyboard shortcut 'V' to toggle HUD
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'v' || e.key === 'V') {
        toggleHud();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ViewfinderContext.Provider
      value={{
        hudActive,
        toggleHud,
        soundEnabled,
        toggleSound,
        playShutterClick,
        playDialTick,
        triggerShutterFlash,
        flashActive,
        toastMessage,
        showToast,
        closeToast
      }}
    >
      {children}
    </ViewfinderContext.Provider>
  );
}

export function useViewfinder() {
  return useContext(ViewfinderContext);
}
