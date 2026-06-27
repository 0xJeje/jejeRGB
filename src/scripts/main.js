import { initHeroTiles } from './hero-tiles.js';
import { initAnimations } from './animations.js';
import { initCursor } from './cursor.js';
import { initSliders } from './sliders.js';
import { initOverlay } from './overlay.js';
import { initUI } from './ui.js';

function boot() {
  initUI();
  initHeroTiles();
  initAnimations();
  initCursor();
  initSliders();
  initOverlay();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
