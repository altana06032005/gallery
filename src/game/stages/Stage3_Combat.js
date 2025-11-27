export class Stage3_Combat {
    constructor(container, gameManager) {
        this.container = container;
        this.gameManager = gameManager;
        this.enemiesDestroyed = 0;
        this.targetKills = 20; // Reduced for demo, user asked for 50-150 clicks, maybe 20 enemies * 2-3 clicks = 40-60 clicks
        this.enemies = [];
        this.lastSpawnTime = 0;
        this.spawnInterval = 1500;
        this.projectiles = [];
        this.explosions = [];
    }

    init() {
        this.render();
        this.canvas = document.getElementById('combat-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas.bind(this));

        this.canvas.addEventListener('mousedown', this.handleClick.bind(this));

        this.loop = requestAnimationFrame(this.update.bind(this));
    }

    render() {
        this.container.innerHTML = `
      <div class="stage-combat">
        <canvas id="combat-canvas"></canvas>
        <div class="hud">
          <h1>COMBAT MODE</h1>
          <div class="status-text">DEFEND THE SHIP</div>
          <div class="progress">ENEMIES DESTROYED: <span id="kill-count">0</span>/${this.targetKills}</div>
        </div>
        <!-- Cockpit Overlay -->
        <div class="cockpit-overlay">
           <svg width="100%" height="100%" preserveAspectRatio="none">
             <path d="M0 100% L200 100% L100 80% Z" fill="rgba(0, 243, 255, 0.1)" stroke="var(--neon-cyan)" stroke-width="2"/>
             <path d="M100% 100% Lcalc(100% - 200px) 100% Lcalc(100% - 100px) 80% Z" fill="rgba(0, 243, 255, 0.1)" stroke="var(--neon-cyan)" stroke-width="2"/>
             <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--neon-cyan)" stroke-width="1" stroke-dasharray="5,5" opacity="0.3"/>
             <circle cx="50%" cy="50%" r="20" stroke="var(--neon-magenta)" stroke-width="2" fill="none"/>
           </svg>
        </div>
      </div>
    `;

        const style = document.createElement('style');
        style.textContent = `
      .stage-combat {
        width: 100%;
        height: 100%;
        position: relative;
        cursor: crosshair;
      }
      #combat-canvas {
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
        z-index: 20;
      }
      .cockpit-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10;
      }
    `;
        this.container.appendChild(style);
        this.killCountEl = document.getElementById('kill-count');
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Visual feedback for shooting
        this.projectiles.push({
            startX: this.canvas.width / 2,
            startY: this.canvas.height, // From bottom center
            endX: x,
            endY: y,
            progress: 0
        });

        // Check hits
        // Iterate backwards to remove
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const dx = x - enemy.x;
            const dy = y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < enemy.size) {
                enemy.hp--;
                enemy.hitFlash = 5; // Frames to flash
                if (enemy.hp <= 0) {
                    this.destroyEnemy(i);
                }
                break; // Hit one at a time
            }
        }
    }

    destroyEnemy(index) {
        const enemy = this.enemies[index];
        this.enemies.splice(index, 1);
        this.enemiesDestroyed++;
        this.killCountEl.textContent = this.enemiesDestroyed;

        // Explosion effect
        this.explosions.push({
            x: enemy.x,
            y: enemy.y,
            radius: 1,
            maxRadius: enemy.size * 2,
            alpha: 1
        });

        if (this.enemiesDestroyed >= this.targetKills) {
            setTimeout(() => this.completeStage(), 1000);
        }
    }

    spawnEnemy() {
        const type = Math.random();
        let hp = 1;
        let size = 30;
        let color = '#00f3ff'; // Cyan
        let speed = 1 + Math.random();

        if (type > 0.9) { // Boss/Rare
            hp = 3;
            size = 50;
            color = '#ff00ff'; // Magenta
            speed = 0.5;
        } else if (type > 0.6) { // Stronger
            hp = 2;
            size = 40;
            color = '#ffffff'; // White
            speed = 0.8;
        }

        this.enemies.push({
            x: Math.random() * (this.canvas.width - 100) + 50,
            y: -50, // Start above screen
            size: size,
            hp: hp,
            maxHp: hp,
            color: color,
            speed: speed,
            hitFlash: 0
        });
    }

    update(timestamp) {
        if (this.enemiesDestroyed >= this.targetKills && this.enemies.length === 0) {
            // Waiting for completion timeout
            // Continue rendering explosions/projectiles
        } else if (timestamp - this.lastSpawnTime > this.spawnInterval && this.enemiesDestroyed + this.enemies.length < this.targetKills) {
            this.spawnEnemy();
            this.lastSpawnTime = timestamp;
            // Decrease interval slightly to increase difficulty
            this.spawnInterval = Math.max(500, this.spawnInterval - 10);
        }

        // Clear
        this.ctx.fillStyle = '#050505';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Stars (Background) - Simplified from Stage 2
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (let i = 0; i < 50; i++) {
            this.ctx.fillRect(Math.random() * this.canvas.width, Math.random() * this.canvas.height, 1, 1);
        }

        // Update and Draw Enemies
        this.enemies.forEach(enemy => {
            enemy.y += enemy.speed;

            // Draw Enemy
            this.ctx.save();
            this.ctx.translate(enemy.x, enemy.y);
            this.ctx.beginPath();
            if (enemy.maxHp === 3) { // Diamond
                this.ctx.moveTo(0, -enemy.size);
                this.ctx.lineTo(enemy.size, 0);
                this.ctx.lineTo(0, enemy.size);
                this.ctx.lineTo(-enemy.size, 0);
            } else if (enemy.maxHp === 2) { // Triangle
                this.ctx.moveTo(0, -enemy.size);
                this.ctx.lineTo(enemy.size, enemy.size);
                this.ctx.lineTo(-enemy.size, enemy.size);
            } else { // Circle/Basic
                this.ctx.arc(0, 0, enemy.size, 0, Math.PI * 2);
            }
            this.ctx.closePath();

            this.ctx.strokeStyle = enemy.hitFlash > 0 ? '#ffffff' : enemy.color;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Inner fill for hit flash
            if (enemy.hitFlash > 0) {
                this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
                this.ctx.fill();
                enemy.hitFlash--;
            }

            this.ctx.restore();

            // Reset if off screen (player missed) - for now just respawn at top or let it pass
            if (enemy.y > this.canvas.height + 50) {
                enemy.y = -50;
                enemy.x = Math.random() * (this.canvas.width - 100) + 50;
            }
        });

        // Update and Draw Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.progress += 0.1;

            const currentX = p.startX + (p.endX - p.startX) * p.progress;
            const currentY = p.startY + (p.endY - p.startY) * p.progress;

            this.ctx.beginPath();
            this.ctx.moveTo(p.startX, p.startY); // Beam style
            this.ctx.lineTo(currentX, currentY);
            this.ctx.strokeStyle = `rgba(0, 243, 255, ${1 - p.progress})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            if (p.progress >= 1) {
                this.projectiles.splice(i, 1);
            }
        }

        // Update and Draw Explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const exp = this.explosions[i];
            exp.radius += 2;
            exp.alpha -= 0.05;

            this.ctx.beginPath();
            this.ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(255, 0, 255, ${exp.alpha})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            if (exp.alpha <= 0) {
                this.explosions.splice(i, 1);
            }
        }

        this.loop = requestAnimationFrame(this.update.bind(this));
    }

    completeStage() {
        cancelAnimationFrame(this.loop);
        window.removeEventListener('resize', this.resizeCanvas);
        this.canvas.removeEventListener('mousedown', this.handleClick);
        alert('SECTOR CLEAR. LANDING SEQUENCE INITIATED.');
        this.gameManager.nextStage();
    }

    cleanup() {
        cancelAnimationFrame(this.loop);
        window.removeEventListener('resize', this.resizeCanvas);
        if (this.canvas) {
            this.canvas.removeEventListener('mousedown', this.handleClick);
        }
    }
}
