export function initHeroTiles() {
  const canvas = document.getElementById('hero-tiles-canvas');
  const heroSection = document.getElementById('hero-slim');
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let tileSize = 48;
  let cols = 0;
  let rows = 0;
  let tiles = [];
  let animationId = 0;
  let isVisible = true;
  let isTouch = false;
  let isPointerActive = false;

  let targetX = 0;
  let targetY = 0;
  let smoothX = 0;
  let smoothY = 0;
  let scrollInfluence = 0;

  const POINTER_LERP = 0.14;
  const INFLUENCE_LERP = 0.18;

  function accentRgb() {
    const c =
      getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
      '#c5d92d';
    const hex = c.replace('#', '');
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
  }

  function surfaceRgb() {
    const c =
      getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() ||
      '#0a0a0a';
    const hex = c.replace('#', '');
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
  }

  function influenceRadius() {
    return width < 768 ? 110 : 150;
  }

  function heroCoords(clientX, clientY) {
    const rect = heroSection.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function getHeroFocusPoint() {
    const heroContent = heroSection.querySelector('.hero-content');
    if (heroContent && isTouch) {
      const sectionRect = heroSection.getBoundingClientRect();
      const contentRect = heroContent.getBoundingClientRect();
      return {
        x: contentRect.left + contentRect.width / 2 - sectionRect.left,
        y: contentRect.top + contentRect.height / 2 - sectionRect.top,
      };
    }
    return { x: width * 0.5, y: height * 0.5 };
  }

  function influenceStrength() {
    if (!isTouch) return 1;
    if (isPointerActive) return 1;
    return scrollInfluence;
  }

  function setPointer(clientX, clientY) {
    const coords = heroCoords(clientX, clientY);
    targetX = coords.x;
    targetY = coords.y;
    isPointerActive = true;
  }

  function updateScrollInfluence() {
    if (!isTouch || isPointerActive) return;
    const rect = heroSection.getBoundingClientRect();
    const visible = Math.min(rect.height, window.innerHeight);
    const traveled = Math.max(0, -rect.top);
    scrollInfluence = Math.min(1, traveled / visible);

    const focus = getHeroFocusPoint();
    targetX = focus.x;
    targetY = focus.y;
  }

  class Tile {
    constructor(col, row) {
      this.col = col;
      this.row = row;
      this.cx = col * tileSize + tileSize * 0.5;
      this.cy = row * tileSize + tileSize * 0.5;
      this.offsetX = 0;
      this.offsetY = 0;
      this.targetOffsetX = 0;
      this.targetOffsetY = 0;
      this.highlight = 0;
      this.targetHighlight = 0;
      this.rotation = 0;
      this.targetRotation = 0;
      this.variant = (col + row) % 3;
    }

    updateTargets(px, py, radius) {
      const dx = this.cx - px;
      const dy = this.cy - py;
      const dist = Math.hypot(dx, dy);

      if (dist < radius && dist > 0.001) {
        const t = 1 - dist / radius;
        const force = t * t;
        this.targetHighlight = force;
        const push = force * 14;
        this.targetOffsetX = (dx / dist) * push;
        this.targetOffsetY = (dy / dist) * push;
        this.targetRotation = force * 0.12 * (this.col % 2 === 0 ? 1 : -1);
      } else {
        this.targetHighlight = 0;
        this.targetOffsetX = 0;
        this.targetOffsetY = 0;
        this.targetRotation = 0;
      }
    }

    tick() {
      this.offsetX += (this.targetOffsetX - this.offsetX) * INFLUENCE_LERP;
      this.offsetY += (this.targetOffsetY - this.offsetY) * INFLUENCE_LERP;
      this.highlight += (this.targetHighlight - this.highlight) * INFLUENCE_LERP;
      this.rotation += (this.targetRotation - this.rotation) * INFLUENCE_LERP;
    }

    draw(context) {
      const { r, g, b } = accentRgb();
      const surf = surfaceRgb();
      const pad = 1.5;
      const size = tileSize - pad * 2;
      const scale = 1 + this.highlight * 0.1;
      const x = this.cx + this.offsetX;
      const y = this.cy + this.offsetY;

      context.save();
      context.translate(x, y);
      context.rotate(this.rotation);
      context.scale(scale, scale);

      context.fillStyle = `rgba(${surf.r}, ${surf.g}, ${surf.b}, ${0.55 + this.highlight * 0.35})`;
      context.fillRect(-size * 0.5, -size * 0.5, size, size);

      context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.08 + this.highlight * 0.85})`;
      context.lineWidth = 1 + this.highlight * 1.2;
      context.strokeRect(-size * 0.5, -size * 0.5, size, size);

      if (this.highlight > 0.15 && this.variant === 0) {
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.highlight * 0.25})`;
        context.fillRect(-size * 0.15, -size * 0.15, size * 0.3, size * 0.3);
      }

      if (this.highlight > 0.3 && this.variant === 1) {
        context.beginPath();
        context.moveTo(-size * 0.2, 0);
        context.lineTo(size * 0.2, 0);
        context.moveTo(0, -size * 0.2);
        context.lineTo(0, size * 0.2);
        context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.highlight * 0.6})`;
        context.stroke();
      }

      context.restore();
    }
  }

  function buildGrid() {
    tileSize = Math.max(36, Math.min(52, Math.floor(width / 14)));
    cols = Math.ceil(width / tileSize) + 1;
    rows = Math.ceil(height / tileSize) + 1;
    tiles = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        tiles.push(new Tile(col, row));
      }
    }
  }

  function resize() {
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
    buildGrid();
    const focus = getHeroFocusPoint();
    targetX = smoothX = focus.x;
    targetY = smoothY = focus.y;
  }

  function animate() {
    if (!isVisible || window.isLowPowerMode) return;

    smoothX += (targetX - smoothX) * POINTER_LERP;
    smoothY += (targetY - smoothY) * POINTER_LERP;

    const strength = influenceStrength();
    const radius = influenceRadius() * strength;
    const px = smoothX;
    const py = smoothY;

    ctx.clearRect(0, 0, width, height);

    if (reducedMotion) {
      tiles.forEach((tile) => tile.draw(ctx));
      animationId = requestAnimationFrame(animate);
      return;
    }

    tiles.forEach((tile) => {
      if (radius > 1) {
        tile.updateTargets(px, py, radius);
      } else {
        tile.targetHighlight = 0;
        tile.targetOffsetX = 0;
        tile.targetOffsetY = 0;
        tile.targetRotation = 0;
      }
      tile.tick();
      tile.draw(ctx);
    });

    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener('powerModeChanged', (e) => {
    if (!e.detail.isLowPower && isVisible) animate();
  });

  heroSection.addEventListener(
    'mousemove',
    (e) => {
      isTouch = false;
      setPointer(e.clientX, e.clientY);
    },
    { passive: true }
  );

  heroSection.addEventListener(
    'mouseleave',
    () => {
      isPointerActive = false;
    },
    { passive: true }
  );

  // Mobile: flat at load; short tap reveals displacement; scroll fades it in behind hero copy.
  let heroTouchStart = null;

  heroSection.addEventListener(
    'touchstart',
    (e) => {
      if (!isTouch) return;
      const touch = e.touches[0];
      if (touch) {
        heroTouchStart = { x: touch.clientX, y: touch.clientY, time: Date.now() };
      }
    },
    { passive: true }
  );

  heroSection.addEventListener(
    'touchend',
    (e) => {
      if (!isTouch || !heroTouchStart) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - heroTouchStart.x;
      const dy = touch.clientY - heroTouchStart.y;
      const isTap =
        Math.hypot(dx, dy) < 10 && Date.now() - heroTouchStart.time < 400;

      if (isTap) {
        setPointer(touch.clientX, touch.clientY);
        setTimeout(() => {
          isPointerActive = false;
          updateScrollInfluence();
        }, 200);
      } else {
        isPointerActive = false;
        updateScrollInfluence();
      }
      heroTouchStart = null;
    },
    { passive: true }
  );

  window.addEventListener(
    'scroll',
    () => {
      updateScrollInfluence();
    },
    { passive: true }
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !window.isLowPowerMode) {
          animate();
        } else {
          cancelAnimationFrame(animationId);
        }
      });
    },
    { threshold: 0 }
  );

  observer.observe(heroSection);

  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) {
      lastWidth = window.innerWidth;
      resize();
    }
  });

  isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  resize();
  if (isTouch) {
    scrollInfluence = 0;
    isPointerActive = false;
  }
  updateScrollInfluence();
  animate();
}
