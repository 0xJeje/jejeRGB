import { projectData } from '../data/projects.js';

export function initOverlay() {
  const overlay = document.getElementById('project-overlay');
  const scrollArea = document.getElementById('overlay-scroll-area');
  const overlayBody = document.getElementById('overlay-body');
  const closeOverlay = document.getElementById('close-overlay');

  const overlayNext = document.getElementById('overlay-next');
  const overlayPrev = document.getElementById('overlay-prev');
  const allProjectKeys = Object.keys(projectData);

  let currentCategoryKeys = [];
  let currentOverlayIndex = -1;
  let overlayScrollY = 0;

  function lockPageScroll() {
    overlayScrollY = window.scrollY;
    document.body.classList.add('no-scroll');
    document.body.style.top = `-${overlayScrollY}px`;
  }

  function unlockPageScroll() {
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    window.scrollTo(0, overlayScrollY);
  }

  function renderOverlayContent(id) {
    const data = projectData[id];
    if (!data) return;

    const isGraphic = id.startsWith('graphic');
    const categoryPrefix = id.split('-')[0] + '-';
    currentCategoryKeys = allProjectKeys.filter((k) => k.startsWith(categoryPrefix));
    currentOverlayIndex = currentCategoryKeys.indexOf(id);

    const lang = document.documentElement.lang;
    const process = lang === 'ro' ? data.process_ro : data.process_en;
    const alt = `${data.title} — ${data.tags}`;

    let mediaHTML = '';

    if (Array.isArray(data.images)) {
      if (isGraphic) {
        mediaHTML = `
          <div class="graphic-image-fit">
            <img src="${data.images[0]}" alt="${alt}" loading="lazy" decoding="async">
          </div>
        `;
      } else {
        mediaHTML = `
          <div class="bauhaus-asset-grid">
            ${data.images
              .map((item) => {
                if (typeof item === 'string') {
                  return `<div class="grid-cell"><img src="${item}" alt="${alt}" loading="lazy" decoding="async"></div>`;
                }
                return `<div class="grid-cell ${item.size || ''}"><img src="${item.url}" alt="${alt}" loading="lazy" decoding="async"></div>`;
              })
              .join('')}
          </div>
        `;
      }
    } else if (data.images && data.images.desktop) {
      mediaHTML = `
        <div class="case-study-wrapper" style="width: 100%; display: flex; justify-content: center;">
          <picture style="width: 100%; max-width: 1920px;">
            <source media="(max-width: 768px)" srcset="${data.images.mobile}">
            <img src="${data.images.desktop}" alt="${alt}" style="width: 100%; height: auto; display: block;">
          </picture>
        </div>
      `;
    }

    if (isGraphic) {
      scrollArea.style.overflowY = 'hidden';
      overlayBody.innerHTML = `
        <div class="graphic-overlay-wrapper">
          <div class="overlay-text-wrapper compact">
            <span class="mono" style="color: var(--accent-text);">${data.tags}</span>
            <h2 class="huge-text">${data.title}</h2>
            <p class="mono" style="margin-top: 1rem; font-size: 1rem;">${process}</p>
          </div>
          ${mediaHTML}
        </div>
      `;
    } else {
      scrollArea.style.overflowY = 'auto';
      overlayBody.innerHTML = `
        <div class="brand-overlay-wrapper">
          <div class="overlay-text-wrapper">
            <span class="mono" style="color: var(--accent-text);">${data.tags}</span>
            <h2 class="huge-text">${data.title}</h2>
            <p class="mono" style="margin-top: 2rem; font-size: 1.1rem; line-height: 1.6;">${process}</p>
          </div>
          ${mediaHTML}
        </div>
      `;
    }
  }

  document.body.addEventListener('click', (e) => {
    const trigger = e.target.closest('.trigger-overlay');
    if (!trigger) return;

    if (
      e.target.tagName === 'A' ||
      (e.target.closest('a') && !e.target.classList.contains('trigger-overlay'))
    )
      return;

    const dragDuration = Date.now() - (window.dragStartTime || 0);

    if (window.dragDistance > 5 && dragDuration > 150) {
      window.dragDistance = 0;
      return;
    }

    window.dragDistance = 0;

    const id = trigger.getAttribute('data-project');
    renderOverlayContent(id);

    overlay.style.display = 'flex';
    lockPageScroll();
    scrollArea.scrollTop = 0;
  });

  function close() {
    overlay.style.display = 'none';
    unlockPageScroll();
  }

  closeOverlay.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display === 'flex') close();
  });

  if (overlayNext && overlayPrev) {
    overlayNext.addEventListener('click', () => {
      if (currentCategoryKeys.length === 0) return;
      let nextIndex = (currentOverlayIndex + 1) % currentCategoryKeys.length;
      renderOverlayContent(currentCategoryKeys[nextIndex]);
      scrollArea.scrollTop = 0;
    });

    overlayPrev.addEventListener('click', () => {
      if (currentCategoryKeys.length === 0) return;
      let prevIndex =
        (currentOverlayIndex - 1 + currentCategoryKeys.length) % currentCategoryKeys.length;
      renderOverlayContent(currentCategoryKeys[prevIndex]);
      scrollArea.scrollTop = 0;
    });
  }
}
