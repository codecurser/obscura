/* ==========================================================================
   OBSCURA - CORE APP CONTROLLER & SENSORY ENGINE
   Theme switcher, custom focus cursor, optical simulator, and audio feedback.
   ========================================================================== */

// Global Toast Notification Helper
window.appToast = function(message) {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3800);
};

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const cameraCursor = document.getElementById('cameraCursor');

  // 1. Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Mobile Menu Toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      if (window.viewfinder) window.viewfinder.playDialTick();
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 3. Darkroom / Daylight Theme Switcher
  const savedTheme = localStorage.getItem('obscura-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('obscura-theme', newTheme);
      updateThemeIcon(newTheme);
      if (window.viewfinder) window.viewfinder.playDialTick();
      window.appToast(newTheme === 'dark' ? '🌙 Darkroom Mode Activated' : '☀️ Daylight Canvas Activated');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML = theme === 'dark'
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }

  // 4. Custom Camera Focus Cursor Physics
  if (cameraCursor) {
    window.addEventListener('mousemove', (e) => {
      cameraCursor.style.left = `${e.clientX}px`;
      cameraCursor.style.top = `${e.clientY}px`;
    });

    const interactiveElements = document.querySelectorAll('button, a, input, select, .showcase-item, .reel-card, .route-step-item');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cameraCursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cameraCursor.classList.remove('hovering'));
    });
  }

  // 5. Sound Effects Toggle
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (window.viewfinder) {
        window.viewfinder.soundEnabled = !window.viewfinder.soundEnabled;
        const isMuted = !window.viewfinder.soundEnabled;
        soundToggleBtn.innerHTML = isMuted
          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`
          : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
        window.appToast(isMuted ? 'Audio Shutter Muted' : 'Audio Shutter Enabled');
      }
    });
  }

  // 6. Interactive Optical Simulator in Hero
  const simAperture = document.getElementById('simAperture');
  const simShutter = document.getElementById('simShutter');
  const simIso = document.getElementById('simIso');
  const valAperture = document.getElementById('valAperture');
  const valShutter = document.getElementById('valShutter');
  const valIso = document.getElementById('valIso');
  const captureBtn = document.getElementById('simCaptureBtn');
  const heroBgImg = document.querySelector('.hero-bg-img');

  const shutterSpeeds = ['1/8000s', '1/4000s', '1/2000s', '1/1000s', '1/500s', '1/250s', '1/125s', '1/60s', '1/30s', '1/15s', '1/4s', '1s'];
  const apertures = ['f/1.2', 'f/1.4', 'f/1.8', 'f/2.8', 'f/4.0', 'f/5.6', 'f/8.0', 'f/11', 'f/16'];
  const isoValues = ['ISO 50', 'ISO 100', 'ISO 200', 'ISO 400', 'ISO 800', 'ISO 1600', 'ISO 3200', 'ISO 6400', 'ISO 12800', 'ISO 25600'];

  function updateOpticalSim() {
    if (!simAperture || !simShutter || !simIso || !heroBgImg) return;
    
    const apIdx = parseInt(simAperture.value, 10);
    const shIdx = parseInt(simShutter.value, 10);
    const isoIdx = parseInt(simIso.value, 10);

    if (valAperture) valAperture.textContent = apertures[apIdx] || 'f/1.4';
    if (valShutter) valShutter.textContent = shutterSpeeds[shIdx] || '1/500s';
    if (valIso) valIso.textContent = isoValues[isoIdx] || 'ISO 400';

    // Simulate bokeh depth of field on hero background
    const blurAmount = Math.max(0, (8 - apIdx) * 1.5);
    const brightness = 0.9 + (isoIdx * 0.04) - (apIdx * 0.03);
    heroBgImg.style.filter = `blur(${blurAmount}px) saturate(1.25) brightness(${brightness})`;
  }

  if (simAperture) {
    simAperture.addEventListener('input', () => {
      updateOpticalSim();
      if (window.viewfinder) window.viewfinder.playDialTick();
    });
  }

  if (simShutter) {
    simShutter.addEventListener('input', () => {
      updateOpticalSim();
      if (window.viewfinder) window.viewfinder.playDialTick();
    });
  }

  if (simIso) {
    simIso.addEventListener('input', () => {
      updateOpticalSim();
      if (window.viewfinder) window.viewfinder.playDialTick();
    });
  }

  let capturedCount = 0;
  if (captureBtn) {
    captureBtn.addEventListener('click', () => {
      capturedCount++;
      if (window.viewfinder) window.viewfinder.playShutterClick();
      const ap = valAperture ? valAperture.textContent : 'f/1.4';
      const sh = valShutter ? valShutter.textContent : '1/500s';
      const iso = valIso ? valIso.textContent : 'ISO 400';
      window.appToast(`📸 Shot #${capturedCount} Logged: ${ap} • ${sh} • ${iso}`);
    });
  }

  // 7. Newsletter Form Handle
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      if (window.viewfinder) window.viewfinder.playShutterClick();
      window.appToast(`📩 You're locked in! Photowalk dispatches dispatched to ${email}`);
      newsletterForm.reset();
    });
  }
});


