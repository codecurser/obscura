/* ==========================================================================
   OBSCURA - DAVINCI COLOR GRADING LAB & COMPARISON SLIDER
   Interactive split slider, live LUT preset engine, and real-time scopes.
   ========================================================================== */

class GradingStudio {
  constructor() {
    this.container = document.getElementById('gradingComparisonWrapper');
    this.beforeBox = document.getElementById('comparisonBeforeBox');
    this.handle = document.getElementById('comparisonSliderHandle');
    this.gradedImg = document.querySelector('.comparison-img-after img');
    
    // LUT Preset buttons
    this.lutBtns = document.querySelectorAll('.lut-preset-btn');
    
    // Sliders
    this.contrastSlider = document.getElementById('gradeContrast');
    this.satSlider = document.getElementById('gradeSat');
    this.tempSlider = document.getElementById('gradeTemp');
    
    // Scope bars
    this.scopeBars = document.querySelectorAll('.scope-bar');

    this.isDragging = false;
    this.currentLut = 'kodak';

    this.init();
  }

  init() {
    if (!this.container || !this.beforeBox || !this.handle) return;

    // 1. Drag comparison handle
    const onStart = (e) => {
      this.isDragging = true;
      this.updatePosition(e);
      if (window.viewfinder) window.viewfinder.playDialTick();
    };

    const onMove = (e) => {
      if (!this.isDragging) return;
      this.updatePosition(e);
    };

    const onEnd = () => {
      this.isDragging = false;
    };

    this.container.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    this.container.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      this.updatePosition(e.touches[0]);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      this.updatePosition(e.touches[0]);
    }, { passive: true });

    window.addEventListener('touchend', onEnd);

    // 2. LUT Presets
    this.lutBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.lutBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentLut = btn.getAttribute('data-lut') || 'kodak';
        this.applyGrade();
        if (window.viewfinder) window.viewfinder.playDialTick();
        if (window.appToast) {
          window.appToast(`🎞️ LUT Loaded: ${btn.textContent.trim()}`);
        }
      });
    });

    // 3. Live grading sliders
    [this.contrastSlider, this.satSlider, this.tempSlider].forEach((slider) => {
      if (slider) {
        slider.addEventListener('input', () => {
          this.applyGrade();
          if (window.viewfinder) window.viewfinder.playDialTick();
        });
      }
    });

    // 4. Initial scopes animation loop
    this.animateScopes();
  }

  updatePosition(e) {
    const rect = this.container.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    let offsetX = clientX - rect.left;

    const minX = rect.width * 0.05;
    const maxX = rect.width * 0.95;
    offsetX = Math.max(minX, Math.min(maxX, offsetX));

    const percentage = (offsetX / rect.width) * 100;
    this.beforeBox.style.width = `${percentage}%`;
    this.handle.style.left = `${percentage}%`;
  }

  applyGrade() {
    if (!this.gradedImg) return;

    const contrast = this.contrastSlider ? parseFloat(this.contrastSlider.value) : 115;
    const sat = this.satSlider ? parseFloat(this.satSlider.value) : 130;
    const temp = this.tempSlider ? parseFloat(this.tempSlider.value) : 10;

    let sepia = 0;
    let hueRotate = 0;

    switch (this.currentLut) {
      case 'cinestill':
        hueRotate = -20;
        sepia = 10;
        break;
      case 'cyber':
        hueRotate = 40;
        break;
      case 'hollywood':
        hueRotate = -10;
        sepia = 15;
        break;
      case 'noir':
        // Monochrome B&W
        this.gradedImg.style.filter = `grayscale(100%) contrast(${contrast * 1.3}%) brightness(1.05)`;
        this.updateScopeTelemetry(30, 30, 30);
        return;
      case 'bleach':
        this.gradedImg.style.filter = `contrast(${contrast * 1.4}%) saturate(45%) brightness(0.95)`;
        this.updateScopeTelemetry(50, 40, 45);
        return;
      case 'kodak':
      default:
        sepia = 8;
        break;
    }

    const tempHue = temp > 0 ? `sepia(${temp * 0.6}%)` : `hue-rotate(${temp * 1.2}deg)`;

    this.gradedImg.style.filter = `
      contrast(${contrast}%)
      saturate(${sat}%)
      ${tempHue}
      hue-rotate(${hueRotate}deg)
      sepia(${sepia}%)
    `;

    this.updateScopeTelemetry(sat, contrast, temp);
  }

  updateScopeTelemetry(rFactor, gFactor, bFactor) {
    if (this.scopeBars.length === 0) return;
    this.scopeBars.forEach((bar, idx) => {
      const baseH = 20 + Math.random() * 50;
      let h = baseH;
      if (bar.classList.contains('r')) h = Math.min(75, Math.max(15, baseH * (rFactor / 100)));
      if (bar.classList.contains('g')) h = Math.min(75, Math.max(15, baseH * (gFactor / 100)));
      if (bar.classList.contains('b')) h = Math.min(75, Math.max(15, baseH * (1 + bFactor / 100)));
      bar.style.height = `${h}px`;
    });
  }

  animateScopes() {
    setInterval(() => {
      this.updateScopeTelemetry(120, 110, 100);
    }, 1800);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.gradingStudio = new GradingStudio();
});
