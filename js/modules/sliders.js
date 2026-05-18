window.dragDistance = 0; 

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
        // Obeserver to pause scroll when off-screen
        const brandObserver = new IntersectionObserver(entries => { isBrandVisible = entries[0].isIntersecting; });
        brandObserver.observe(brandSection);

        brandTrack.addEventListener('dragstart', (e) => e.preventDefault());
        brandTrack.innerHTML = brandTrack.innerHTML + brandTrack.innerHTML;

        const autoScrollBrand = () => {
            // ONLY scroll if visible, wide enough, and not in low power mode
            if (window.innerWidth >= 768 && isBrandVisible && !brandIsDown && !window.isLowPowerMode) {
                brandTrack.scrollLeft += 0.8;
                if (brandTrack.scrollLeft >= brandTrack.scrollWidth / 2) brandTrack.scrollLeft = 0;
            }
            requestAnimationFrame(autoScrollBrand);
        };
        autoScrollBrand();

        brandSection.addEventListener('mousedown', (e) => {
            if (window.innerWidth < 768) return;
            brandIsDown = true; window.dragDistance = 0;
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

        brandSection.addEventListener('mouseup', () => brandIsDown = false);
        brandSection.addEventListener('mouseleave', () => brandIsDown = false);
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

    if (bauhausSection && bauhausSlider && bauhausGrid) {
        const bauhausObserver = new IntersectionObserver(entries => { isBauhausVisible = entries[0].isIntersecting; });
        bauhausObserver.observe(bauhausSection);

        bauhausSlider.addEventListener('dragstart', (e) => e.preventDefault());
        bauhausGrid.innerHTML = bauhausGrid.innerHTML + bauhausGrid.innerHTML;

        const autoScrollBauhaus = () => {
            if (!isBauhausDown && isBauhausVisible && !window.isLowPowerMode) {
                bauhausSlider.scrollLeft += 1;
                if (bauhausSlider.scrollLeft >= bauhausGrid.scrollWidth / 2) bauhausSlider.scrollLeft = 0;
            }
            requestAnimationFrame(autoScrollBauhaus);
        };
        autoScrollBauhaus();

        // Bauhaus Drag Events
        bauhausSection.addEventListener('mousedown', (e) => {
            isBauhausDown = true; window.dragDistance = 0;
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

        bauhausSection.addEventListener('mouseup', () => { isBauhausDown = false; });
        bauhausSection.addEventListener('mouseleave', () => { isBauhausDown = false; });

        // Touch logic for Bauhaus
        bauhausSection.addEventListener('touchstart', (e) => {
            isBauhausDown = true; window.dragDistance = 0;
            bauhausStartX = e.touches[0].pageX - bauhausSection.offsetLeft;
            bauhausScrollLeft = bauhausSlider.scrollLeft;
        }, { passive: true });

        bauhausSection.addEventListener('touchmove', (e) => {
            if (!isBauhausDown) return;
            const move = (e.touches[0].pageX - bauhausSection.offsetLeft) - bauhausStartX;
            window.dragDistance = Math.abs(move);
            bauhausSlider.scrollLeft = bauhausScrollLeft - move;
        }, { passive: true });

        bauhausSection.addEventListener('touchend', () => { isBauhausDown = false; });
    }

    // ----------------------------------------
    // C. Mobile Reels Stack Logic (Unchanged but Optimized)
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
