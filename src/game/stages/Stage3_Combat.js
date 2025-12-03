export class Stage3_Combat {
    constructor(container, gameManager) {
        this.container = container;
        this.gameManager = gameManager;
        this.canvas = null;
        this.ctx = null;

        // Game State
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.buildings = []; // Back to buildings
        this.floatingTexts = []; // For coin feedback

        this.score = 0;
        this.money = 0;
        this.kills = 0;
        this.targetKills = 130;

        this.maxHP = 5;
        this.hp = 5;

        this.weaponLevel = 1;
        this.weaponDamage = 1;
        this.upgradeCost = 70;

        this.spawnTimer = 0;
        this.spawnInterval = 30;

        this.gunRecoil = 0;
        this.roadZ = 0; // For scrolling

        this.isGameOver = false;
        this.loop = null;

        // Bind methods
        this.handleClick = this.handleClick.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.restartGame = this.restartGame.bind(this);
    }

    init() {
        this.container.innerHTML = '';
        this.isGameOver = false;

        // Reset State
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.floatingTexts = [];
        this.buildings = [];
        this.kills = 0;
        this.money = 0; // Reset money on restart
        this.hp = this.maxHP;
        this.spawnInterval = 60;
        // RESET WEAPON
        this.weaponLevel = 1;
        this.weaponDamage = 1;
        this.upgradeCost = 70;
        this.gunRecoil = 0;


        // Create Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'combat-canvas';
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        // Create UI Layer
        const uiLayer = document.createElement('div');
        uiLayer.className = 'combat-ui';
        uiLayer.innerHTML = `
            <div class="top-hud">
                <div class="hud-group left">
                    <div class="hud-label">HP</div>
                    <div class="hp-bar"><div id="hp-fill" style="width:100%"></div></div>
                </div>
                
                <div class="hud-group center">
                    <div class="coin-display">
                        <div class="coin-icon">$</div>
                        <span id="money-display">${this.money}</span>
                    </div>
                    <button id="upgrade-btn" class="shop-btn interactive" disabled>
                        <div class="shop-icon">🔫</div>
                        <div class="shop-text">
                            UPGRADE<br>
                            <span id="upgrade-cost">$${this.upgradeCost}</span>
                        </div>
                    </button>
                </div>

                <div class="hud-group right">
                    <div class="hud-label">KILLS</div>
                    <div class="kill-count"><span id="score-display">0</span>/${this.targetKills}</div>
                </div>
            </div>
            
            <div class="center-message" id="center-message">TAP TO FIRE!</div>
            
            <div id="game-over-screen" class="game-over-screen" style="display: none;">
                <h1>MISSION FAILED</h1>
                <button id="retry-btn" class="retry-btn interactive">RETRY SECTOR</button>
            </div>
        `;
        this.container.appendChild(uiLayer);

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            .combat-ui {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                pointer-events: none;
                font-family: 'Orbitron', sans-serif;
                color: #FFF;
                text-shadow: 0 0 5px #FFF;
                user-select: none;
                -webkit-user-select: none;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: hidden;
            }

            /* --- TOP HUD --- */
            .top-hud {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 15px 20px;
                padding-top: max(15px, env(safe-area-inset-top));
                background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
                z-index: 10;
                pointer-events: auto; /* Enable clicks for top bar */
            }
            .hud-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .hud-group.center {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                top: max(15px, env(safe-area-inset-top));
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .hud-label {
                font-size: 0.9rem;
                color: #AAA;
            }
            .hp-bar {
                width: 120px; height: 12px;
                border: 2px solid #FFF;
                background: rgba(0,0,0,0.5);
                position: relative;
            }
            #hp-fill {
                height: 100%;
                background: #F00;
                transition: width 0.2s;
            }
            .coin-display {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(0,0,0,0.6);
                padding: 5px 15px;
                border-radius: 20px;
                border: 1px solid #555;
            }
            .coin-icon {
                width: 24px; height: 24px;
                border: 2px solid #FFD700;
                color: #FFD700;
                border-radius: 50%;
                display: flex; justify-content: center; align-items: center;
                font-weight: bold;
                font-size: 14px;
                box-shadow: 0 0 5px #FFD700;
            }
            #money-display {
                font-size: 1.2rem;
                color: #FFD700;
            }
            .kill-count {
                font-size: 1.2rem;
            }

            /* --- SHOP BUTTON (Now in Top HUD) --- */
            .shop-btn {
                background: rgba(0,0,0,0.8);
                border: 2px solid #FFF;
                color: #FFF;
                padding: 5px 15px;
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                box-shadow: 0 0 10px rgba(255,255,255,0.3);
                transition: all 0.2s;
                border-radius: 8px;
            }
            .shop-btn:active { transform: scale(0.95); background: #222; }
            .shop-btn:disabled { opacity: 0.5; border-color: #555; color: #777; box-shadow: none; }
            .shop-icon { font-size: 1.2rem; }
            .shop-text { text-align: left; font-size: 0.7rem; line-height: 1.2; }
            #upgrade-cost { color: #FFD700; font-weight: bold; }

            /* --- CENTER MESSAGE --- */
            .center-message {
                position: absolute; top: 35%; width: 100%;
                text-align: center; font-size: 2rem;
                animation: blink 2s infinite;
                pointer-events: none;
            }

            /* --- GAME OVER --- */
            .game-over-screen {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.85);
                display: flex; flex-direction: column;
                justify-content: center; align-items: center;
                pointer-events: auto;
                z-index: 100;
            }
            .retry-btn {
                background: #F00; color: #FFF; border: 2px solid #FFF;
                padding: 15px 40px; font-size: 1.5rem; font-family: inherit;
                cursor: pointer; margin-top: 30px;
                box-shadow: 0 0 20px #F00;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            .retry-btn:hover { background: #D00; transform: scale(1.05); }

            @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
            
            /* --- RESPONSIVE BREAKPOINTS --- */

            /* Mobile (up to 600px) */
            @media (max-width: 600px) {
                .top-hud {
                    padding: 10px;
                    padding-top: max(10px, env(safe-area-inset-top));
                    font-size: 0.8rem;
                    flex-wrap: wrap;
                }
                .hud-group.center {
                    position: static;
                    transform: none;
                    width: 100%;
                    justify-content: center;
                    order: 3;
                    margin-top: 5px;
                }
                .hp-bar { width: 80px; height: 8px; }
                .hud-label { display: none; }
                
                .shop-btn {
                    padding: 5px 10px;
                }
                .shop-icon { font-size: 1rem; }
                .shop-text { font-size: 0.7rem; }
                
                .center-message { font-size: 1.2rem; }
            }

            /* Tablet (601px - 1024px) */
            @media (min-width: 601px) and (max-width: 1024px) {
                .top-hud { padding: 20px; }
                .hp-bar { width: 150px; }
            }

            /* Desktop (1025px+) */
            @media (min-width: 1025px) {
                .top-hud { padding: 30px; font-size: 1.2rem; }
                .hp-bar { width: 200px; height: 15px; }
                .shop-btn { padding: 8px 20px; }
                .shop-icon { font-size: 1.5rem; }
                .shop-text { font-size: 0.9rem; }
            }
        `;
        this.container.appendChild(style);

        // Elements
        this.hpFill = document.getElementById('hp-fill');
        this.scoreDisplay = document.getElementById('score-display');
        this.moneyDisplay = document.getElementById('money-display');
        this.upgradeBtn = document.getElementById('upgrade-btn');
        this.upgradeCostDisplay = document.getElementById('upgrade-cost');
        this.upgradeCostDisplay.textContent = '$' + this.upgradeCost;
        this.centerMessage = document.getElementById('center-message');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.retryBtn = document.getElementById('retry-btn');

        this.upgradeBtn.onclick = (e) => {
            e.stopPropagation();
            this.buyUpgrade();
        };

        this.retryBtn.onclick = (e) => {
            e.stopPropagation();
            this.restartGame();
        };

        // Init Background Buildings
        for (let i = 0; i < 40; i++) {
            this.buildings.push(this.createBuilding(true));
        }

        // Events
        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas);
        this.canvas.addEventListener('mousedown', this.handleClick);
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleClick(e.touches[0]);
        }, { passive: false });

        // Start Loop
        this.loop = requestAnimationFrame(this.update.bind(this));

        // Hide message after 3s
        setTimeout(() => { if (this.centerMessage) this.centerMessage.style.display = 'none'; }, 3000);

        this.checkUpgradeAvailability();
        this.upgradeBtn.classList.add('interactive')
        this.moneyDisplay.parentElement.classList.add('interactive');
    }

    createBuilding(randomZ = false) {
        const side = Math.random() > 0.5 ? 1 : -1;
        const x = side * (200 + Math.random() * 800);
        const z = randomZ ? Math.random() * 2000 : 2000;
        return {
            x: x,
            z: z,
            w: 100 + Math.random() * 200,
            h: 200 + Math.random() * 500
        };
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleClick(e) {
        if (this.isGameOver) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Fire
        this.fireShot(x, y);

        // Enemy Hit Check (Raycast approximation for 3D)
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            const scale = 800 / (800 + e.z);
            const screenX = this.canvas.width / 2 + e.x * scale;
            const screenY = this.canvas.height / 2 + e.y * scale;
            const size = e.size * scale;

            // Hitbox slightly larger
            const dx = x - screenX;
            const dy = y - screenY;
            if (dx * dx + dy * dy < (size / 2 + 20) ** 2) {
                this.damageEnemy(e, i);
                break;
            }
        }
    }

    fireShot(targetX, targetY) {
        this.gunRecoil = 15;
        this.particles.push({ type: 'muzzle', life: 5 });

        // Weapon Visuals based on Level
        let width = 2 + this.weaponLevel;
        let color = '#FFF';
        if (this.weaponLevel >= 3) color = '#0FF'; // Cyan
        if (this.weaponLevel >= 5) color = '#F0F'; // Magenta
        if (this.weaponLevel >= 8) color = '#FFD700'; // Gold

        this.projectiles.push({
            x: targetX,
            y: targetY,
            life: 10,
            width: width,
            color: color
        });
    }

    damageEnemy(enemy, index) {
        enemy.hp -= this.weaponDamage;
        enemy.flash = 5;

        // Hit particles at screen position
        const scale = 800 / (800 + enemy.z);
        const screenX = this.canvas.width / 2 + enemy.x * scale;
        const screenY = this.canvas.height / 2 + enemy.y * scale;

        for (let i = 0; i < 5; i++) {
            this.particles.push({
                type: 'spark',
                x: screenX,
                y: screenY,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 20
            });
        }

        if (enemy.hp <= 0) {
            this.killEnemy(enemy, index);
        }
    }

    killEnemy(enemy, index) {
        // Get screen pos for floating text
        const scale = 800 / (800 + enemy.z);
        const screenX = this.canvas.width / 2 + enemy.x * scale;
        const screenY = this.canvas.height / 2 + enemy.y * scale;

        this.enemies.splice(index, 1);
        this.kills++;
        this.scoreDisplay.textContent = this.kills;

        // Instant Money
        const reward = 1 + Math.floor(Math.random() * 3);
        this.money += reward;
        this.moneyDisplay.textContent = this.money;
        this.checkUpgradeAvailability();

        // Floating Text
        this.floatingTexts.push({
            x: screenX,
            y: screenY,
            text: `+$${reward}`,
            life: 60,
            vy: -2
        });

        // Win Condition
        if (this.kills >= this.targetKills) {
            this.completeStage();
        }
    }

    buyUpgrade() {
        if (this.money >= this.upgradeCost) {
            this.money -= this.upgradeCost;
            this.weaponLevel++;
            this.weaponDamage++;
            this.upgradeCost += 50;

            this.moneyDisplay.textContent = this.money;
            this.upgradeCostDisplay.textContent = '$' + this.upgradeCost;

            this.checkUpgradeAvailability();
        }
    }

    checkUpgradeAvailability() {
        this.upgradeBtn.disabled = this.money < this.upgradeCost;
    }

    spawnEnemy() {
        const isBoss = this.kills > 0 && this.kills % 50 === 0 && !this.enemies.some(e => e.type === 'boss');

        let type = 'scout';
        let size = 60;
        let hp = 1 + Math.floor(this.kills / 20);
        let speed = 5 + (this.kills * 0.05);

        if (isBoss) {
            type = 'boss';
            size = 150;
            hp = 20 + (this.kills / 10);
            speed = 2;
        } else if (Math.random() > 0.8) {
            type = 'fighter';
            size = 80;
            hp *= 2;
            speed *= 0.8;
        }

        this.enemies.push({
            x: (Math.random() - 0.5) * 800,
            y: 100, // Slightly above ground
            z: 2000, // Start far away
            type, size, hp, maxHp: hp, speed,
            flash: 0,
            wobbleOffset: Math.random() * Math.PI * 2
        });
    }

    takeDamage() {
        this.hp--;
        this.hpFill.style.width = `${(this.hp / this.maxHP) * 100}%`;

        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0'; flash.style.left = '0';
        flash.style.width = '100%'; flash.style.height = '100%';
        flash.style.background = 'rgba(255,0,0,0.3)';
        flash.style.pointerEvents = 'none';
        this.container.appendChild(flash);
        setTimeout(() => flash.remove(), 200);

        if (this.hp <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        this.isGameOver = true;
        this.gameOverScreen.style.display = 'flex';
    }

    restartGame() {
        this.init();
    }

    completeStage() {
        this.isGameOver = true;
        cancelAnimationFrame(this.loop);
        alert("SECTOR CLEARED! PROCEEDING TO LANDING.");
        this.gameManager.nextStage();
    }

    update() {
        if (this.isGameOver) return;

        // Clear (Black Background)
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const fov = 800;

        // 1. Draw Starfield
        this.ctx.fillStyle = '#FFF';
        for (let i = 0; i < 50; i++) {
            const x = (Math.sin(i * 132 + Date.now() * 0.0001) * this.canvas.width + this.canvas.width) % this.canvas.width;
            const y = (Math.cos(i * 453 + Date.now() * 0.0001) * this.canvas.height / 2);
            this.ctx.fillRect(x, y, 1, 1);
        }

        // 2. Draw City (Perspective)
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 1;

        // Road Grid
        this.roadZ -= 10;
        if (this.roadZ < 0) this.roadZ += 100;

        // Horizon
        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(this.canvas.width, centerY);
        this.ctx.stroke();

        // Moving floor lines
        for (let z = this.roadZ; z < 2000; z += 100) {
            const scale = fov / (fov + z);
            const y = centerY + 200 * scale;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.globalAlpha = 1 - (z / 2000);
            this.ctx.stroke();
        }

        // Vertical lines
        for (let x = -1000; x <= 1000; x += 200) {
            const scale1 = fov / (fov + 0);
            const x1 = centerX + x * scale1;
            const y1 = centerY + 200 * scale1;

            const scale2 = fov / (fov + 2000);
            const x2 = centerX + x * scale2;
            const y2 = centerY + 200 * scale2;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.globalAlpha = 0.3;
            this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1;

        // Buildings
        this.buildings.forEach(b => {
            b.z -= 10;
            if (b.z < -fov) b.z = 2000;

            if (b.z > 0) {
                const scale = fov / (fov + b.z);
                const bx = centerX + b.x * scale;
                const by = centerY + 200 * scale;
                const bw = b.w * scale;
                const bh = b.h * scale;

                this.ctx.strokeRect(bx - bw / 2, by - bh, bw, bh);
                this.ctx.beginPath();
                this.ctx.moveTo(bx - bw / 2, by - bh);
                this.ctx.lineTo(bx - bw / 2 + bw / 4, by - bh - bh / 4);
                this.ctx.stroke();
            }
        });

        // 3. Game Logic
        this.spawnTimer++;
        if (this.spawnTimer > this.spawnInterval) {
            this.spawnEnemy();
            this.spawnTimer = 0;
            if (this.spawnInterval > 20) this.spawnInterval -= 0.1;
        }

        // Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            e.z -= e.speed;
            e.x += Math.sin(Date.now() * 0.002 + e.wobbleOffset) * 2;

            if (e.flash > 0) e.flash--;

            if (e.z > 0) {
                const scale = fov / (fov + e.z);
                const ex = centerX + e.x * scale;
                const ey = centerY + e.y * scale;
                const size = e.size * scale;

                this.ctx.save();
                this.ctx.translate(ex, ey);

                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = '#FFF';
                this.ctx.fillStyle = e.flash > 0 ? '#F00' : '#000';
                this.ctx.strokeStyle = '#FFF';
                this.ctx.lineWidth = 2;

                this.ctx.beginPath();
                if (e.type === 'boss') {
                    this.ctx.rect(-size / 2, -size / 2, size, size);
                    this.ctx.rect(-size / 4, -size, size / 2, size / 2);
                } else {
                    this.ctx.moveTo(0, -size / 2);
                    this.ctx.lineTo(size / 2, 0);
                    this.ctx.lineTo(0, size / 2);
                    this.ctx.lineTo(-size / 2, 0);
                    this.ctx.closePath();
                }
                this.ctx.fill();
                this.ctx.stroke();

                // HP Bar
                const hpPct = e.hp / e.maxHp;
                this.ctx.fillStyle = '#FFF';
                this.ctx.fillRect(-size / 2, -size / 2 - 10, size * hpPct, 5);

                this.ctx.restore();
            }

            if (e.z < 100) {
                this.enemies.splice(i, 1);
                this.takeDamage();
            }
        }

        // 4. Player Gun
        this.ctx.save();
        this.ctx.translate(centerX, this.canvas.height);
        this.ctx.translate(0, this.gunRecoil);

        this.ctx.fillStyle = '#111';
        this.ctx.strokeStyle = '#555';
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(-40, 0);
        this.ctx.lineTo(-30, -150);
        this.ctx.lineTo(-20, -150);
        this.ctx.lineTo(-20, -200);
        this.ctx.lineTo(20, -200);
        this.ctx.lineTo(20, -150);
        this.ctx.lineTo(30, -150);
        this.ctx.lineTo(40, 0);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(-5, -200, 10, 200);

        this.ctx.restore();

        if (this.gunRecoil > 0) this.gunRecoil -= 2;

        // 5. FX & Floating Text
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life--;

            if (p.type === 'muzzle') {
                this.ctx.save();
                this.ctx.translate(centerX, this.canvas.height - 200);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${p.life / 5})`;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 30 + Math.random() * 20, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            } else if (p.type === 'spark') {
                p.x += p.vx;
                p.y += p.vy;
                this.ctx.fillStyle = '#FFF';
                this.ctx.fillRect(p.x, p.y, 2, 2);
            }

            if (p.life <= 0) this.particles.splice(i, 1);
        }

        // Floating Text
        this.ctx.font = 'bold 20px "Orbitron", sans-serif';
        this.ctx.textAlign = 'center';
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y += ft.vy;
            ft.life--;

            this.ctx.fillStyle = `rgba(255, 215, 0, ${ft.life / 30})`; // Gold fade
            this.ctx.fillText(ft.text, ft.x, ft.y);

            if (ft.life <= 0) this.floatingTexts.splice(i, 1);
        }

        // Projectiles
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.life--;

            this.ctx.strokeStyle = p.color || '#FFF';
            this.ctx.lineWidth = p.width || 2;

            this.ctx.beginPath();
            this.ctx.moveTo(centerX, this.canvas.height - 200);
            this.ctx.lineTo(p.x, p.y);
            this.ctx.stroke();

            if (p.life <= 0) this.projectiles.splice(i, 1);
        }

        this.loop = requestAnimationFrame(this.update.bind(this));
    }

    cleanup() {
        cancelAnimationFrame(this.loop);
        window.removeEventListener('resize', this.resizeCanvas);
        if (this.canvas) {
            this.canvas.removeEventListener('mousedown', this.handleClick);
            this.canvas.removeEventListener('touchstart', this.handleClick);
        }
    }
}
