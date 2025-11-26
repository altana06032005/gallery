import gsap from 'gsap';

export class UIManager {
    constructor() {
        this.createHUD();
    }

    createHUD() {
        const hud = document.createElement('div');
        hud.id = 'ui-layer';
        hud.innerHTML = `
            <div class="hud-top">
                <div id="stage-info">STAGE 01 // CHARGING</div>
                <div id="shooter-hud" style="display: none; text-align: right;">
                    <div style="font-size: 0.8rem; color: #ff0055;">THREATS DETECTED</div>
                    <div id="threat-count" style="font-size: 1.5rem; color: #fff;">0</div>
                </div>
            </div>
            
            <div id="message-overlay">
                <h1 id="main-message">INITIATE LAUNCH SEQUENCE</h1>
                <p id="sub-message">CLICK TO CHARGE</p>
            </div>

            <div class="hud-bottom">
                <div id="energy-wrapper">
                    <div id="energy-bar-container">
                        <div id="energy-fill"></div>
                    </div>
                    <div id="energy-label">ENERGY: 0%</div>
                </div>
            </div>
        `;
        document.body.appendChild(hud);

        // Animate in
        gsap.fromTo('#ui-layer', { opacity: 0 }, { opacity: 1, duration: 1 });
        this.showMessage("SYSTEM ONLINE", "BEGIN CHARGING");
    }

    updateEnergy(value) {
        const fill = document.getElementById('energy-fill');
        const label = document.getElementById('energy-label');
        if (fill) fill.style.width = `${value}%`;
        if (label) label.textContent = `ENERGY: ${Math.floor(value)}%`;
    }

    updateStageInfo(text) {
        const el = document.getElementById('stage-info');
        if (el) el.textContent = text;
    }

    showMessage(main, sub) {
        const m = document.getElementById('main-message');
        const s = document.getElementById('sub-message');

        if (m) {
            m.textContent = main;
            gsap.fromTo(m, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
        }
        if (s) {
            s.textContent = sub;
            gsap.fromTo(s, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2 });
        }

        // Auto hide after 3s
        setTimeout(() => {
            if (m) gsap.to(m, { opacity: 0, duration: 0.5 });
            if (s) gsap.to(s, { opacity: 0, duration: 0.5 });
        }, 3000);
    }

    showFloatingText(x, y, text) {
        const el = document.createElement('div');
        el.className = 'floating-text';
        el.textContent = text;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        document.body.appendChild(el);

        gsap.to(el, { y: y - 50, opacity: 0, duration: 1, onComplete: () => el.remove() });
    }

    showVictoryScreen(stats) {
        const screen = document.createElement('div');
        screen.id = 'victory-screen';
        screen.className = 'active';
        screen.innerHTML = `
            <h1>MISSION ACCOMPLISHED</h1>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${stats.clicks}</div>
                    <div class="stat-label">TOTAL CLICKS</div>
                </div>
            </div>
            <button onclick="location.reload()">RESTART MISSION</button>
        `;
        document.body.appendChild(screen);
        gsap.fromTo(screen, { opacity: 0 }, { opacity: 1, duration: 1 });
    }
}
