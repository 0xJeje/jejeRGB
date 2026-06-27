const DURATION = 560;

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

async function buildPixelGrid(container, img) {
  const rect = container.getBoundingClientRect();
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));
  const cell = Math.max(10, Math.min(16, Math.floor(w / 28)));

  const source = document.createElement('canvas');
  source.width = w;
  source.height = h;
  const sourceCtx = source.getContext('2d');

  try {
    sourceCtx.drawImage(img, 0, 0, w, h);
  } catch {
    return null;
  }

  const blocks = [];
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sx = col * cell;
      const sy = row * cell;
      const sw = Math.min(cell, w - sx);
      const sh = Math.min(cell, h - sy);
      const angle = (Math.random() - 0.5) * Math.PI * 0.35;
      const dist = 40 + Math.random() * 90;

      blocks.push({
        sx,
        sy,
        sw,
        sh,
        hx: sx,
        hy: sy,
        vx: Math.cos(angle) * dist,
        vy: Math.sin(angle) * dist,
        rot: (Math.random() - 0.5) * 0.45,
        delay: Math.random() * 0.38,
      });
    }
  }

  return { source, w, h, blocks };
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

function drawBlocks(ctx, data, progress, mode) {
  const { source, w, h, blocks } = data;
  ctx.clearRect(0, 0, w, h);

  for (const block of blocks) {
    const span = 1 - block.delay * 0.55;
    const local = Math.max(0, Math.min(1, (progress - block.delay) / span));
    const eased = mode === 'construct' ? easeOutCubic(local) : easeInCubic(local);
    const scatter = mode === 'construct' ? 1 - eased : eased;
    const alpha = mode === 'construct' ? Math.min(1, local * 1.25) : 1 - eased;

    if (alpha <= 0.01) continue;

    const x = block.hx + block.vx * scatter;
    const y = block.hy + block.vy * scatter;
    const rot = block.rot * scatter;

    ctx.globalAlpha = alpha;
    ctx.save();
    ctx.translate(x + block.sw * 0.5, y + block.sh * 0.5);
    ctx.rotate(rot);
    ctx.drawImage(
      source,
      block.sx,
      block.sy,
      block.sw,
      block.sh,
      -block.sw * 0.5,
      -block.sh * 0.5,
      block.sw,
      block.sh
    );
    ctx.restore();
  }

  ctx.globalAlpha = 1;
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

  const data = await buildPixelGrid(container, img);
  if (!data) return;

  const existing = container.querySelector('.slide-img-pixel-canvas');
  if (existing) existing.remove();

  container.classList.add('is-pixel-anim');
  img.style.opacity = '0';

  const canvas = mountCanvas(container, data.w, data.h);
  const ctx = canvas.getContext('2d');

  await runFrames((progress) => drawBlocks(ctx, data, progress, 'construct'));
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

  const data = await buildPixelGrid(container, img);
  if (!data) return;

  const existing = container.querySelector('.slide-img-pixel-canvas');
  if (existing) existing.remove();

  container.classList.add('is-pixel-anim');
  img.style.opacity = '0';

  const canvas = mountCanvas(container, data.w, data.h);
  const ctx = canvas.getContext('2d');

  await runFrames((progress) => drawBlocks(ctx, data, progress, 'deconstruct'));
  cleanupCanvas(container, canvas, img);
}
