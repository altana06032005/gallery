export class LightingManager {
    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'lighting-overlay';
        document.body.appendChild(this.overlay);

        this.opacity = 0;
        this.lastInteraction = Date.now();

        // Configuration
        this.IDLE_DELAY = 4000; // Time in ms before darkening starts
        this.MAX_OPACITY = 0.85; // Maximum darkness
        this.DARKEN_SPEED = 0.01; // Opacity increase per frame
        this.BRIGHTEN_SPEED = 0.003; // Opacity decrease per frame (smooth recovery)

        this.init();
    }

    init() {
        // Track interaction
        window.addEventListener('click', () => {
            this.lastInteraction = Date.now();
        });

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const now = Date.now();
        const timeSinceInteraction = now - this.lastInteraction;

        if (timeSinceInteraction < this.IDLE_DELAY) {
            // Active / Waking up
            // Target opacity 0
            if (this.opacity > 0) {
                this.opacity -= this.BRIGHTEN_SPEED;
                if (this.opacity < 0) this.opacity = 0;
            }
        } else {
            // Idle / Darkening
            // Target opacity MAX_OPACITY
            if (this.opacity < this.MAX_OPACITY) {
                this.opacity += this.DARKEN_SPEED;
                if (this.opacity > this.MAX_OPACITY) this.opacity = this.MAX_OPACITY;
            }
        }

        this.overlay.style.opacity = this.opacity;
    }
}
