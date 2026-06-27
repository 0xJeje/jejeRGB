import { updateScramblePhrases } from './animations.js';

export function initUI() {
  // ---- Loader ----
  const loadingScreen = document.getElementById('loading-screen');
  const loaderProgress = document.getElementById('loader-progress');
  const loaderStatus = document.getElementById('loader-status');
  let progress = 0;
  let isWindowLoaded = document.readyState === 'complete';

  window.addEventListener('load', () => {
    isWindowLoaded = true;
  });

  if (loadingScreen && loaderProgress && loaderStatus) {
    const bootSequence = setInterval(() => {
      if (isWindowLoaded) {
        progress = 100;
      } else {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
      }

      loaderProgress.style.width = progress + '%';
      loaderStatus.innerText = `LOAD_MULTIMEDIA_DESIGNS: ${Math.floor(progress)}%`;

      if (progress === 100) {
        clearInterval(bootSequence);
        setTimeout(() => {
          loadingScreen.classList.remove('is-active');
          loadingScreen.style.opacity = '0';
          loadingScreen.style.visibility = 'hidden';
        }, 400);
      }
    }, 120);
  }

  // ---- Nav scroll effect ----
  const nav = document.getElementById('main-nav');
  const navLogo = document.getElementById('nav-logo');
  const heroTitle = document.getElementById('hero-title');
  let isScrolling = false;

  if (heroTitle && navLogo) {
    let logoVisible = false;

    const logoObserver = new IntersectionObserver(
      (entries) => {
        const top = entries[0].boundingClientRect.top;
        if (!logoVisible && top < 50) {
          navLogo.classList.add('visible');
          logoVisible = true;
        } else if (logoVisible && top > 80) {
          navLogo.classList.remove('visible');
          logoVisible = false;
        }
      },
      { rootMargin: '-60px 0px 0px 0px', threshold: [0, 1] }
    );

    logoObserver.observe(heroTitle);
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 50) nav.classList.add('scrolled');
          else nav.classList.remove('scrolled');
          isScrolling = false;
        });
        isScrolling = true;
      }
    },
    { passive: true }
  );

  // ---- Theme toggle (light/dark) ----
  const themeToggle = document.getElementById('toggle-theme');
  const root = document.documentElement;

  function setThemeIcon() {
    if (!themeToggle) return;
    const isLight = root.getAttribute('data-theme') === 'light';
    themeToggle.innerText = isLight ? '☀️' : '🌙';
    themeToggle.setAttribute(
      'aria-label',
      isLight ? 'Switch to dark theme' : 'Switch to light theme'
    );
  }
  setThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'light' ? '#f2f1ea' : '#000000');
      setThemeIcon();
      themeToggle.blur();
    });
  }

  // ---- Low power mode toggle (⚡) ----
  window.isLowPowerMode = false;
  const powerToggle = document.getElementById('toggle-power');

  function applyLowPower(on) {
    window.isLowPowerMode = on;
    document.body.classList.toggle('low-power-mode', on);
    if (powerToggle) powerToggle.classList.toggle('active', on);
    window.dispatchEvent(
      new CustomEvent('powerModeChanged', { detail: { isLowPower: on } })
    );
  }

  // Restore persisted low-power preference
  try {
    if (localStorage.getItem('lowPower') === '1') applyLowPower(true);
  } catch (e) {}

  if (powerToggle) {
    powerToggle.addEventListener('click', () => {
      const on = !window.isLowPowerMode;
      applyLowPower(on);
      try {
        localStorage.setItem('lowPower', on ? '1' : '0');
      } catch (e) {}
      if (!on) powerToggle.blur();
    });
  }

  // ---- Language toggle (RO/EN) ----
  const langToggle = document.getElementById('toggle-lang');
  let currentLang = 'ro';

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('.ro').forEach((el) => {
      if (lang === 'ro') el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    });

    document.querySelectorAll('.en').forEach((el) => {
      if (lang === 'en') el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    });

    if (langToggle) langToggle.innerText = lang === 'ro' ? 'EN' : 'RO';
  }

  function updateFormTranslations(lang) {
    document.querySelectorAll('[data-ro][data-en]').forEach((el) => {
      const translatedText = el.getAttribute(`data-${lang}`);
      if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', translatedText);
      if (el.hasAttribute('title')) el.setAttribute('title', translatedText);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translatedText;
      } else {
        el.innerText = translatedText;
      }
    });
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const nextLang = currentLang === 'ro' ? 'en' : 'ro';
      setLanguage(nextLang);

      const phrases =
        nextLang === 'ro'
          ? [
              'ARHITECT DIGITAL',
              'SPECIALIST BRANDING',
              'DESIGNER GRAFIC',
              'EDITOR VIDEO',
              'STRATEG SOCIAL MEDIA',
              'WEB DEVELOPER',
              'JEJE.RBG',
            ]
          : [
              'DIGITAL ARCHITECT',
              'BRANDING SPECIALIST',
              'GRAPHIC DESIGNER',
              'VIDEO EDITOR',
              'SOCIAL MEDIA STRATEGIST',
              'WEB DEVELOPER',
              'JEJE.RBG',
            ];

      if (updateScramblePhrases) updateScramblePhrases(phrases);
      updateFormTranslations(nextLang);
      langToggle.blur();
    });
  }

  setLanguage('ro');
  updateFormTranslations('ro');

  // ---- Mobile menu ----
  const menuTrigger = document.getElementById('menu-trigger');
  const mobileMenu = document.getElementById('mobile-menu');
  let isMenuOpen = false;

  if (menuTrigger && mobileMenu) {
    let menuScrollY = 0;

    function preventBackgroundScroll(e) {
      if (!mobileMenu.contains(e.target)) {
        e.preventDefault();
      }
    }

    function syncMenuInset() {
      if (nav) {
        mobileMenu.style.setProperty('--menu-nav-offset', `${nav.offsetHeight}px`);
      }
      const dock = mobileMenu.querySelector('.mobile-menu-dock');
      if (dock) {
        mobileMenu.style.setProperty('--menu-dock-offset', `${dock.offsetHeight}px`);
      }
    }

    function setMenuOpen(open) {
      isMenuOpen = open;
      mobileMenu.classList.toggle('is-open', open);
      mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open) {
        syncMenuInset();
        requestAnimationFrame(syncMenuInset);
        menuScrollY = window.scrollY;
        document.documentElement.classList.add('menu-open');
        document.body.classList.add('no-scroll');
        document.body.style.top = `-${menuScrollY}px`;
        document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
      } else {
        document.documentElement.classList.remove('menu-open');
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        document.removeEventListener('touchmove', preventBackgroundScroll);
        window.scrollTo(0, menuScrollY);
      }

      mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
      menuTrigger.classList.toggle('is-open', open);
      menuTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuTrigger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    syncMenuInset();
    window.addEventListener('resize', syncMenuInset, { passive: true });

    menuTrigger.addEventListener('click', () => {
      setMenuOpen(!isMenuOpen);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setMenuOpen(false);
      });
    });
  }

  // ---- Smooth scroll for anchors ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = nav ? nav.offsetHeight : 0;
        const prefersTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: prefersTouch ? 'auto' : 'smooth',
        });
      }
    });
  });

  // ---- Secure (base64) contact links ----
  document.querySelectorAll('.secure-link').forEach((link) => {
    try {
      const protocol = link.getAttribute('data-protocol') || '';
      const decoded = atob(link.getAttribute('data-sec') || '');
      link.setAttribute('href', protocol + decoded);
      const textEl = link.querySelector('.secure-text');
      if (textEl) textEl.innerText = decoded;
    } catch (e) {}
  });

  // ---- Terminal checks reveal ----
  const checksContainer = document.getElementById('terminal-checks');
  if (checksContainer) {
    const checkItems = checksContainer.querySelectorAll('.check-item');
    const checkObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          checkItems.forEach((item, index) => {
            setTimeout(() => item.classList.add('revealed'), index * 400);
          });
          checkObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    checkObserver.observe(checksContainer);
  }
}
