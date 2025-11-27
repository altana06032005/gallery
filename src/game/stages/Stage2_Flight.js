export class Stage2_Flight {
    constructor(container, gameManager) {
        this.container = container;
        this.gameManager = gameManager;
        this.duration = 5000; // 5 seconds flight
        this.startTime = null;
    }

    init() {
        this.render();
        this.startTime = Date.now();
        this.loop = requestAnimationFrame(this.update.bind(this));
    }

    render() {
        this.container.innerHTML = `
      <div class="stage-flight">
        <canvas id="flight-canvas"></canvas>
        <div class="hud">
          <h1>FLIGHT TO PLANET</h1>
          <div class="status-text">APPROACHING DESTINATION...</div>
        </div>
      </div>
    `;

        const style = document.createElement('style');
        style.textContent = `
      .stage-flight {
        width: 100%;
        height: 100%;
        position: relative;
      }
      #flight-canvas {
        width: 100%;
        height: 100%;
        background: var(--bg-color);
      }
      .hud {
        position: absolute;
        top: 20px;
        width: 100%;
        text-align: center;
        pointer-events: none;
      }
    `;
        this.container.appendChild(style);

        this.canvas = document.getElementById('flight-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas.bind(this));

        // Initialize stars
        this.stars = [];
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * 2 + 0.5 // speed/depth
            });
        }
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    update() {
        const elapsed = Date.now() - this.startTime;

        // Clear canvas
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw stars (warp speed effect)
        this.ctx.fillStyle = '#ffffff';
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        this.stars.forEach(star => {
            // Move star away from center to create forward motion illusion
            const dx = (star.x - centerX) / (this.canvas.width / 2);
            const dy = (star.y - centerY) / (this.canvas.height / 2);

            star.x += dx * star.z * 10;
            star.y += dy * star.z * 10;
            star.z += 0.05; // Accelerate

            // Reset if out of bounds
            if (star.x < 0 || star.x > this.canvas.width || star.y < 0 || star.y > this.canvas.height) {
                star.x = Math.random() * this.canvas.width;
                star.y = Math.random() * this.canvas.height;
                star.z = Math.random() * 2 + 0.5;
                // Keep new stars closer to center to avoid popping at edges
                // Actually, for warp effect, spawning near center is better
                star.x = centerX + (Math.random() - 0.5) * 50;
                star.y = centerY + (Math.random() - 0.5) * 50;
            }

            // Draw star as a line (streak)
            const size = star.z * 1.5;
            this.ctx.beginPath();
            this.ctx.moveTo(star.x, star.y);
            this.ctx.lineTo(star.x - dx * size * 5, star.y - dy * size * 5);
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, star.z / 5)})`;
            this.ctx.lineWidth = size;
            this.ctx.stroke();
        });

        // Draw Rocket (simplified rear view or just engine glow)
        // For now, let's draw a simple geometric shape in the center representing the rocket engine
        this.ctx.save();
        this.ctx.translate(centerX, centerY + 100);
        this.ctx.beginPath();
        this.ctx.moveTo(0, -20);
        this.ctx.lineTo(15, 20);
        this.ctx.lineTo(0, 10);
        this.ctx.lineTo(-15, 20);
        this.ctx.closePath();
        this.ctx.strokeStyle = 'var(--neon-cyan)'; // Canvas doesn't parse var(), need actual color
        this.ctx.strokeStyle = '#00f3ff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Engine glow
        this.ctx.beginPath();
        this.ctx.arc(0, 15, 5 + Math.random() * 5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fill();
        this.ctx.restore();


        if (elapsed >= this.duration) {
            this.completeStage();
        } else {
            this.loop = requestAnimationFrame(this.update.bind(this));
        }
    }

    completeStage() {
        cancelAnimationFrame(this.loop);
        window.removeEventListener('resize', this.resizeCanvas);
        this.gameManager.nextStage();
    }

    cleanup() {
        cancelAnimationFrame(this.loop);
        window.removeEventListener('resize', this.resizeCanvas);
    }
}
