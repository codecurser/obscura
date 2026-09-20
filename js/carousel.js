/* ==========================================================================
   OBSCURA - MOTION REEL CAROUSEL
   Interactive carousel with touch/mouse drag, pagination & Reel player modal.
   ========================================================================== */

class ReelCarousel {
  constructor() {
    this.track = document.getElementById('reelCarouselTrack');
    this.prevBtn = document.getElementById('carouselPrevBtn');
    this.nextBtn = document.getElementById('carouselNextBtn');
    this.dotsContainer = document.getElementById('carouselPagination');
    this.cards = document.querySelectorAll('.reel-card');
    
    // Reel Preview Modal elements
    this.modal = document.getElementById('reelModal');
    this.modalTitle = document.getElementById('reelModalTitle');
    this.modalGenre = document.getElementById('reelModalGenre');
    this.modalDesc = document.getElementById('reelModalDesc');
    this.modalFormat = document.getElementById('reelModalFormat');
    this.modalImg = document.getElementById('reelModalImg');
    this.modalClose = document.getElementById('reelModalClose');

    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.autoPlayInterval = null;

    this.init();
  }

  init() {
    if (!this.track || this.cards.length === 0) return;

    // Create pagination dots
    this.createDots();

    // Event listeners for prev/next
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.scrollByIndex(this.currentIndex - 1);
        if (window.viewfinder) window.viewfinder.playShutterClick();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.scrollByIndex(this.currentIndex + 1);
        if (window.viewfinder) window.viewfinder.playShutterClick();
      });
    }

    // Drag-to-scroll functionality
    this.track.addEventListener('mousedown', (e) => this.startDrag(e));
    this.track.addEventListener('mouseleave', () => this.stopDrag());
    this.track.addEventListener('mouseup', () => this.stopDrag());
    this.track.addEventListener('mousemove', (e) => this.doDrag(e));

    // Scroll listener for dot sync
    this.track.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // Reel click to open preview modal
    this.cards.forEach((card) => {
      card.addEventListener('click', () => {
        const title = card.getAttribute('data-title');
        const genre = card.getAttribute('data-genre');
        const format = card.getAttribute('data-format') || 'MASTER CINEMA REEL';
        const desc = card.getAttribute('data-desc');
        const imgEl = card.querySelector('.reel-card-img');
        const imgSrc = imgEl ? (imgEl.currentSrc || imgEl.src) : '';
        this.openReelModal({ title, genre, format, desc, imgSrc });
      });
    });

    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeReelModal());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeReelModal();
      });
    }

    // Start subtle autoplay timer
    this.startAutoPlay();
    this.track.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.track.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    this.cards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.scrollByIndex(idx));
      this.dotsContainer.appendChild(dot);
    });
  }

  updateDots() {
    if (!this.dotsContainer) return;
    const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentIndex);
    });
  }

  scrollByIndex(index) {
    if (index < 0) index = this.cards.length - 1;
    if (index >= this.cards.length) index = 0;
    
    this.currentIndex = index;
    const targetCard = this.cards[this.currentIndex];
    if (targetCard) {
      const scrollPos = targetCard.offsetLeft - (this.track.clientWidth - targetCard.clientWidth) / 2;
      this.track.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
    this.updateDots();
  }

  handleScroll() {
    const trackCenter = this.track.scrollLeft + this.track.clientWidth / 2;
    let closestIdx = 0;
    let minDiff = Infinity;

    this.cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const diff = Math.abs(trackCenter - cardCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (this.currentIndex !== closestIdx) {
      this.currentIndex = closestIdx;
      this.updateDots();
    }
  }

  startDrag(e) {
    this.isDragging = true;
    this.startX = e.pageX - this.track.offsetLeft;
    this.scrollLeft = this.track.scrollLeft;
  }

  stopDrag() {
    this.isDragging = false;
  }

  doDrag(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    const x = e.pageX - this.track.offsetLeft;
    const walk = (x - this.startX) * 1.8;
    this.track.scrollLeft = this.scrollLeft - walk;
  }

  startAutoPlay() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
    this.autoPlayInterval = setInterval(() => {
      this.scrollByIndex(this.currentIndex + 1);
    }, 6000);
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
  }

  openReelModal(data) {
    if (!this.modal) return;
    if (this.modalTitle) this.modalTitle.textContent = data.title;
    if (this.modalGenre) this.modalGenre.textContent = data.genre;
    if (this.modalDesc) this.modalDesc.textContent = data.desc || 'Cinematic footage captured on 35mm sensor with anamorphic glass.';
    if (this.modalFormat) this.modalFormat.textContent = data.format || 'MASTER CINEMA REEL';
    if (this.modalImg) {
      this.modalImg.src = data.imgSrc;
      this.modalImg.decoding = 'async';
    }

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.viewfinder) window.viewfinder.playShutterClick();
  }

  closeReelModal() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   OBSCURA - TEAM & LEADERSHIP CAROUSEL
   Interactive carousel with touch/mouse drag, pagination dots, category filtering,
   and telemetry slide counter.
   ========================================================================== */

class TeamCarousel {
  constructor() {
    this.viewport = document.getElementById('teamCarouselViewport');
    this.track = document.getElementById('teamCarouselTrack');
    this.prevBtn = document.getElementById('teamPrevBtn');
    this.nextBtn = document.getElementById('teamNextBtn');
    this.counter = document.getElementById('teamSlideCounter');
    this.dotsContainer = document.getElementById('teamPaginationDots');
    this.filterPills = document.querySelectorAll('#teamFilterPills .filter-pill');
    this.cards = Array.from(document.querySelectorAll('#teamCarouselTrack .team-card'));

    this.currentIndex = 0;
    this.visibleCards = [...this.cards];
    this.isDragging = false;
    this.startX = 0;
    this.autoScrollInterval = null;
    this.autoScrollDelay = 3500; // 3.5s per slide

    this.init();
  }

  init() {
    if (!this.track || this.cards.length === 0) return;

    this.updateFilter('all');
    this.setupEventListeners();
    this.startAutoScroll();
  }

  setupEventListeners() {
    // Prev / Next Buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.goToIndex(this.currentIndex - 1);
        this.resetAutoScroll();
        if (window.viewfinder) window.viewfinder.playDialTick();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.goToIndex(this.currentIndex + 1);
        this.resetAutoScroll();
        if (window.viewfinder) window.viewfinder.playDialTick();
      });
    }

    // Filter pills
    this.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filter = pill.getAttribute('data-filter') || 'all';
        this.updateFilter(filter);
        this.resetAutoScroll();
        if (window.viewfinder) window.viewfinder.playShutterClick();
      });
    });

    // Drag & swipe navigation
    if (this.viewport) {
      // Pause on hover
      this.viewport.addEventListener('mouseenter', () => this.stopAutoScroll());
      this.viewport.addEventListener('mouseleave', () => this.startAutoScroll());

      this.viewport.addEventListener('mousedown', (e) => {
        this.stopAutoScroll();
        this.startDrag(e);
      });
      window.addEventListener('mouseup', () => {
        if (this.isDragging) {
          this.stopDrag();
          this.startAutoScroll();
        }
      });
      this.viewport.addEventListener('mousemove', (e) => this.doDrag(e));

      // Touch events
      let touchStartX = 0;
      this.viewport.addEventListener('touchstart', (e) => {
        this.stopAutoScroll();
        touchStartX = e.touches[0].clientX;
      }, { passive: true });

      this.viewport.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            this.goToIndex(this.currentIndex + 1);
          } else {
            this.goToIndex(this.currentIndex - 1);
          }
          if (window.viewfinder) window.viewfinder.playDialTick();
        }
        this.startAutoScroll();
      }, { passive: true });
    }

    window.addEventListener('resize', () => {
      this.createDots();
      this.updateTrackPosition();
    }, { passive: true });
  }

  startAutoScroll() {
    this.stopAutoScroll();
    if (this.visibleCards.length <= 1) return;
    this.autoScrollInterval = setInterval(() => {
      const maxIndex = this.getMaxIndex();
      const nextIndex = this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1;
      this.goToIndex(nextIndex);
    }, this.autoScrollDelay);
  }

  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  resetAutoScroll() {
    this.stopAutoScroll();
    this.startAutoScroll();
  }

  updateFilter(filter) {
    this.visibleCards = this.cards.filter(card => {
      const cat = card.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        return true;
      } else {
        card.classList.add('hidden');
        return false;
      }
    });

    this.currentIndex = 0;
    this.createDots();
    this.updateTrackPosition();
    this.updateCounter();
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    const maxIndex = this.getMaxIndex();
    const totalDots = maxIndex + 1;

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.className = `team-dot ${i === this.currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        this.goToIndex(i);
        this.resetAutoScroll();
        if (window.viewfinder) window.viewfinder.playDialTick();
      });
      this.dotsContainer.appendChild(dot);
    }
  }

  updateDots() {
    if (!this.dotsContainer) return;
    const dots = this.dotsContainer.querySelectorAll('.team-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentIndex);
    });
  }

  getCardsPerView() {
    const w = window.innerWidth;
    if (w <= 560) return 1;
    if (w <= 860) return 2;
    if (w <= 1200) return 3;
    return 4;
  }

  getMaxIndex() {
    const cardsPerView = this.getCardsPerView();
    const count = this.visibleCards.length;
    return Math.max(0, count - cardsPerView);
  }

  goToIndex(index) {
    const maxIndex = this.getMaxIndex();
    if (index < 0) index = maxIndex;
    if (index > maxIndex) index = 0;

    this.currentIndex = index;
    this.updateTrackPosition();
    this.updateCounter();
    this.updateDots();
  }

  updateTrackPosition() {
    if (!this.track || this.visibleCards.length === 0) return;
    const firstVisible = this.visibleCards[this.currentIndex];
    if (!firstVisible) {
      this.track.style.transform = 'translateX(0px)';
      return;
    }

    const offset = firstVisible.offsetLeft - this.visibleCards[0].offsetLeft;
    this.track.style.transform = `translateX(-${offset}px)`;
  }

  updateCounter() {
    if (!this.counter) return;
    const currentNum = String(this.currentIndex + 1).padStart(2, '0');
    const totalNum = String(this.visibleCards.length).padStart(2, '0');
    this.counter.textContent = `${currentNum} / ${totalNum}`;
  }

  startDrag(e) {
    this.isDragging = true;
    this.startX = e.pageX;
  }

  stopDrag() {
    this.isDragging = false;
  }

  doDrag(e) {
    if (!this.isDragging) return;
    const diff = this.startX - e.pageX;
    if (Math.abs(diff) > 60) {
      this.isDragging = false;
      if (diff > 0) {
        this.goToIndex(this.currentIndex + 1);
      } else {
        this.goToIndex(this.currentIndex - 1);
      }
      this.resetAutoScroll();
      if (window.viewfinder) window.viewfinder.playDialTick();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.reelCarousel = new ReelCarousel();
  window.teamCarousel = new TeamCarousel();
});


