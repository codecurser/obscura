/* ==========================================================================
   OBSCURA - PHOTOWALK ANNOUNCEMENT & RSVP MODULE
   ========================================================================== */

class PhotowalkSystem {
  constructor() {
    this.daysEl = document.getElementById('pwDays');
    this.hoursEl = document.getElementById('pwHours');
    this.minsEl = document.getElementById('pwMins');
    this.secsEl = document.getElementById('pwSecs');

    this.rsvpBtn = document.getElementById('openRsvpModalBtn');
    this.rsvpModal = document.getElementById('rsvpModal');
    this.rsvpCloseBtn = document.getElementById('rsvpModalClose');
    this.rsvpForm = document.getElementById('photowalkRsvpForm');

    this.routeSteps = document.querySelectorAll('.route-step-item');

    // Target date set to upcoming September 26 at 10:00 AM
    const now = new Date();
    let target = new Date(now.getFullYear(), 8, 26, 10, 0, 0); // Month 8 is September
    if (target.getTime() <= now.getTime()) {
      target = new Date(now.getFullYear() + 1, 8, 26, 10, 0, 0);
    }
    this.targetDate = target;

    this.init();
  }

  init() {
    this.startCountdown();

    // RSVP modal triggers
    if (this.rsvpBtn && this.rsvpModal) {
      this.rsvpBtn.addEventListener('click', () => this.openRsvpModal());
    }

    if (this.rsvpCloseBtn && this.rsvpModal) {
      this.rsvpCloseBtn.addEventListener('click', () => this.closeRsvpModal());
    }

    if (this.rsvpModal) {
      this.rsvpModal.addEventListener('click', (e) => {
        if (e.target === this.rsvpModal) this.closeRsvpModal();
      });
    }

    // RSVP Form Submit
    if (this.rsvpForm) {
      this.rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('rsvpName').value;
        const email = document.getElementById('rsvpEmail').value;
        const gear = document.getElementById('rsvpGear').value;

        this.closeRsvpModal();
        if (window.viewfinder) window.viewfinder.playShutterClick();
        if (window.appToast) {
          window.appToast(`🎉 Spot Confirmed! See you at 10:00 AM on September 26, ${name}!`);
        }
        this.rsvpForm.reset();
      });
    }

    // Route waypoint clicks
    this.routeSteps.forEach((step) => {
      step.addEventListener('click', () => {
        this.routeSteps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
        if (window.viewfinder) window.viewfinder.playShutterClick();
        const loc = step.querySelector('.step-name').textContent;
        if (window.appToast) {
          window.appToast(`Route Checkpoint: ${loc}`);
        }
      });
    });
  }

  startCountdown() {
    const update = () => {
      const now = new Date().getTime();
      const diff = this.targetDate.getTime() - now;

      if (diff <= 0) {
        if (this.daysEl) this.daysEl.textContent = '00';
        if (this.hoursEl) this.hoursEl.textContent = '00';
        if (this.minsEl) this.minsEl.textContent = '00';
        if (this.secsEl) this.secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (this.daysEl) this.daysEl.textContent = String(days).padStart(2, '0');
      if (this.hoursEl) this.hoursEl.textContent = String(hours).padStart(2, '0');
      if (this.minsEl) this.minsEl.textContent = String(mins).padStart(2, '0');
      if (this.secsEl) this.secsEl.textContent = String(secs).padStart(2, '0');
    };

    update();
    setInterval(update, 1000);
  }

  openRsvpModal() {
    if (!this.rsvpModal) return;
    this.rsvpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.viewfinder) window.viewfinder.playShutterClick();
  }

  closeRsvpModal() {
    if (!this.rsvpModal) return;
    this.rsvpModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.photowalkSystem = new PhotowalkSystem();
});
