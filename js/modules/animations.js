 class TextScramble {
    constructor(el, syncEl = null) {
        this.el = el;
        this.syncEl = syncEl; 
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="mono">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (this.syncEl) this.syncEl.innerHTML = output; 

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

export let updateScramblePhrases = null;

export function initAnimations() {
    const el = document.getElementById('scramble-target');
    const navEl = document.getElementById('nav-scramble');

    let phrases = [
        'ARHITECT DIGITAL',
        'SPECIALIST BRANDING',
        'DESIGNER GRAFIC',
        'EDITOR VIDEO',
        'STRATEG SOCIAL MEDIA',
        'WEB DEVELOPER',
        'JEJE.RBG'
    ];

    if (el) {
        const fx = new TextScramble(el, navEl);
        let counter = 0;
        const next = () => {
            fx.setText(phrases[counter]).then(() => {
                setTimeout(next, 2500);
            });
            counter = (counter + 1) % phrases.length;
        };
        next();

        updateScramblePhrases = (newPhrases) => {
            phrases = newPhrases;
            counter = 0;
        };
    }

    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section > .container > *').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        observer.observe(el);
    });
}
