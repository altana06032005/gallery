export class Stage4_Landing {
  constructor(container, gameManager) {
    this.container = container;
    this.gameManager = gameManager;
    this.duration = 4000; // 4 seconds landing
    this.startTime = null;
  }

  init() {
    this.render();
    this.startTime = Date.now();
    this.loop = requestAnimationFrame(this.update.bind(this));
  }

  render() {
    this.container.innerHTML = `
      <div class="stage-landing">
        <canvas id="landing-canvas"></canvas>
        <div class="hud">
          <h1>PLANET LANDING</h1>
          <div class="status-text">INITIATING DESCENT...</div>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .stage-landing {
        width: 100%;
        height: 100%;
        position: relative;
        background: #f0f4f8;
      }
      #landing-canvas {
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
    `;
    this.container.appendChild(style);

    this.canvas = document.getElementById('landing-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  update() {
    const elapsed = Date.now() - this.startTime;
    const progress = Math.min(1, elapsed / this.duration);

    // Clear
    this.ctx.fillStyle = '#f0f4f8';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    // Draw Planet (Growing)
    const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
    const currentRadius = 10 + (maxRadius * progress);

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = '#0055aa';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Grid lines on planet (latitude/longitude)
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
    this.ctx.clip(); // Clip to planet circle

    // Draw grid
    this.ctx.strokeStyle = 'rgba(0, 85, 170, 0.2)';
    this.ctx.lineWidth = 1;

    // Vertical lines (Longitude) - rotating effect
    const rotation = progress * Math.PI;
    for (let i = 0; i < 8; i++) {
      const x = centerX + Math.cos(rotation + (i * Math.PI / 4)) * currentRadius;
      this.ctx.beginPath();
      this.ctx.ellipse(centerX, centerY, Math.abs(x - centerX), currentRadius, 0, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Horizontal lines (Latitude)
    for (let i = 1; i < 5; i++) {
      const y = centerY - currentRadius + (i * currentRadius * 2 / 5);
      this.ctx.beginPath();
      this.ctx.moveTo(centerX - currentRadius, y);
      this.ctx.lineTo(centerX + currentRadius, y);
      this.ctx.stroke();
    }

    this.ctx.restore();

    // Atmosphere glow
    this.ctx.shadowBlur = 20 * progress;
    this.ctx.shadowColor = 'rgba(0, 242, 255, 0.5)';
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

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
