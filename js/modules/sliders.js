window.dragDistance = 0; 
window.dragStartTime = 0; // NEW: Track interaction duration

export function initSliders() {
    // ----------------------------------------
    // A. Branding Slider (Smart Auto-Scroll)
    // ----------------------------------------
    const brandSection = document.getElementById('branding');
    const brandTrack = document.getElementById('brand-track');
    const btnNext = document.getElementById('brand-next');
    const btnPrev = document.getElementById('brand-prev');
    const counter = document.getElementById('brand-counter');
    const originalSlidesCount = brandTrack ? brandTrack.querySelectorAll('.slide-card').length : 0;
    
    let currentSlide = 0;
    let brandIsDown = false;
    let brandStartX, brandScrollLeft;
    let isBrandVisible = false;
    let brandAnimationId = null; // NEW: Animation frame reference

    function updateSlider() {
        if (window.innerWidth < 768) {
            const currentSlides = document.querySelectorAll('#brand-track .slide-card');
            currentSlides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index % originalSlidesCount === currentSlide) slide.classList.add('active');
            });
            if (counter) counter.innerText = `${currentSlide + 1} / ${originalSlidesCount}`;
        }
    }

    if (btnNext && btnPrev) {
        btnNext.addEventListener('click', () => { if (window.innerWidth < 768) { currentSlide = (currentSlide + 1) % originalSlidesCount; updateSlider(); }});
        btnPrev.addEventListener('click', () => { if (window.innerWidth < 768) { currentSlide = (currentSlide - 1 + originalSlidesCount) % originalSlidesCount; updateSlider(); }});
    }

    if (brandSection && brandTrack) {
        brandTrack.addEventListener('dragstart', (e) => e.preventDefault());
        brandTrack.innerHTML = brandTrack.innerHTML + brandTrack.innerHTML;

        // NEW: Refactored engine to stop when conditions fail
        const autoScrollBrand = () => {
            if (window.innerWidth >= 768 && isBrandVisible && !brandIsDown && !window.isLowPowerMode) {
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

        const brandObserver = new IntersectionObserver(entries => { 
            isBrandVisible = entries[0].isIntersecting; 
            if (isBrandVisible) startBrandScroll(); // Restart on reveal
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
            const move = (e.pageX - brandSection.offsetLeft) - brandStartX;
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
    
    window.addEventListener('resize', updateSlider);
    updateSlider();


    // ----------------------------------------
    // B. Bauhaus Grid (Smart Auto-Scroll)
    // ----------------------------------------
    const bauhausSection = document.getElementById('graphic-design');
    const bauhausSlider = document.getElementById('bauhaus-scroll');
    const bauhausGrid = document.querySelector('.bauhaus-grid');
    
    let isBauhausDown = false;
    let bauhausStartX, bauhausScrollLeft;
    let isBauhausVisible = false;
    let bauhausAnimationId = null; // NEW: Animation frame reference

    if (bauhausSection && bauhausSlider && bauhausGrid) {
        bauhausSlider.addEventListener('dragstart', (e) => e.preventDefault());
        bauhausGrid.innerHTML = bauhausGrid.innerHTML + bauhausGrid.innerHTML;

        // NEW: Refactored engine
        const autoScrollBauhaus = () => {
            if (!isBauhausDown && isBauhausVisible && !window.isLowPowerMode) {
                bauhausSlider.scrollLeft += 1;
                if (bauhausSlider.scrollLeft >= bauhausGrid.scrollWidth / 2) bauhausSlider.scrollLeft = 0;
                bauhausAnimationId = requestAnimationFrame(autoScrollBauhaus);
            } else {
                bauhausAnimationId = null;
            }
        };

        const startBauhausScroll = () => {
            if (!bauhausAnimationId) autoScrollBauhaus();
        };

        const bauhausObserver = new IntersectionObserver(entries => { 
            isBauhausVisible = entries[0].isIntersecting; 
            if (isBauhausVisible) startBauhausScroll();
        });
        bauhausObserver.observe(bauhausSection);

        // Bauhaus Drag Events
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
            const move = (e.pageX - bauhausSection.offsetLeft) - bauhausStartX;
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

        // Touch logic for Bauhaus
        bauhausSection.addEventListener('touchstart', (e) => {
            isBauhausDown = true; 
            window.dragDistance = 0;
            window.dragStartTime = Date.now();
            bauhausStartX = e.touches[0].pageX - bauhausSection.offsetLeft;
            bauhausScrollLeft = bauhausSlider.scrollLeft;
        }, { passive: true });

        bauhausSection.addEventListener('touchmove', (e) => {
            if (!isBauhausDown) return;
            const move = (e.touches[0].pageX - bauhausSection.offsetLeft) - bauhausStartX;
            window.dragDistance = Math.abs(move);
            bauhausSlider.scrollLeft = bauhausScrollLeft - move;
        }, { passive: true });

        bauhausSection.addEventListener('touchend', () => { 
            isBauhausDown = false; 
            startBauhausScroll(); 
        });
    }

    // NEW: Global Power State Re-initialization
    window.addEventListener('powerModeChanged', (e) => {
        if (!e.detail.isLowPower) {
            if (isBrandVisible && brandSection) {
                // Kickstart if it stopped
                if (window.innerWidth >= 768 && !brandAnimationId) autoScrollBrand(); 
            }
            if (isBauhausVisible && bauhausSection) {
                if (!bauhausAnimationId) autoScrollBauhaus();
            }
        }
    });

    // ----------------------------------------
    // C. Mobile Reels Stack Logic (Unchanged)
    // ----------------------------------------
    const reelsGrid = document.getElementById('reels-grid');
    const reelCards = document.querySelectorAll('.reel-card');
    const reelPrev = document.getElementById('reel-prev');
    const reelNext = document.getElementById('reel-next');

    if (reelsGrid && reelCards.length > 0) {
        let currentReelIndex = 0;

        const updateReelStack = () => {
            if (window.innerWidth >= 768) {
                reelCards.forEach(card => { card.className = 'reel-card'; card.style.zIndex = ''; });
                return;
            }

            reelCards.forEach((card, index) => {
                card.classList.remove('stack-active', 'stack-prev', 'stack-next');
                if (index === currentReelIndex) card.classList.add('stack-active');
                else if (index === (currentReelIndex - 1 + reelCards.length) % reelCards.length) card.classList.add('stack-prev'); 
                else if (index === (currentReelIndex + 1) % reelCards.length) card.classList.add('stack-next'); 
            });
        };

        if (reelNext && reelPrev) {
            reelNext.addEventListener('click', () => { currentReelIndex = (currentReelIndex + 1) % reelCards.length; updateReelStack(); });
            reelPrev.addEventListener('click', () => { currentReelIndex = (currentReelIndex - 1 + reelCards.length) % reelCards.length; updateReelStack(); });
        }

        let touchStartX = 0;
        reelsGrid.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        reelsGrid.addEventListener('touchend', (e) => {
            let touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) { currentReelIndex = (currentReelIndex + 1) % reelCards.length; updateReelStack(); } 
            else if (touchEndX - touchStartX > 50) { currentReelIndex = (currentReelIndex - 1 + reelCards.length) % reelCards.length; updateReelStack(); }
        });

        updateReelStack();
        window.addEventListener('resize', updateReelStack);
    }
}
