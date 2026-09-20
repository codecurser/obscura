/* ==========================================================================
   OBSCURA - LUXURY VIP CREATOR PASS STUDIO (HTML5 CANVAS)
   Dark titanium card, official 'obs' logo mark, golden optical accents,
   authentic barcode, holographic security foil, and high-DPI PNG export.
   ========================================================================== */

class MemberPassGenerator {
  constructor() {
    this.canvas = document.getElementById('memberPassCanvas');
    this.nameInput = document.getElementById('passNameInput');
    this.roleSelect = document.getElementById('passRoleSelect');
    this.tierSelect = document.getElementById('passTierSelect');
    this.downloadBtn = document.getElementById('downloadPassBtn');
    this.regenerateBtn = document.getElementById('regenerateIdBtn');
    this.themeSwatches = document.querySelectorAll('.theme-swatch');
    
    this.memberId = 'OBS-' + Math.floor(10000 + Math.random() * 90000);
    this.activeTheme = 'gold'; // gold, cyan, purple, orange, emerald

    // Logo image instance
    this.logoImg = new Image();
    this.logoImg.src = 'assets/images/obscura_hero_transparent.png';
    this.logoImg.onload = () => this.drawPass();

    this.init();
  }

  init() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // High-DPI canvas dimensions
    this.canvas.width = 680;
    this.canvas.height = 400;

    // Listen to inputs
    if (this.nameInput) {
      this.nameInput.addEventListener('input', () => this.drawPass());
    }
    if (this.roleSelect) {
      this.roleSelect.addEventListener('change', () => this.drawPass());
    }
    if (this.tierSelect) {
      this.tierSelect.addEventListener('change', () => this.drawPass());
    }
    if (this.regenerateBtn) {
      this.regenerateBtn.addEventListener('click', () => {
        this.memberId = 'OBS-' + Math.floor(10000 + Math.random() * 90000);
        this.drawPass();
        if (window.viewfinder) window.viewfinder.playShutterClick();
      });
    }

    // Theme swatches
    this.themeSwatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        this.themeSwatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this.activeTheme = swatch.getAttribute('data-color') || 'gold';
        this.drawPass();
        if (window.viewfinder) window.viewfinder.playDialTick();
      });
    });

    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', () => this.downloadPass());
    }

    setTimeout(() => this.drawPass(), 150);
  }

  getThemeColors() {
    switch (this.activeTheme) {
      case 'cyan':
        return { accent: '#38bdf8', glow: 'rgba(56, 189, 248, 0.3)', border: '#38bdf8' };
      case 'purple':
        return { accent: '#c084fc', glow: 'rgba(192, 132, 252, 0.3)', border: '#c084fc' };
      case 'orange':
        return { accent: '#fb923c', glow: 'rgba(251, 146, 60, 0.3)', border: '#fb923c' };
      case 'emerald':
        return { accent: '#34d399', glow: 'rgba(52, 211, 153, 0.3)', border: '#34d399' };
      case 'gold':
      default:
        return { accent: '#fbbf24', glow: 'rgba(251, 191, 36, 0.3)', border: '#f59e0b' };
    }
  }

  drawPass() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    const name = (this.nameInput && this.nameInput.value.trim()) || 'ALEX RIVERA';
    const role = (this.roleSelect && this.roleSelect.value) || 'DIRECTOR OF PHOTOGRAPHY';
    const tier = (this.tierSelect && this.tierSelect.value) || 'PRO CREATOR';

    const colors = this.getThemeColors();

    // 1. Clear background
    ctx.clearRect(0, 0, w, h);

    // 2. Base Dark Titanium Card
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1c1c26');
    grad.addColorStop(0.5, '#13131a');
    grad.addColorStop(1, '#0c0c10');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 20);
    ctx.fill();

    // 3. Subtle Outer Glow & Border
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = colors.border;
    ctx.stroke();

    // 4. Header Top Stripe
    ctx.fillStyle = '#171722';
    ctx.beginPath();
    ctx.roundRect(16, 16, w - 32, 72, 12);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    // Draw official logo in pure white
    if (this.logoImg && this.logoImg.complete && this.logoImg.naturalWidth > 0) {
      ctx.save();
      ctx.filter = 'brightness(0) invert(1)';
      ctx.drawImage(this.logoImg, 32, 28, 92, 46);
      ctx.restore();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px Syne, sans-serif';
      ctx.fillText('OBSCURA', 34, 56);
    }

    ctx.fillStyle = colors.accent;
    ctx.font = '800 11px Space Mono, monospace';
    ctx.fillText('OFFICIAL CREATOR ACCESS PASS', 135, 54);

    // VIP Foil Stamp
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(w - 146, 26, 114, 50, 8);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colors.accent;
    ctx.stroke();

    ctx.fillStyle = colors.accent;
    ctx.font = '900 12px Space Mono, monospace';
    ctx.fillText('★ VERIFIED', w - 134, 48);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 11px Space Mono, monospace';
    ctx.fillText('SEASON 2026', w - 138, 66);

    // 5. Name Plate
    ctx.fillStyle = '#171722';
    ctx.beginPath();
    ctx.roundRect(16, 102, w - 32, 92, 12);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '800 11px Space Mono, monospace';
    ctx.fillText('AUTHENTICATED ARTIST / CREATOR', 34, 130);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 30px Outfit, sans-serif';
    ctx.fillText(name.toUpperCase(), 34, 168);

    // 6. Specialty & Tier
    ctx.fillStyle = '#94a3b8';
    ctx.font = '800 11px Space Mono, monospace';
    ctx.fillText('DISCIPLINE & TIER:', 26, 222);

    // Role Tag
    ctx.fillStyle = '#1a1a26';
    ctx.beginPath();
    ctx.roundRect(26, 234, 340, 38, 8);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colors.accent;
    ctx.stroke();

    ctx.fillStyle = colors.accent;
    const roleFontSize = role.length > 22 ? 10.5 : (role.length > 17 ? 11.5 : 13);
    ctx.font = `900 ${roleFontSize}px Outfit, sans-serif`;
    ctx.fillText(role.toUpperCase(), 38, 258);

    // Tier Tag
    ctx.fillStyle = '#1a1a26';
    ctx.beginPath();
    ctx.roundRect(380, 234, 180, 38, 8);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 12px Space Mono, monospace';
    ctx.fillText(tier.toUpperCase(), 394, 258);

    // 7. Bottom Barcode Slate
    ctx.fillStyle = '#171722';
    ctx.beginPath();
    ctx.roundRect(16, 290, w - 32, 92, 12);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    ctx.fillStyle = colors.accent;
    ctx.font = '900 15px Space Mono, monospace';
    ctx.fillText('ID: ' + this.memberId, 34, 326);

    ctx.fillStyle = '#64748b';
    ctx.font = '700 10px Space Mono, monospace';
    ctx.fillText('CRYPTO-OPTICAL SHUTTER ID • OBSCURA COLLECTIVE', 34, 354);

    // Barcode in white/accent
    const barcodeX = w - 210;
    const barcodeY = 305;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const barW = (i % 3 === 0 || i % 7 === 0) ? 3.6 : 1.8;
      const barH = 58;
      ctx.fillRect(barcodeX + i * 4.6, barcodeY, barW, barH);
    }
  }

  downloadPass() {
    if (!this.canvas) return;
    const link = document.createElement('a');
    const name = (this.nameInput && this.nameInput.value.trim().replace(/\s+/g, '-')) || 'MEMBER';
    link.download = `OBSCURA-VIP-PASS-${name}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
    if (window.viewfinder) window.viewfinder.playShutterClick();
    if (window.appToast) {
      window.appToast('🎉 OBSCURA VIP Creator Pass Exported (PNG)!');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.memberPassGenerator = new MemberPassGenerator();
});
