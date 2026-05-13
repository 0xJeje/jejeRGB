export function initCursor() {
    const cursor = document.querySelector('.cursor-dot');
    if (!cursor) return;

    let isHovering = false;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    
    let cursorVisible = false;
    let isTouchDevice = false;

    window.addEventListener('touchstart', () => {
        isTouchDevice = true;
        cursorVisible = false;
        cursor.style.display = 'none';
        document.body.classList.remove('hide-native-cursor');
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        if (e.movementX === 0 && e.movementY === 0) return; 
        
        isTouchDevice = false; 
        if (!cursorVisible && !window.isLowPowerMode) {
            cursor.style.display = 'block';
            document.body.classList.add('hide-native-cursor'); 
            cursorVisible = true;
        }
        
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('powerModeChanged', (e) => {
        if (e.detail.isLowPower) {
            cursorVisible = false;
            cursor.style.display = 'none';
            document.body.classList.remove('hide-native-cursor');
        }
    });

    // BUG FIX: Use Event Delegation for dynamic/cloned elements
    const interactives = 'a, button, .trigger-overlay, input, textarea, select, .sarcastic-quote, .bauhaus-scroll-wrapper, .yt-card, .reel-card, .slide-card';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactives)) isHovering = true;
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactives)) isHovering = false;
    });

    const renderCursor = () => {
        if (cursorVisible && !window.isLowPowerMode) {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

            if (isHovering) cursor.classList.add('hovered');
            else cursor.classList.remove('hovered');
        }
        requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);
}