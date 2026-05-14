import { initGeometry } from './modules/geometry.js'; 
import { initAnimations, updateScramblePhrases } from './modules/animations.js';
import { initCursor } from './modules/cursor.js';
import { initSliders } from './modules/sliders.js';
import { initOverlay } from './modules/overlay.js';

// Global power state
window.isLowPowerMode = false;

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Modular Components
    initGeometry();
    initAnimations();
    initCursor();
    initSliders();
    initOverlay();

    // 2. Real Bootloader Sequence
    const loadingScreen = document.getElementById('loading-screen');
    const loaderProgress = document.getElementById('loader-progress');
    const loaderStatus = document.getElementById('loader-status');
    let progress = 0;
    let isWindowLoaded = false;

    window.addEventListener('load', () => { isWindowLoaded = true; });

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
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
            }, 400);
        }
    }, 120);

    // 3. Navigation Scroll Effect
    const nav = document.getElementById('main-nav');
    const navLogo = document.getElementById('nav-logo');
    const heroTitle = document.getElementById('hero-title');
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }

                if (heroTitle) {
                    const heroRect = heroTitle.getBoundingClientRect();
                    if (heroRect.top < 60) {
                        navLogo.classList.add('visible');
                    } else {
                        navLogo.classList.remove('visible');
                    }
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    // 4. Power Mode Toggle Logic (NEW)
    const powerToggle = document.getElementById('toggle-power');
    powerToggle.addEventListener('click', () => {
        window.isLowPowerMode = !window.isLowPowerMode;
        document.body.classList.toggle('low-power-mode', window.isLowPowerMode);
        powerToggle.style.background = window.isLowPowerMode ? 'var(--accent)' : 'transparent';
        powerToggle.style.color = window.isLowPowerMode ? 'var(--black)' : 'var(--accent)';
        
        // Dispatch event for other modules
        window.dispatchEvent(new CustomEvent('powerModeChanged', { detail: { isLowPower: window.isLowPowerMode } }));
    });

    // 5. Language Toggle logic
    const langToggle = document.getElementById('toggle-lang');
    let currentLang = 'ro';

    function updateFormTranslations(lang) {
        document.querySelectorAll('[data-ro][data-en]').forEach(el => {
            const translatedText = el.getAttribute(`data-${lang}`);
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translatedText;
            } else if (el.tagName === 'OPTION') {
                el.innerText = translatedText;
            } else {
                el.innerText = translatedText;
            }
        });
    }
    
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'ro' ? 'en' : 'ro';
        document.documentElement.lang = currentLang;
        langToggle.innerText = currentLang === 'ro' ? 'EN' : 'RO';
        
        const phrases = currentLang === 'ro' ?
            ['ARHITECT DIGITAL', 'SPECIALIST BRANDING', 'DESIGNER GRAFIC', 'EDITOR VIDEO', 'STRATEG SOCIAL MEDIA', 'WEB DEVELOPER', 'JEJE.RBG'] :
            ['DIGITAL ARCHITECT', 'BRANDING SPECIALIST', 'GRAPHIC DESIGNER', 'VIDEO EDITOR', 'SOCIAL MEDIA STRATEGIST', 'WEB DEVELOPER', 'JEJE.RBG'];

        if (updateScramblePhrases) updateScramblePhrases(phrases);
        updateFormTranslations(currentLang);
    });

    updateFormTranslations(currentLang);

    // 6. Mobile Menu Toggle
    const menuTrigger = document.getElementById('menu-trigger');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    menuTrigger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        mobileMenu.style.display = isMenuOpen ? 'flex' : 'none';
        menuTrigger.innerText = isMenuOpen ? 'CLOSE' : 'MENU';
        document.body.classList.toggle('no-scroll', isMenuOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            mobileMenu.style.display = 'none';
            menuTrigger.innerText = 'MENU';
            document.body.classList.remove('no-scroll');
        });
    });

    // 7. Smooth Scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = nav.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 8. Terminal Checks Intersection Observer
    const checksContainer = document.getElementById('terminal-checks');
    if (checksContainer) {
        const checkItems = checksContainer.querySelectorAll('.check-item');
        const checkObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                checkItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('revealed');
                    }, index * 400); 
                });
                checkObserver.disconnect(); 
            }
        }, { threshold: 0.3 });
        checkObserver.observe(checksContainer);
    }
});
