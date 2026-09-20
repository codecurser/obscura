/* ==========================================================================
   OBSCURA - SHOWCASE GALLERY & PRO EXIF LIGHTBOX INSPECTOR
   Fast-loading WebP rendering, EXIF optical telemetry & lightbox modal.
   ========================================================================== */

class ShowcaseGallery {
  constructor() {
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.items = document.querySelectorAll('.showcase-item');
    
    // Lightbox elements
    this.modal = document.getElementById('lightboxModal');
    this.closeBtn = document.getElementById('lightboxCloseBtn');
    this.prevBtn = document.getElementById('lightboxPrevBtn');
    this.nextBtn = document.getElementById('lightboxNextBtn');
    
    this.imgEl = document.getElementById('lightboxMainImg');
    this.titleEl = document.getElementById('lightboxTitle');
    this.categoryEl = document.getElementById('lightboxCategory');
    this.cameraEl = document.getElementById('exifCamera');
    this.lensEl = document.getElementById('exifLens');
    this.shutterEl = document.getElementById('exifShutter');
    this.apertureEl = document.getElementById('exifAperture');
    this.isoEl = document.getElementById('exifIso');
    this.focalEl = document.getElementById('exifFocal');
    this.profileEl = document.getElementById('exifProfile');
    this.locationEl = document.getElementById('exifLocation');
    this.likeBtn = document.getElementById('lightboxLikeBtn');
    this.likeCountEl = document.getElementById('lightboxLikeCount');

    this.currentItems = Array.from(this.items);
    this.currentIndex = 0;

    this.init();
  }

  init() {
    // Filter click handlers
    this.filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterGallery(filter);
        if (window.viewfinder) window.viewfinder.playDialTick();
      });
    });

    // Item click -> open lightbox
    this.items.forEach((item) => {
      item.addEventListener('click', () => {
        const visibleItems = Array.from(this.items).filter(el => el.style.display !== 'none');
        this.currentItems = visibleItems.length > 0 ? visibleItems : Array.from(this.items);
        this.currentIndex = this.currentItems.indexOf(item);
        if (this.currentIndex === -1) this.currentIndex = 0;
        this.openLightbox(this.currentItems[this.currentIndex]);
      });
    });

    // Lightbox controls
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeLightbox());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.navigate(-1));
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.navigate(1));
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeLightbox();
      });
    }

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      if (!this.modal || !this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.navigate(-1);
      if (e.key === 'ArrowRight') this.navigate(1);
    });

    // Lightbox Like button
    if (this.likeBtn) {
      this.likeBtn.addEventListener('click', () => {
        const count = parseInt(this.likeCountEl.textContent || '0', 10);
        this.likeCountEl.textContent = count + 1;
        this.likeBtn.style.color = '#ff5c8a';
        if (window.viewfinder) window.viewfinder.playShutterClick();
        if (window.appToast) window.appToast('❤️ Exposure Liked!');
      });
    }
  }

  filterGallery(filter) {
    this.items.forEach((item) => {
      const genre = item.getAttribute('data-genre');
      if (filter === 'all' || genre === filter) {
        item.style.display = '';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.97)';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 30);
      } else {
        item.style.display = 'none';
      }
    });
  }

  openLightbox(item) {
    if (!item || !this.modal) return;
    
    const imgTag = item.querySelector('.showcase-img');
    const imgSrc = imgTag ? imgTag.currentSrc || imgTag.src : '';
    const title = item.getAttribute('data-title') || 'Curated Exposure';
    const genre = item.getAttribute('data-genre') || 'Exhibition Frame';
    const camera = item.getAttribute('data-camera') || 'Sony Alpha 7 IV';
    const lens = item.getAttribute('data-lens') || 'FE 85mm f/1.4 GM';
    const shutter = item.getAttribute('data-shutter') || '1/500s';
    const aperture = item.getAttribute('data-aperture') || 'f/1.4';
    const iso = item.getAttribute('data-iso') || 'ISO 100';
    const focal = item.getAttribute('data-focal') || '85mm';
    const profile = item.getAttribute('data-profile') || 'S-Cinetone';
    const location = item.getAttribute('data-location') || 'Studio Atelier';
    const likes = item.getAttribute('data-likes') || '142';

    if (this.imgEl) {
      this.imgEl.src = imgSrc;
      this.imgEl.decoding = 'async';
    }
    if (this.titleEl) this.titleEl.textContent = title;
    if (this.categoryEl) {
      this.categoryEl.textContent = `EXHIBITION ARCHIVE • ${genre.toUpperCase()}`;
    }
    if (this.cameraEl) this.cameraEl.textContent = camera;
    if (this.lensEl) this.lensEl.textContent = lens;
    if (this.shutterEl) this.shutterEl.textContent = shutter;
    if (this.apertureEl) this.apertureEl.textContent = aperture;
    if (this.isoEl) this.isoEl.textContent = iso;
    if (this.focalEl) this.focalEl.textContent = focal;
    if (this.profileEl) this.profileEl.textContent = profile;
    if (this.locationEl) this.locationEl.textContent = location;
    if (this.likeCountEl) this.likeCountEl.textContent = likes;

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.viewfinder) window.viewfinder.playShutterClick();

    // Preload next and previous images for instant navigation
    this.preloadAdjacent();
  }

  preloadAdjacent() {
    if (this.currentItems.length <= 1) return;
    const nextIdx = (this.currentIndex + 1) % this.currentItems.length;
    const prevIdx = (this.currentIndex - 1 + this.currentItems.length) % this.currentItems.length;
    
    [nextIdx, prevIdx].forEach(idx => {
      const el = this.currentItems[idx];
      if (el) {
        const img = el.querySelector('.showcase-img');
        if (img && img.src) {
          const pre = new Image();
          pre.src = img.src;
        }
      }
    });
  }

  closeLightbox() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  navigate(dir) {
    if (this.currentItems.length === 0) return;
    this.currentIndex = (this.currentIndex + dir + this.currentItems.length) % this.currentItems.length;
    this.openLightbox(this.currentItems[this.currentIndex]);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.showcaseGallery = new ShowcaseGallery();
});
