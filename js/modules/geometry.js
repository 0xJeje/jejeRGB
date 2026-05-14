 export function initGeometry() { 
    const canvas = document.getElementById('geometry-canvas');
    const heroSection = document.getElementById('hero-slim');
    if (!canvas || !heroSection) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let shapes = [];
    let animationFrameId;
    let isVisible = true; 

    window.addEventListener('powerModeChanged', (e) => {
        if (!e.detail.isLowPower && isVisible) {
            animate(performance.now()); // Restart if disabled
        }
    });

    class Shape {
        constructor() { this.init(); }

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
            this.opacity = Math.random() * 0.1 + 0.05; 
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

        drawPath() {
            ctx.beginPath();
            if (this.type === 0) { 
                ctx.moveTo(this.baseSize * 0.5, 0);
                for(let i=1; i<8; i++) {
                    ctx.lineTo(Math.cos((i/8)*Math.PI*2)*this.baseSize*0.5, Math.sin((i/8)*Math.PI*2)*this.baseSize*0.5);
                }
                ctx.closePath();
            } else if (this.type === 1) { 
                for (let i = 0; i < this.sides; i++) {
                    const angle = (i / this.sides) * Math.PI * 2;
                    const px = Math.cos(angle) * this.baseSize * 0.5;
                    const py = Math.sin(angle) * this.baseSize * 0.5;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
            } else if (this.type === 2) { 
                ctx.arc(0, 0, this.baseSize * 0.5, 0, Math.PI * 2);
            } else { 
                ctx.rect(-this.baseSize, -this.baseSize * 0.25, this.baseSize * 2, this.baseSize * 0.5);
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Simplified rendering: No screen composite, no blurs, just clean strokes
            ctx.strokeStyle = `rgba(197, 217, 45, ${this.opacity})`;
            ctx.lineWidth = 1.5; 
            
            this.drawPath();
            ctx.stroke();
            
            ctx.restore();
        }
    }

    function resize() {
        width = canvas.width = heroSection.offsetWidth;
        height = canvas.height = heroSection.offsetHeight;
    }

    function initCanvas() {
        resize();
        shapes = [];
        for (let i = 0; i < 12; i++) { shapes.push(new Shape()); }
    }

    function animate(time) {
        if (!isVisible || window.isLowPowerMode) return; // Completely halt drawing

        ctx.clearRect(0, 0, width, height);
        shapes.forEach(shape => {
            shape.update();
            shape.draw();
        });
        animationFrameId = requestAnimationFrame(animate);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isVisible) {
                    isVisible = true;
                    if (!window.isLowPowerMode) animate(performance.now());
                }
            } else {
                isVisible = false;
                cancelAnimationFrame(animationFrameId);
            }
        });
    }, { threshold: 0 });

    observer.observe(heroSection);
    window.addEventListener('resize', resize); 
    initCanvas();
    animate(performance.now());
}
