export class Stage1_Charging {
  constructor(container, gameManager) {
    this.container = container;
    this.gameManager = gameManager;
    this.energy = 0;
    this.decayRate = 2; // % per second
    this.clickValue = 1.5; // % per click
    this.lastFrameTime = 0;
    this.isActive = false;
    this.particles = [];
  }

  init() {
    this.isActive = true;
    this.render();
    this.initParticles();
    this.attachEvents();
    this.loop = requestAnimationFrame(this.update.bind(this));
  }

  render() {
    this.container.innerHTML = `
      <div class="stage-charging">
        <canvas id="bg-canvas"></canvas>
        <div class="hud">
          <h1>ROCKET CHARGING</h1>
          <div class="energy-bar-container">
            <div class="energy-bar" id="energy-fill"></div>
          </div>
          <div class="energy-text" id="energy-text">0%</div>
        </div>
        
        <div class="rocket-container interactive" id="rocket">
          <!-- Real Geometric Rocket SVG -->
          <svg width="200" height="300" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Main Body -->
            <path d="M100 20 L130 80 L130 220 L100 240 L70 220 L70 80 Z" stroke="#0055aa" stroke-width="2" fill="#ffffff" />
            <path d="M100 20 L100 240" stroke="#0055aa" stroke-width="1" stroke-dasharray="4 2" />
            
            <!-- Fins -->
            <path d="M70 180 L40 240 L70 220" stroke="#0055aa" stroke-width="2" fill="#ffffff" />
            <path d="M130 180 L160 240 L130 220" stroke="#0055aa" stroke-width="2" fill="#ffffff" />
            
            <!-- Engine Nozzle -->
            <path d="M85 240 L75 260 L125 260 L115 240" stroke="#0055aa" stroke-width="2" fill="#ffffff" />
            
            <!-- Window -->
            <circle cx="100" cy="100" r="15" stroke="#00f2ff" stroke-width="2" fill="#ffffff" />
            <circle cx="100" cy="100" r="5" fill="#00f2ff" />
            
            <!-- Decorative Lines -->
            <path d="M70 120 L130 120" stroke="rgba(0, 85, 170, 0.3)" stroke-width="1" />
            <path d="M70 140 L130 140" stroke="rgba(0, 85, 170, 0.3)" stroke-width="1" />
          </svg>
        </div>
        
        <div class="instructions">CLICK TO CHARGE</div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .stage-charging {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        background: #f0f4f8;
        color: #333;
        font-family: 'Orbitron', sans-serif;
        position: relative;
        overflow: hidden;
      }
      #bg-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
      }
      .hud {
        position: absolute;
        top: 20px;
        text-align: center;
        width: 100%;
        z-index: 10;
      }
      .hud h1 {
        font-size: 1.5rem;
        color: #0055aa;
        margin-bottom: 10px;
      }
      .energy-bar-container {
        width: 300px;
        height: 10px;
        margin: 10px auto;
        background: rgba(0,0,0,0.1);
        border: 1px solid rgba(0, 100, 255, 0.3);
        border-radius: 5px;
        overflow: hidden;
      }
      .energy-bar {
        width: 0%;
        height: 100%;
        background-color: #00f2ff;
        box-shadow: 0 0 10px rgba(0, 242, 255, 0.5);
        transition: width 0.1s linear;
      }
      .energy-text {
        color: #0055aa;
        font-weight: bold;
        font-size: 1.2rem;
      }
      .rocket-container {
        transition: transform 0.1s;
        cursor: pointer;
        filter: drop-shadow(0 10px 20px rgba(0, 85, 170, 0.2));
        z-index: 5;
        animation: float-rocket 3s ease-in-out infinite;
      }
      @keyframes float-rocket {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .rocket-container:active {
        transform: scale(0.98);
      }
      .pulse {
        animation: pulse-animation 0.3s ease-out;
      }
      @keyframes pulse-animation {
        0% { filter: drop-shadow(0 0 0px rgba(0, 242, 255, 0)); }
        50% { filter: drop-shadow(0 0 20px rgba(0, 242, 255, 0.8)); }
        100% { filter: drop-shadow(0 0 0px rgba(0, 242, 255, 0)); }
      }
      .instructions {
        margin-top: 30px;
        color: #0055aa;
        font-size: 1rem;
        opacity: 0.8;
        animation: blink 2s infinite;
        z-index: 10;
      }
      @keyframes blink {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 0.4; }
      }
    `;
    this.container.appendChild(style);

    this.energyFill = document.getElementById('energy-fill');
    this.energyText = document.getElementById('energy-text');
    this.rocket = document.getElementById('rocket');
    this.canvas = document.getElementById('bg-canvas');
    this.ctx = this.canvas.getContext('2d');

    this.resizeCanvas();
    window.addEventListener('resize', this.resizeCanvas.bind(this));
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initParticles() {
    for (let i = 0; i < 100; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2,
        speedY: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
  }

  updateParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#0055aa';

    this.particles.forEach(p => {
      p.y -= p.speedY;
      if (p.y < 0) {
        p.y = this.canvas.height;
        p.x = Math.random() * this.canvas.width;
      }

      this.ctx.globalAlpha = p.opacity;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;
  }

  attachEvents() {
    this.rocket.addEventListener('click', () => {
      this.energy = Math.min(100, this.energy + this.clickValue);
      this.triggerVisualFeedback();

      // Check for completion
      if (this.energy >= 100) {
        this.energy = 100;
        this.completeStage();
      }
    });
  }

  triggerVisualFeedback() {
    this.rocket.classList.remove('pulse');
    void this.rocket.offsetWidth; // trigger reflow
    this.rocket.classList.add('pulse');
  }

  update(timestamp) {
    if (!this.isActive) return;

    if (!this.lastFrameTime) this.lastFrameTime = timestamp;
    const deltaTime = (timestamp - this.lastFrameTime) / 1000;
    this.lastFrameTime = timestamp;

    // Energy decay
    if (this.energy > 0) {
      this.energy = Math.max(0, this.energy - (this.decayRate * deltaTime));
    }

    // Update UI
    this.energyFill.style.width = `${Math.min(100, this.energy)}%`;
    this.energyText.textContent = `${Math.min(100, Math.round(this.energy))}%`;

    // Update Particles
    this.updateParticles();

    // Loop
    if (this.isActive) {
      this.loop = requestAnimationFrame(this.update.bind(this));
    }
  }

  completeStage() {
    this.isActive = false;
    cancelAnimationFrame(this.loop);
    window.removeEventListener('resize', this.resizeCanvas);
    this.gameManager.nextStage();
  }

  cleanup() {
    this.isActive = false;
    cancelAnimationFrame(this.loop);
    window.removeEventListener('resize', this.resizeCanvas);
  }
}
