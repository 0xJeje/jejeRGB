export function initGeometry() {
  const canvas = document.getElementById('geometry-canvas');
  const heroSection = document.getElementById('hero-slim');
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height;
  let shapes = [];
  let blueprintShapes = [];
  let pulseRings = [];
  let animationFrameId;
  let isVisible = true;
  let isTouch = false;

  const deepCanvas = document.createElement('canvas');
  const deepCtx = deepCanvas.getContext('2d');
  const bufferCanvas = document.createElement('canvas');
  const bufferCtx = bufferCanvas.getContext('2d');

  let targetX = 0;
  let targetY = 0;
  let smoothX = 0;
  let smoothY = 0;
  let revealRadius = 0;
  let targetRevealRadius = 0;
  let isPointerActive = false;
  let glitchUntil = 0;
  let lastSmoothX = 0;
  let lastSmoothY = 0;
  let lastFrameTime = performance.now();

  function maxRevealRadius() {
    return width < 768 ? 150 : 240;
  }

  function strokeColor(opacity) {
    const c =
      getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() ||
      '#c5d92d';
    const hex = c.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  function bgColor(alpha = 1) {
    const c = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#000000';
    const hex = c.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function heroCoords(clientX, clientY) {
    const rect = heroSection.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function setPointer(clientX, clientY) {
    const coords = heroCoords(clientX, clientY);
    targetX = coords.x;
    targetY = coords.y;
    isPointerActive = true;
    targetRevealRadius = maxRevealRadius();
  }

  function triggerGlitch() {
    if (!reducedMotion) glitchUntil = performance.now() + 180;
  }

  window.addEventListener('powerModeChanged', (e) => {
    if (!e.detail.isLowPower && isVisible) {
      animate(performance.now());
    }
  });

  class Shape {
    constructor() {
      this.init();
    }

    init() {
      this.x = (Math.random() - 0.2) * (width * 1.4);
      this.y = (Math.random() - 0.2) * (height * 1.4);
      this.baseSize = Math.random() * 250 + 40;
      this.type = Math.floor(Math.random() * 4);
      this.sides = Math.floor(Math.random() * 5) + 3;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.002;
      this.opacity = Math.random() * 0.06 + 0.03;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      const buffer = this.baseSize * 1.5;
      if (this.x < -buffer) this.x = width + buffer;
      if (this.x > width + buffer) this.x = -buffer;
      if (this.y < -buffer) this.y = height + buffer;
      if (this.y > height + buffer) this.y = -buffer;
    }

    drawPath(context) {
      context.beginPath();
      if (this.type === 0) {
        context.moveTo(this.baseSize * 0.5, 0);
        for (let i = 1; i < 8; i++) {
          context.lineTo(
            Math.cos((i / 8) * Math.PI * 2) * this.baseSize * 0.5,
            Math.sin((i / 8) * Math.PI * 2) * this.baseSize * 0.5
          );
        }
        context.closePath();
      } else if (this.type === 1) {
        for (let i = 0; i < this.sides; i++) {
          const angle = (i / this.sides) * Math.PI * 2;
          const px = Math.cos(angle) * this.baseSize * 0.5;
          const py = Math.sin(angle) * this.baseSize * 0.5;
          if (i === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.closePath();
      } else if (this.type === 2) {
        context.arc(0, 0, this.baseSize * 0.5, 0, Math.PI * 2);
      } else {
        context.rect(-this.baseSize, -this.baseSize * 0.25, this.baseSize * 2, this.baseSize * 0.5);
      }
    }

    draw(context, opacityMult = 1, lineW = 1.5) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.rotation);
      context.strokeStyle = strokeColor(this.opacity * opacityMult);
      context.lineWidth = lineW;
      this.drawPath(context);
      context.stroke();
      context.restore();
    }
  }

  class BlueprintShape {
    constructor() {
      this.type = Math.floor(Math.random() * 4);
      this.size = Math.random() * 50 + 30;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = (Math.random() - 0.5) * 0.15;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.003;
      this.opacity = Math.random() * 0.2 + 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      const buffer = this.size * 2;
      if (this.x < -buffer) this.x = width + buffer;
      if (this.x > width + buffer) this.x = -buffer;
      if (this.y < -buffer) this.y = height + buffer;
      if (this.y > height + buffer) this.y = -buffer;
    }

    draw(context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.rotation);
      context.strokeStyle = strokeColor(this.opacity);
      context.lineWidth = 1.5;

      if (this.type === 0) {
        const s = this.size * 0.5;
        context.beginPath();
        context.moveTo(-s, 0);
        context.lineTo(s, 0);
        context.moveTo(0, -s);
        context.lineTo(0, s);
        context.stroke();
      } else if (this.type === 1) {
        const s = this.size * 0.4;
        const corners = [
          [-s, -s, s, -s, -s, 0],
          [s, -s, s, s, 0, -s],
          [s, s, -s, s, s, 0],
          [-s, s, -s, -s, 0, s],
        ];
        corners.forEach(([x1, y1, x2, y2, x3, y3]) => {
          context.beginPath();
          context.moveTo(x1, y1);
          context.lineTo(x2, y2);
          context.lineTo(x3, y3);
          context.stroke();
        });
      } else if (this.type === 2) {
        context.setLineDash([4, 4]);
        context.strokeRect(-this.size * 0.5, -this.size * 0.35, this.size, this.size * 0.7);
        context.setLineDash([]);
      } else {
        context.beginPath();
        context.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
        context.stroke();
        context.beginPath();
        context.moveTo(-this.size * 0.5, 0);
        context.lineTo(this.size * 0.5, 0);
        context.moveTo(0, -this.size * 0.5);
        context.lineTo(0, this.size * 0.5);
        context.stroke();
      }

      context.restore();
    }
  }

  class PulseRing {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.born = performance.now();
    }

    update(now) {
      const progress = (now - this.born) / 400;
      if (progress >= 1) return false;
      this.radius = 10 + progress * 120;
      this.opacity = 0.75 * (1 - progress);
      return true;
    }

    draw(context) {
      context.save();
      context.strokeStyle = strokeColor(this.opacity);
      context.lineWidth = 2;
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.stroke();
      context.restore();
    }
  }

  function drawScanlines(context, cx, cy, radius) {
    if (radius < 8) return;

    context.save();
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.clip();

    for (let y = 0; y < height; y += 4) {
      context.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    for (let x = 0; x < width; x += 3) {
      const channel = x % 9;
      const alpha = channel === 0 ? 0.04 : channel === 3 ? 0.015 : 0.035;
      context.fillStyle =
        channel === 0
          ? `rgba(255, 0, 0, ${alpha})`
          : channel === 3
            ? `rgba(0, 255, 0, ${alpha})`
            : `rgba(0, 0, 255, ${alpha})`;
      context.fillRect(x, 0, 1, height);
    }

    context.restore();
  }

  function drawPixelVeil() {
    const cell = 6;
    ctx.fillStyle = bgColor(0.35);
    for (let y = 0; y < height; y += cell) {
      for (let x = 0; x < width; x += cell) {
        if ((Math.floor(x / cell) + Math.floor(y / cell)) % 2 === 0) {
          ctx.fillRect(x, y, cell - 1, cell - 1);
        }
      }
    }
  }

  function drawRevealEdge(cx, cy, radius) {
    if (radius < 8) return;

    ctx.save();
    ctx.strokeStyle = strokeColor(0.35);
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.88, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    const fragments = 18;
    for (let i = 0; i < fragments; i++) {
      const angle = (i / fragments) * Math.PI * 2;
      const px = cx + Math.cos(angle) * radius * 0.92;
      const py = cy + Math.sin(angle) * radius * 0.92;
      const size = 2 + (i % 3);
      ctx.fillStyle = strokeColor(0.2 + (i % 4) * 0.08);
      ctx.fillRect(px - size * 0.5, py - size * 0.5, size, size);
    }

    ctx.restore();
  }

  function drawDeepReveal() {
    if (reducedMotion || revealRadius < 2) return;

    deepCtx.clearRect(0, 0, width, height);

    shapes.forEach((shape) => shape.draw(deepCtx, 14, 2.5));
    blueprintShapes.forEach((shape) => shape.draw(deepCtx));

    drawScanlines(deepCtx, smoothX, smoothY, revealRadius);

    deepCtx.globalCompositeOperation = 'destination-in';
    const grad = deepCtx.createRadialGradient(
      smoothX,
      smoothY,
      0,
      smoothX,
      smoothY,
      revealRadius
    );
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.72, 'rgba(255, 255, 255, 0.55)');
    grad.addColorStop(0.88, 'rgba(255, 255, 255, 0.08)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    deepCtx.fillStyle = grad;
    deepCtx.fillRect(0, 0, width, height);
    deepCtx.globalCompositeOperation = 'source-over';

    ctx.drawImage(deepCanvas, 0, 0);
    drawRevealEdge(smoothX, smoothY, revealRadius);
  }

  function applyGlitch() {
    bufferCtx.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const baseShift = (Math.random() - 0.5) * 6;
    ctx.drawImage(bufferCanvas, baseShift, 0);

    const sliceCount = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < sliceCount; i++) {
      const sy = Math.random() * height;
      const sh = Math.random() * 18 + 8;
      const dx = (Math.random() - 0.5) * 20;
      ctx.drawImage(bufferCanvas, 0, sy, width, sh, dx, sy, width, sh);
    }

    const glitchColors = [
      'rgba(197, 217, 45, 0.22)',
      'rgba(255, 0, 255, 0.18)',
      'rgba(0, 85, 255, 0.18)',
    ];
    glitchColors.forEach((color) => {
      const sy = Math.random() * height;
      ctx.fillStyle = color;
      ctx.fillRect(0, sy, width, 2 + Math.random() * 10);
    });
  }

  function resize() {
    width = canvas.width = heroSection.offsetWidth;
    height = canvas.height = heroSection.offsetHeight;
    deepCanvas.width = width;
    deepCanvas.height = height;
    bufferCanvas.width = width;
    bufferCanvas.height = height;
    targetX = smoothX = width * 0.5;
    targetY = smoothY = height * 0.5;
    lastSmoothX = smoothX;
    lastSmoothY = smoothY;
  }

  function initCanvas() {
    resize();
    shapes = [];
    blueprintShapes = [];
    pulseRings = [];
    for (let i = 0; i < 12; i++) shapes.push(new Shape());
    for (let i = 0; i < 10; i++) blueprintShapes.push(new BlueprintShape());
  }

  function animate(time) {
    if (!isVisible || window.isLowPowerMode) return;

    if (reducedMotion) {
      ctx.clearRect(0, 0, width, height);
      shapes.forEach((shape) => shape.draw(ctx, 1.2));
      animationFrameId = requestAnimationFrame(animate);
      return;
    }

    const dt = (time - lastFrameTime) / 1000;
    if (dt > 0 && dt < 0.1) {
      const vx = (smoothX - lastSmoothX) / dt;
      const vy = (smoothY - lastSmoothY) / dt;
      const speed = Math.hypot(vx, vy);
      const threshold = isTouch ? 400 : 800;
      if (speed > threshold) triggerGlitch();
    }

    if (!isPointerActive) {
      targetRevealRadius = 0;
    }

    smoothX += (targetX - smoothX) * 0.12;
    smoothY += (targetY - smoothY) * 0.12;
    revealRadius += (targetRevealRadius - revealRadius) * 0.1;

    lastSmoothX = smoothX;
    lastSmoothY = smoothY;
    lastFrameTime = time;

    ctx.clearRect(0, 0, width, height);

    shapes.forEach((shape) => {
      shape.update();
      shape.draw(ctx, 1);
    });

    blueprintShapes.forEach((shape) => shape.update());

    drawPixelVeil();
    drawDeepReveal();

    pulseRings = pulseRings.filter((ring) => {
      const alive = ring.update(time);
      if (alive) ring.draw(ctx);
      return alive;
    });

    if (time < glitchUntil) {
      applyGlitch();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

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

  heroSection.addEventListener(
    'touchstart',
    (e) => {
      isTouch = true;
      const touch = e.touches[0];
      if (!touch) return;
      const coords = heroCoords(touch.clientX, touch.clientY);
      setPointer(touch.clientX, touch.clientY);
      pulseRings.push(new PulseRing(coords.x, coords.y));
      triggerGlitch();
    },
    { passive: true }
  );

  heroSection.addEventListener(
    'touchmove',
    (e) => {
      isTouch = true;
      const touch = e.touches[0];
      if (touch) setPointer(touch.clientX, touch.clientY);
    },
    { passive: true }
  );

  heroSection.addEventListener(
    'touchend',
    () => {
      isPointerActive = false;
    },
    { passive: true }
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            lastFrameTime = performance.now();
            if (!window.isLowPowerMode) animate(performance.now());
          }
        } else {
          isVisible = false;
          cancelAnimationFrame(animationFrameId);
        }
      });
    },
    { threshold: 0 }
  );

  observer.observe(heroSection);

  let geoLastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth !== geoLastWidth) {
      geoLastWidth = window.innerWidth;
      resize();
      initCanvas();
    }
  });

  initCanvas();
  animate(performance.now());
}
