export class Stage1_Charging {
  constructor(container, gameManager) {
    this.container = container;
    this.gameManager = gameManager;
    this.energy = 0;
    this.decayRate = 2; // % per second
    this.clickValue = 1.5; // % per click
    this.lastFrameTime = 0;
    this.isActive = false;
  }

  init() {
    this.isActive = true;
    this.render();
    this.attachEvents();
    this.loop = requestAnimationFrame(this.update.bind(this));
  }

  render() {
    this.container.innerHTML = `
      <div class="stage-charging">
        <div class="hud">
          <h1>ROCKET CHARGING</h1>
          <div class="energy-bar-container glow-box">
            <div class="energy-bar" id="energy-fill"></div>
          </div>
          <div class="energy-text" id="energy-text">0%</div>
        </div>
        
        <div class="rocket-container interactive" id="rocket">
          <svg width="200" height="300" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 L20 80 L20 120 L50 110 L80 120 L80 80 Z" stroke="var(--neon-cyan)" stroke-width="2" fill="transparent" />
            <path d="M50 10 L50 110" stroke="var(--neon-cyan)" stroke-width="1" />
            <circle cx="50" cy="50" r="10" stroke="var(--neon-magenta)" stroke-width="2" />
          </svg>
        </div>
        
        <div class="instructions glow-text">CLICK TO CHARGE</div>
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
      }
      .hud {
        position: absolute;
        top: 20px;
        text-align: center;
        width: 100%;
      }
      .energy-bar-container {
        width: 300px;
        height: 20px;
        margin: 10px auto;
        background: rgba(0,0,0,0.5);
        position: relative;
      }
      .energy-bar {
        width: 0%;
        height: 100%;
        background-color: var(--neon-cyan);
        box-shadow: 0 0 10px var(--neon-cyan);
        transition: width 0.1s linear;
      }
      .rocket-container {
        transition: transform 0.1s;
        cursor: pointer;
      }
      .rocket-container:active {
        transform: scale(0.95);
      }
      .pulse {
        animation: pulse-animation 0.5s ease-out;
      }
      @keyframes pulse-animation {
        0% { filter: drop-shadow(0 0 0px var(--neon-magenta)); }
        50% { filter: drop-shadow(0 0 20px var(--neon-magenta)); }
        100% { filter: drop-shadow(0 0 0px var(--neon-magenta)); }
      }
    `;
    this.container.appendChild(style);

    this.energyFill = document.getElementById('energy-fill');
    this.energyText = document.getElementById('energy-text');
    this.rocket = document.getElementById('rocket');
  }

  attachEvents() {
    this.rocket.addEventListener('click', () => {
      this.energy = Math.min(100, this.energy + this.clickValue);
      this.triggerVisualFeedback();
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
    const deltaTime = (timestamp - this.lastFrameTime) / 1000; // в секундах
    this.lastFrameTime = timestamp;

    // Энергия уменьшается со временем
    if (this.energy > 0) {
      this.energy = Math.max(0, this.energy - (this.decayRate * deltaTime));
    }

    // Обновление UI
    this.energyFill.style.width = `${Math.min(100, this.energy)}%`;
    this.energyText.textContent = `${Math.min(100, Math.round(this.energy))}%`;

    // Продолжаем цикл
    if (this.isActive) {
      this.loop = requestAnimationFrame(this.update.bind(this));
    }
  }

  attachEvents() {
    this.rocket.addEventListener('click', () => {
      this.energy = Math.min(100, this.energy + this.clickValue);
      this.triggerVisualFeedback();

      // Проверка на 100% после клика
      if (this.energy >= 100) {
        this.energy = 100; // фиксируем
        this.completeStage();
      }
    });
  }



  completeStage() {
    this.isActive = false;
    cancelAnimationFrame(this.loop);

    console.log('🚀 ROCKET CHARGED!');
    console.log('gameManager:', this.gameManager);
    console.log('nextStage type:', this.gameManager?.nextStage);

    if (this.gameManager && typeof this.gameManager.nextStage === 'function') {
      this.gameManager.nextStage();
    } else {
      console.error('gameManager.nextStage() не найден!');
    }
  }


  cleanup() {
    this.isActive = false;
    cancelAnimationFrame(this.loop);
  }
}
