import * as THREE from 'three';

export class GameManager {
    constructor(scene, ui) {
        this.scene = scene;
        this.ui = ui;

        this.state = {
            stage: 1,
            energy: 0,
            clicks: 0,
            enemiesDefeated: 0
        };

        this.config = {
            DECAY: 0.3,
            CLICK_POWER: 1.5,
            TARGET_CLICKS: 100,
            TOTAL_ENEMIES: 30
        };

        this.lastTime = Date.now();
        this.isActive = true;

        this.init();
    }

    init() {
        window.addEventListener('click', (e) => this.handleClick(e));
        window.addEventListener('mousemove', (e) => this.scene.onMouseMove?.(e));
        this.loop();
    }

    handleClick(e) {
        if (!this.isActive) return;
        this.state.clicks++;

        const obj = this.scene.raycast(e.clientX, e.clientY);

        if (this.state.stage === 1) this.chargeRocket();
        else if (this.state.stage === 3 && obj && obj.userData.type === 'enemy') this.shootEnemy(obj);
    }

    chargeRocket() {
        this.state.energy += this.config.CLICK_POWER;
        if (this.state.energy > 100) this.state.energy = 100;
        this.ui.updateEnergy(this.state.energy);
        this.scene.pulseRocket();

        if (this.state.energy >= 100) this.startFlight();
    }

    startFlight() {
        this.state.stage = 2;
        this.ui.updateStageInfo("STAGE 02 // FLIGHT");
        this.ui.showMessage("LAUNCH SEQUENCE INITIATED", "DESTINATION: DEEP SPACE");

        this.scene.launchRocket(() => this.startShooter());
    }

    startShooter() {
        this.state.stage = 3;
        this.ui.updateStageInfo("STAGE 03 // COMBAT");
        this.ui.showMessage("WARNING: HOSTILES DETECTED", "ENGAGE ENEMY TARGETS");
        this.ui.updateShooterHUD(this.config.TOTAL_ENEMIES);

        this.scene.enterShooterMode();
        this.spawnEnemy();

        this.spawnInterval = setInterval(() => {
            if (this.state.enemiesDefeated < this.config.TOTAL_ENEMIES) this.spawnEnemy();
        }, 1500);
    }

    spawnEnemy() {
        const r = Math.random();
        let type = 'basic';
        if (r > 0.8) type = 'boss';
        else if (r > 0.5) type = 'strong';
        this.scene.createEnemy(type);
    }

    shootEnemy(obj) {
        this.scene.createLaser(obj.position);
        obj.userData.hp--;
        if (obj.userData.hp <= 0) {
            this.scene.destroyObject(obj);
            this.state.enemiesDefeated++;

            const remaining = this.config.TOTAL_ENEMIES - this.state.enemiesDefeated;
            this.ui.updateShooterHUD(remaining);

            if (remaining <= 0) {
                clearInterval(this.spawnInterval);
                this.ui.showMessage("THREATS ELIMINATED", "CONTINUING FLIGHT");
                setTimeout(() => this.endGame(), 3000);
            }
        } else {
            this.scene.pulseObject(obj);
        }
    }

    endGame() {
        this.isActive = false;
        this.ui.showVictoryScreen({ clicks: this.state.clicks });
    }

    loop() {
        if (!this.isActive) return;
        requestAnimationFrame(() => this.loop());

        const now = Date.now();
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        if (this.state.stage === 1 && this.state.energy > 0) {
            this.state.energy -= this.config.DECAY * dt * 10;
            if (this.state.energy < 0) this.state.energy = 0;
            this.ui.updateEnergy(this.state.energy);
        }
    }
}
