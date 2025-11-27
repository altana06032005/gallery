export class Stage2_Flight {
  constructor(container, gameManager) {
    this.container = container;
    this.gameManager = gameManager;
    this.duration = 5000; // 5 seconds flight
    this.startTime = null;
    this.speed = 0; // Current speed
    this.maxSpeed = 50;
    this.acceleration = 0.5;
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
          <div class="status-text">ACCELERATING...</div>
        </div>
        <div class="rocket-overlay" id="rocket-overlay">
          <!-- Real Geometric Rocket SVG (Same as Stage 1) -->
          <svg width="100" height="150" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 20 L130 80 L130 220 L100 240 L70 220 L70 80 Z" stroke="#0055aa" stroke-width="2" fill="#ffffff" />
            <path d="M100 20 L100 240" stroke="#0055aa" stroke-width="1" stroke-dasharray="4 2" />
            <path d="M70 180 L40 240 L70 220" stroke="#0055aa" stroke-width="2" fill="#ffffff" />
            <path d="M130 180 L160 240 L130 220" stroke="#0055aa" stroke-width="2" fill="#ffffff" />
            <path d="M85 240 L75 260 L125 260 L115 240" stroke="#0055aa" stroke-width="2" fill="#ffffff" />
            <circle cx="100" cy="100" r="15" stroke="#00f2ff" stroke-width="2" fill="#ffffff" />
            <circle cx="100" cy="100" r="5" fill="#00f2ff" />
            
            <!-- Engine Flame -->
            <path id="engine-flame" d="M85 260 L100 290 L115 260" fill="#00f2ff" opacity="0.8">
            </path>
          </svg>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .stage-flight {
        width: 100%;
        height: 100%;
        position: relative;
        background: #f0f4f8;
        overflow: hidden;
      }
      #flight-canvas {
        width: 100%;
        height: 100%;
      }
      .hud {
        position: absolute;
        top: 20px;
        width: 100%;
        text-align: center;
        pointer-events: none;
        z-index: 10;
      }
      .hud h1 {
        font-size: 1.5rem;
        color: #0055aa;
        margin-bottom: 5px;
        font-family: 'Orbitron', sans-serif;
      }
      .status-text {
        color: #0055aa;
        font-family: 'Orbitron', sans-serif;
        font-size: 1rem;
        opacity: 0.8;
      }
      .rocket-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 5;
        filter: drop-shadow(0 10px 20px rgba(0, 85, 170, 0.2));
        transition: transform 0.05s; /* Fast transition for shake */
      }
    `;
    this.container.appendChild(style);

    this.canvas = document.getElementById('flight-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.rocketOverlay = document.getElementById('rocket-overlay');
    this.engineFlame = document.getElementById('engine-flame');

    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));

    // Initialize stars (speed lines)
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

    // Accelerate
    if (this.speed < this.maxSpeed) {
      this.speed += this.acceleration;
    }

    // Clear canvas (Light background)
    this.ctx.fillStyle = '#f0f4f8';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw stars (Vertical Flight - Upward means stars go DOWN)
    this.stars.forEach(star => {
      // Move star down
      const moveSpeed = (this.speed / 2) * star.z;
      star.y += moveSpeed;

      // Reset if out of bounds (bottom)
      if (star.y > this.canvas.height) {
        star.y = -50; // Reset to top
        star.x = Math.random() * this.canvas.width;
        star.z = Math.random() * 2 + 0.5;
      }

      // Draw star as a vertical line (streak)
      const length = star.z * (this.speed / 2);
      this.ctx.beginPath();
      this.ctx.moveTo(star.x, star.y);
      this.ctx.lineTo(star.x, star.y - length);
      // Dark blue/gray lines for contrast
      this.ctx.strokeStyle = `rgba(0, 85, 170, ${Math.min(0.5, star.z / 5)})`;
      this.ctx.lineWidth = Math.min(3, star.z * 0.5);
      this.ctx.stroke();
    });

    // Rocket Shake & Flame
    const shakeX = (Math.random() - 0.5) * (this.speed / 5);
    const shakeY = (Math.random() - 0.5) * (this.speed / 5);
    this.rocketOverlay.style.transform = `translate(calc(-50% + ${shakeX}px), calc(-50% + ${shakeY}px))`;

    // Flame flicker
    const flameLength = 30 + (this.speed * 1.5) + (Math.random() * 10);
    this.engineFlame.setAttribute('d', `M85 260 L100 ${260 + flameLength} L115 260`);

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
