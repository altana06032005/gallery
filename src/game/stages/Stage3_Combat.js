export class Stage3_Combat {
    constructor(container, gameManager) {
        this.container = container;
        this.gameManager = gameManager;
        this.enemiesDestroyed = 0;
        this.targetKills = 20;
        this.enemies = [];
        this.lastSpawnTime = 0;
        this.spawnInterval = 1500;
        this.projectiles = [];
        this.explosions = [];
        this.muzzleFlashes = [];

        // Для визуальных эффектов при нарушении линии
        this.flashRed = false;
        this.flashRedTimer = 0;
        this.minusOneText = null;
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
        <div class="cockpit-overlay">
           <svg width="100%" height="100%" preserveAspectRatio="none">
             <path d="M0 100% L200 100% L100 80% Z" fill="rgba(0, 85, 170, 0.1)" stroke="#0055aa" stroke-width="2"/>
             <path d="M100% 100% Lcalc(100% - 200px) 100% Lcalc(100% - 100px) 80% Z" fill="rgba(0, 85, 170, 0.1)" stroke="#0055aa" stroke-width="2"/>
             <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#0055aa" stroke-width="1" stroke-dasharray="5,5" opacity="0.3"/>
             <circle cx="50%" cy="50%" r="20" stroke="#e74c3c" stroke-width="2" fill="none"/>
           </svg>
        </div>
      </div>
    `;
        const style = document.createElement('style');
        style.textContent = `
      .stage-combat { width: 100%; height: 100%; position: relative; cursor: crosshair; background: #f0f4f8; }
      #combat-canvas { width: 100%; height: 100%; }
      .hud { position: absolute; top: 20px; width: 100%; text-align: center; pointer-events: none; z-index: 20; }
      .hud h1 { font-size: 1.5rem; color: #0055aa; margin-bottom: 5px; font-family: 'Orbitron', sans-serif; }
      .status-text { color: #0055aa; font-family: 'Orbitron', sans-serif; font-size: 1rem; opacity: 0.8; }
      .progress { color: #333; font-weight: bold; margin-top: 5px; }
      .cockpit-overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10; }
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
            startY: this.canvas.height,
            endX: x,
            endY: y,
            progress: 0
        });

        this.muzzleFlashes.push({ x: this.canvas.width / 2, y: this.canvas.height, size: 30, alpha: 1 });

        // Check hits
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const dx = x - enemy.x;
            const dy = y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < enemy.size) {
                enemy.hp--;
                enemy.hitFlash = 5;
                if (enemy.hp <= 0) this.destroyEnemy(i);
                break;
            }
        }
    }

    destroyEnemy(index) {
        const enemy = this.enemies[index];
        this.enemies.splice(index, 1);
        this.enemiesDestroyed++;
        this.killCountEl.textContent = this.enemiesDestroyed;

        this.explosions.push({ x: enemy.x, y: enemy.y, radius: 1, maxRadius: enemy.size * 2, alpha: 1 });

        if (this.enemiesDestroyed >= this.targetKills) setTimeout(() => this.completeStage(), 1000);
    }

    spawnEnemy() {
        const type = Math.random();
        let hp = 1, size = 30, color = '#0055aa', speed = 2 + Math.random() * 2, enemyType = 'scout';
        if (type > 0.9) { hp = 3; size = 50; color = '#e74c3c'; speed = 0.5; enemyType = 'boss'; }
        else if (type > 0.6) { hp = 2; size = 40; color = '#333333'; speed = 0.8; enemyType = 'fighter'; }

        this.enemies.push({
            x: Math.random() * (this.canvas.width - 100) + 50,
            y: -50,
            size, hp, maxHp: hp, color, speed, hitFlash: 0, type: enemyType, crossedTerritory: false
        });
    }

    drawEnemyShip(ctx, enemy) {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        ctx.scale(enemy.size / 30, enemy.size / 30);
        ctx.strokeStyle = enemy.hitFlash > 0 ? '#00f2ff' : enemy.color;
        ctx.lineWidth = 2;
        ctx.fillStyle = enemy.hitFlash > 0 ? 'rgba(0, 242, 255, 0.5)' : '#ffffff';

        ctx.beginPath();
        if (enemy.type === 'boss') { ctx.moveTo(0, 20); ctx.lineTo(15, 0); ctx.lineTo(25, -10); ctx.lineTo(10, -20); ctx.lineTo(-10, -20); ctx.lineTo(-25, -10); ctx.lineTo(-15, 0); ctx.closePath(); ctx.moveTo(0, 0); ctx.lineTo(0, -15); }
        else if (enemy.type === 'fighter') { ctx.moveTo(0, 15); ctx.lineTo(10, -5); ctx.lineTo(20, -10); ctx.lineTo(5, -15); ctx.lineTo(-5, -15); ctx.lineTo(-20, -10); ctx.lineTo(-10, -5); ctx.closePath(); }
        else { ctx.moveTo(0, 15); ctx.lineTo(10, -15); ctx.lineTo(0, -5); ctx.lineTo(-10, -15); ctx.closePath(); }

        ctx.fill(); ctx.stroke(); ctx.restore();
    }

    update(timestamp) {
        // Спавн врагов
        if (this.enemiesDestroyed >= this.targetKills && this.enemies.length === 0) { }
        else if (timestamp - this.lastSpawnTime > this.spawnInterval && this.enemiesDestroyed + this.enemies.length < this.targetKills) {
            this.spawnEnemy();
            this.lastSpawnTime = timestamp;
            this.spawnInterval = Math.max(500, this.spawnInterval - 10);
        }

        // Очистка канваса
        this.ctx.fillStyle = '#f0f4f8';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Фоновые звёзды
        this.ctx.fillStyle = 'rgba(0, 85, 170, 0.3)';
        for (let i = 0; i < 50; i++)
            this.ctx.fillRect(Math.random() * this.canvas.width, Math.random() * this.canvas.height, 2, 2);

        // Обновление врагов
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.y += enemy.speed * 1.5;

            // Проверка пересечения линии
            if (!enemy.crossedTerritory && enemy.y >= this.canvas.height / 2) {
                enemy.crossedTerritory = true;
                this.enemies.splice(i, 1);
                this.flashRed = true;
                this.flashRedTimer = 60;

                this.minusOneText = { x: this.canvas.width / 2, y: this.canvas.height / 2, alpha: 1 };

                this.enemiesDestroyed = Math.max(0, this.enemiesDestroyed - 1);
                this.killCountEl.textContent = this.enemiesDestroyed;
                continue;
            }

            this.drawEnemyShip(this.ctx, enemy);
            if (enemy.hitFlash > 0) enemy.hitFlash--;

            // Стрельба врагов
            if (Math.random() < 0.02) {
                this.projectiles.push({
                    startX: enemy.x,
                    startY: enemy.y - enemy.speed, // снаряд начинается чуть вперед по траектории
                    endX: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
                    endY: this.canvas.height,
                    progress: 0,
                    isEnemy: true
                });

                this.muzzleFlashes.push({ x: enemy.x, y: enemy.y + 20, size: 15, alpha: 1, color: '#e74c3c' });
            }

            if (enemy.y > this.canvas.height + 50) this.enemies.splice(i, 1);
        }

        // Анимация снарядов
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.progress += 0.09;
            const currentX = p.startX + (p.endX - p.startX) * p.progress;
            const currentY = p.startY + (p.endY - p.startY) * p.progress;

            this.ctx.beginPath();
            if (p.isEnemy) {
                // Вражеский выстрел: пунктир
                this.ctx.moveTo(p.startX, p.startY);
                this.ctx.lineTo(currentX, currentY);
                this.ctx.setLineDash([10, 10]);
                this.ctx.strokeStyle = '#e74c3c';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            } else {
                // Выстрел игрока: плазменный болт
                const tailLength = 30;
                const angle = Math.atan2(p.endY - p.startY, p.endX - p.startX);
                const tailX = currentX - Math.cos(angle) * tailLength;
                const tailY = currentY - Math.sin(angle) * tailLength;

                this.ctx.moveTo(tailX, tailY);
                this.ctx.lineTo(currentX, currentY);

                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00f2ff';
                this.ctx.strokeStyle = '#00f2ff';
                this.ctx.lineWidth = 4;
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
            }

            if (p.progress >= 1) this.projectiles.splice(i, 1);
        }

        // Muzzle flashes
        for (let i = this.muzzleFlashes.length - 1; i >= 0; i--) {
            const flash = this.muzzleFlashes[i];
            flash.alpha -= 0.2;
            this.ctx.save();
            this.ctx.globalAlpha = flash.alpha;
            this.ctx.fillStyle = flash.color || '#00f2ff';
            this.ctx.beginPath();
            this.ctx.arc(flash.x, flash.y, flash.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            if (flash.alpha <= 0) this.muzzleFlashes.splice(i, 1);
        }

        // Взрывы
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const exp = this.explosions[i];
            exp.radius += 2;
            exp.alpha -= 0.05;
            this.ctx.beginPath();
            this.ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(0, 85, 170, ${exp.alpha})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            if (exp.alpha <= 0) this.explosions.splice(i, 1);
        }

        // Красная территория при нарушении линии
        if (this.flashRed) {
            this.ctx.fillStyle = 'rgba(255,0,0,0.3)';
            this.ctx.fillRect(0, this.canvas.height / 2 - 2, this.canvas.width, 4);
            this.flashRedTimer--;
            if (this.flashRedTimer <= 0) this.flashRed = false;
        }

        // Появление "-1"
        if (this.minusOneText) {
            this.ctx.globalAlpha = this.minusOneText.alpha;
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = '30px Orbitron';
            this.ctx.fillText('-1', this.minusOneText.x, this.minusOneText.y);
            this.minusOneText.alpha -= 0.02;
            this.ctx.globalAlpha = 1;
            if (this.minusOneText.alpha <= 0) this.minusOneText = null;
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
        if (this.canvas) this.canvas.removeEventListener('mousedown', this.handleClick);
    }
}

