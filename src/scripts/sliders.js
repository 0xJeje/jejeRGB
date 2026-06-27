window.dragDistance = 0;
window.dragStartTime = 0;

import { pixelConstruct, pixelDeconstruct } from './pixel-transition.js';

export function initSliders() {
  // ----------------------------------------
  // A. Branding Slider (Smart Auto-Scroll)
  // ----------------------------------------
  const brandSection = document.getElementById('branding');
  const brandTrack = document.getElementById('brand-track');
  const btnNext = document.getElementById('brand-next');
  const btnPrev = document.getElementById('brand-prev');
  const counter = document.getElementById('brand-counter');
  const originalSlidesCount = brandTrack
    ? brandTrack.querySelectorAll('.slide-card').length
    : 0;

  let currentSlide = 0;
  let brandIsDown = false;
  let brandStartX, brandScrollLeft;
  let isBrandVisible = false;
  let brandAnimationId = null;
  let startBrandScrollRef = null;
  let startBauhausScrollRef = null;

  let brandTransitionLock = false;
  let brandSlideDirection = 1;

  async function playEnter(slide) {
    slide.classList.remove('leaving');
    slide.classList.add('active', 'entering');
    slide.dataset.slideDir = String(brandSlideDirection);
    await pixelConstruct(slide);
    slide.classList.remove('entering');
    delete slide.dataset.slideDir;
  }

  async function playLeave(slide) {
    slide.classList.remove('active');
    slide.classList.add('leaving');
    slide.dataset.slideDir = String(brandSlideDirection);
    await pixelDeconstruct(slide);
    slide.classList.remove('leaving');
    delete slide.dataset.slideDir;
  }

  async function updateSlider() {
    if (window.innerWidth >= 768 || !brandTrack || brandTransitionLock) return;

    brandTransitionLock = true;

    const slides = brandTrack.querySelectorAll('.slide-card');
    const outgoing = [];
    let incoming = null;

    for (let i = 0; i < originalSlidesCount; i++) {
      const slide = slides[i];
      if (!slide) continue;
      const shouldBeActive = i === currentSlide;
      if (slide.classList.contains('active') && !shouldBeActive) outgoing.push(slide);
      if (shouldBeActive) incoming = slide;
    }

    for (let i = originalSlidesCount; i < slides.length; i++) {
      slides[i].classList.remove('active', 'leaving', 'entering');
    }

    try {
      await Promise.all([
        ...outgoing.map((slide) => playLeave(slide)),
        incoming ? playEnter(incoming) : Promise.resolve(),
      ]);
    } finally {
      brandTransitionLock = false;
    }

    if (counter) counter.innerText = `${currentSlide + 1} / ${originalSlidesCount}`;
  }

  if (brandTrack) {
    let brandTouchStartX = 0;

    brandTrack.addEventListener(
      'touchstart',
      (e) => {
        if (window.innerWidth >= 768) return;
        brandTouchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );

    brandTrack.addEventListener('touchend', (e) => {
      if (window.innerWidth >= 768 || brandTransitionLock) return;
      const delta = brandTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) < 48) return;
      brandSlideDirection = delta > 0 ? 1 : -1;
      if (delta > 0) {
        currentSlide = (currentSlide + 1) % originalSlidesCount;
      } else {
        currentSlide = (currentSlide - 1 + originalSlidesCount) % originalSlidesCount;
      }
      updateSlider();
    });
  }

  if (btnNext && btnPrev) {
    btnNext.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        brandSlideDirection = 1;
        currentSlide = (currentSlide + 1) % originalSlidesCount;
        updateSlider();
      }
    });
    btnPrev.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        brandSlideDirection = -1;
        currentSlide = (currentSlide - 1 + originalSlidesCount) % originalSlidesCount;
        updateSlider();
      }
    });
  }

  if (brandSection && brandTrack) {
    brandTrack.addEventListener('dragstart', (e) => e.preventDefault());
    brandTrack.innerHTML = brandTrack.innerHTML + brandTrack.innerHTML;

    const autoScrollBrand = () => {
      if (
        window.innerWidth >= 768 &&
        isBrandVisible &&
        !brandIsDown &&
        !window.isLowPowerMode
      ) {
        brandTrack.scrollLeft += 0.8;
        if (brandTrack.scrollLeft >= brandTrack.scrollWidth / 2) brandTrack.scrollLeft = 0;
        brandAnimationId = requestAnimationFrame(autoScrollBrand);
      } else {
        brandAnimationId = null;
      }
    };

    const startBrandScroll = () => {
      if (!brandAnimationId) autoScrollBrand();
    };
    startBrandScrollRef = startBrandScroll;

    const brandObserver = new IntersectionObserver((entries) => {
      isBrandVisible = entries[0].isIntersecting;
      if (isBrandVisible) startBrandScroll();
    });
    brandObserver.observe(brandSection);

    brandSection.addEventListener('mousedown', (e) => {
      if (window.innerWidth < 768) return;
      brandIsDown = true;
      window.dragDistance = 0;
      window.dragStartTime = Date.now();
      brandStartX = e.pageX - brandSection.offsetLeft;
      brandScrollLeft = brandTrack.scrollLeft;
    });

    brandSection.addEventListener('mousemove', (e) => {
      if (!brandIsDown) return;
      e.preventDefault();
      const move = e.pageX - brandSection.offsetLeft - brandStartX;
      window.dragDistance = Math.abs(move);
      brandTrack.scrollLeft = brandScrollLeft - move;
    });

    brandSection.addEventListener('mouseup', () => {
      brandIsDown = false;
      startBrandScroll();
    });

    brandSection.addEventListener('mouseleave', () => {
      brandIsDown = false;
      startBrandScroll();
    });
  }

  let brandLastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth !== brandLastWidth) {
      brandLastWidth = window.innerWidth;
      updateSlider();
    }
  });

  // ----------------------------------------
  // B. Bauhaus Grid (Smart Auto-Scroll)
  // ----------------------------------------
  const bauhausSection = document.getElementById('graphic-design');
  const bauhausSlider = document.getElementById('bauhaus-scroll');
  const bauhausGrid = document.querySelector('.bauhaus-grid');

  let isBauhausDown = false;
  let bauhausStartX, bauhausScrollLeft;
  let isBauhausVisible = false;
  let bauhausAnimationId = null;

  if (bauhausSection && bauhausSlider && bauhausGrid) {
    bauhausSlider.addEventListener('dragstart', (e) => e.preventDefault());
    bauhausGrid.innerHTML = bauhausGrid.innerHTML + bauhausGrid.innerHTML;

    const autoScrollBauhaus = () => {
      if (!isBauhausDown && isBauhausVisible && !window.isLowPowerMode) {
        bauhausSlider.scrollLeft += 1;
        if (bauhausSlider.scrollLeft >= bauhausGrid.scrollWidth / 2)
          bauhausSlider.scrollLeft = 0;
        bauhausAnimationId = requestAnimationFrame(autoScrollBauhaus);
      } else {
        bauhausAnimationId = null;
      }
    };

    const startBauhausScroll = () => {
      if (!bauhausAnimationId) autoScrollBauhaus();
    };
    startBauhausScrollRef = startBauhausScroll;

    const bauhausObserver = new IntersectionObserver((entries) => {
      isBauhausVisible = entries[0].isIntersecting;
      if (isBauhausVisible) startBauhausScroll();
    });
    bauhausObserver.observe(bauhausSection);

    bauhausSection.addEventListener('mousedown', (e) => {
      isBauhausDown = true;
      window.dragDistance = 0;
      window.dragStartTime = Date.now();
      bauhausStartX = e.pageX - bauhausSection.offsetLeft;
      bauhausScrollLeft = bauhausSlider.scrollLeft;
    });

    bauhausSection.addEventListener('mousemove', (e) => {
      if (!isBauhausDown) return;
      e.preventDefault();
      const move = e.pageX - bauhausSection.offsetLeft - bauhausStartX;
      window.dragDistance = Math.abs(move);
      bauhausSlider.scrollLeft = bauhausScrollLeft - move;
    });

    bauhausSection.addEventListener('mouseup', () => {
      isBauhausDown = false;
      startBauhausScroll();
    });

    bauhausSection.addEventListener('mouseleave', () => {
      isBauhausDown = false;
      startBauhausScroll();
    });

    bauhausSection.addEventListener(
      'touchstart',
      (e) => {
        isBauhausDown = true;
        window.dragDistance = 0;
        window.dragStartTime = Date.now();
        bauhausStartX = e.touches[0].pageX;
      },
      { passive: true }
    );

    bauhausSection.addEventListener(
      'touchmove',
      (e) => {
        if (!isBauhausDown) return;
        const move = e.touches[0].pageX - bauhausStartX;
        window.dragDistance = Math.abs(move);
      },
      { passive: true }
    );

    bauhausSection.addEventListener('touchend', () => {
      isBauhausDown = false;
      startBauhausScroll();
    });
  }

  window.addEventListener('powerModeChanged', (e) => {
    if (!e.detail.isLowPower) {
      if (isBrandVisible && startBrandScrollRef) startBrandScrollRef();
      if (isBauhausVisible && startBauhausScrollRef) startBauhausScrollRef();
    }
  });

  // ----------------------------------------
  // C. Mobile Reels Stack Logic
  // ----------------------------------------
  const reelsGrid = document.getElementById('reels-grid');
  const reelCards = document.querySelectorAll('.reel-card');
  const reelPrev = document.getElementById('reel-prev');
  const reelNext = document.getElementById('reel-next');

  if (reelsGrid && reelCards.length > 0) {
    let currentReelIndex = 0;

    const updateReelStack = () => {
      if (window.innerWidth >= 768) {
        reelCards.forEach((card) => {
          card.className = 'reel-card';
          card.style.zIndex = '';
        });
        return;
      }

      reelCards.forEach((card, index) => {
        card.classList.remove('stack-active', 'stack-prev', 'stack-next');
        if (index === currentReelIndex) card.classList.add('stack-active');
        else if (index === (currentReelIndex - 1 + reelCards.length) % reelCards.length)
          card.classList.add('stack-prev');
        else if (index === (currentReelIndex + 1) % reelCards.length)
          card.classList.add('stack-next');
      });
    };

    updateReelStack();

    if (reelNext && reelPrev) {
      reelNext.addEventListener('click', () => {
        currentReelIndex = (currentReelIndex + 1) % reelCards.length;
        updateReelStack();
      });
      reelPrev.addEventListener('click', () => {
        currentReelIndex = (currentReelIndex - 1 + reelCards.length) % reelCards.length;
        updateReelStack();
      });
    }
    let touchStartX = 0;
    reelsGrid.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    reelsGrid.addEventListener('touchend', (e) => {
      let touchEndX = e.changedTouches[0].clientX;
      if (touchStartX - touchEndX > 50) {
        currentReelIndex = (currentReelIndex + 1) % reelCards.length;
        updateReelStack();
      } else if (touchEndX - touchStartX > 50) {
        currentReelIndex = (currentReelIndex - 1 + reelCards.length) % reelCards.length;
        updateReelStack();
      }
    });

    let reelsLastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth !== reelsLastWidth) {
        reelsLastWidth = window.innerWidth;
        updateReelStack();
      }
    });
  }
}
