/* ==========================================================================
   OBSCURA - VIEWFINDER HUD & WEBAUDIO SENSORY SYNTHESIZER
   Realistic mechanical shutter clicks, lens dial ticks, and focus beeps.
   ========================================================================== */

class ViewfinderSystem {
  constructor() {
    this.hudLayer = document.getElementById('viewfinderHudLayer');
    this.toggleBtn = document.getElementById('hudToggleBtn');
    this.flashOverlay = document.getElementById('shutterFlash');
    this.audioCtx = null;
    this.soundEnabled = true;
    this.isActive = false;

    this.init();
  }

  init() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleViewfinder());
    }

    // Keyboard shortcut 'V' to toggle viewfinder HUD
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key.toLowerCase() === 'v') {
        this.toggleViewfinder();
      }
    });
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleViewfinder() {
    this.isActive = !this.isActive;
    if (this.hudLayer) {
      this.hudLayer.classList.toggle('active', this.isActive);
    }
    if (this.toggleBtn) {
      this.toggleBtn.classList.toggle('active', this.isActive);
      const textSpan = this.toggleBtn.querySelector('.btn-text');
      if (textSpan) {
        textSpan.textContent = this.isActive ? 'HUD: ON' : 'HUD: OFF';
      }
    }
    this.playShutterClick();
    if (window.appToast) {
      window.appToast(this.isActive ? '⚡ Viewfinder HUD Live (Press V to Toggle)' : 'Viewfinder HUD Closed');
    }
  }

  // 1. Realistic Camera Shutter Click Synthesizer
  playShutterClick() {
    if (!this.soundEnabled) return;
    try {
      this.ensureAudioContext();
      const now = this.audioCtx.currentTime;

      // Shutter curtain opening noise burst
      const bufferSize = this.audioCtx.sampleRate * 0.04;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3, now);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);
      noise.start(now);

      // Mirror return mechanical thud
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.setValueAtTime(0.45, now + 0.06);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(oscGain);
      oscGain.connect(this.audioCtx.destination);
      osc.start(now + 0.06);
      osc.stop(now + 0.15);

      this.triggerFlash();
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // 2. Lens Dial Mechanical Click Synthesizer (for knobs & sliders)
  playDialTick() {
    if (!this.soundEnabled) return;
    try {
      this.ensureAudioContext();
      const now = this.audioCtx.currentTime;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.02);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch (e) {
      // ignore
    }
  }

  // 3. Camera Flash animation trigger
  triggerFlash() {
    if (!this.flashOverlay) return;
    this.flashOverlay.classList.remove('trigger-flash');
    void this.flashOverlay.offsetWidth;
    this.flashOverlay.classList.add('trigger-flash');
  }
}

window.viewfinder = new ViewfinderSystem();
