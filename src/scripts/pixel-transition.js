const DURATION = 720;
const MIN_PIXELS = 12;

function shouldAnimate() {
  return (
    window.innerWidth < 768 &&
    !window.isLowPowerMode &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function easeInCubic(t) {
  return t ** 3;
}

function getParts(slide) {
  const container = slide.querySelector('.slide-img');
  const img = container?.querySelector('img');
  if (!container || !img) return null;
  return { container, img };
}

function ensureCrossOrigin(img) {
  if (!img.crossOrigin) img.crossOrigin = 'anonymous';
}

function waitForImage(img) {
  return new Promise((resolve) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve(true);
      return;
    }
    img.addEventListener('load', () => resolve(true), { once: true });
    img.addEventListener('error', () => resolve(false), { once: true });
  });
}

function captureSource(img, w, h) {
  const source = document.createElement('canvas');
  source.width = w;
  source.height = h;
  const sourceCtx = source.getContext('2d');
  try {
    sourceCtx.drawImage(img, 0, 0, w, h);
  } catch {
    return null;
  }
  return source;
}

/** Jitter-style: draw image at progressively finer pixel grid, scaled up with crisp blocks. */
function drawPixelatedFrame(ctx, source, w, h, pixelCount) {
  const cols = Math.max(MIN_PIXELS, Math.round(pixelCount));
  const rows = Math.max(MIN_PIXELS, Math.round((h / w) * cols));

  const low = document.createElement('canvas');
  low.width = cols;
  low.height = rows;
  const lowCtx = low.getContext('2d');
  lowCtx.drawImage(source, 0, 0, cols, rows);

  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(low, 0, 0, cols, rows, 0, 0, w, h);
}

function mountCanvas(container, w, h) {
  const canvas = document.createElement('canvas');
  canvas.className = 'slide-img-pixel-canvas';
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);
  return canvas;
}

function runFrames(drawFrame) {
  return new Promise((resolve) => {
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / DURATION);
      drawFrame(progress);
      if (progress < 1) requestAnimationFrame(tick);
      else resolve();
    };

    requestAnimationFrame(tick);
  });
}

function cleanupCanvas(container, canvas, img) {
  canvas.remove();
  container.classList.remove('is-pixel-anim');
  img.style.opacity = '';
}

export async function pixelConstruct(slide) {
  if (!shouldAnimate()) return;

  const parts = getParts(slide);
  if (!parts) return;

  const { container, img } = parts;
  ensureCrossOrigin(img);
  const loaded = await waitForImage(img);
  if (!loaded) return;

  const rect = container.getBoundingClientRect();
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));
  const source = captureSource(img, w, h);
  if (!source) return;

  const existing = container.querySelector('.slide-img-pixel-canvas');
  if (existing) existing.remove();

  container.classList.add('is-pixel-anim');
  img.style.opacity = '0';

  const canvas = mountCanvas(container, w, h);
  const ctx = canvas.getContext('2d');

  await runFrames((progress) => {
    const eased = easeOutCubic(progress);
    const pixels = MIN_PIXELS + (w - MIN_PIXELS) * eased;
    drawPixelatedFrame(ctx, source, w, h, pixels);
  });

  cleanupCanvas(container, canvas, img);
}

export async function pixelDeconstruct(slide) {
  if (!shouldAnimate()) return;

  const parts = getParts(slide);
  if (!parts) return;

  const { container, img } = parts;
  ensureCrossOrigin(img);
  const loaded = await waitForImage(img);
  if (!loaded) return;

  const rect = container.getBoundingClientRect();
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));
  const source = captureSource(img, w, h);
  if (!source) return;

  const existing = container.querySelector('.slide-img-pixel-canvas');
  if (existing) existing.remove();

  container.classList.add('is-pixel-anim');
  img.style.opacity = '0';

  const canvas = mountCanvas(container, w, h);
  const ctx = canvas.getContext('2d');

  await runFrames((progress) => {
    const eased = easeInCubic(progress);
    const pixels = w - (w - MIN_PIXELS) * eased;
    drawPixelatedFrame(ctx, source, w, h, pixels);
  });

  cleanupCanvas(container, canvas, img);
}
