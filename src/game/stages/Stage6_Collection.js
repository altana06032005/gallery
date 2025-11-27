export class Stage6_Collection {
  constructor(container, gameManager) {
    this.container = container;
    this.gameManager = gameManager;

    this.timeLeft = 60;
    this.score = 0;
    this.targetScore = 15;

    this.timerInterval = null;
    this.spawnInterval = null;
  }

  init() {
    this.render();
    this.startTimer();
    this.spawnItems();
  }

  render() {
    const mapSVG = this.generateMapSVG();

    this.container.innerHTML = `
      <div class="stage-collection">
        <div class="hud">
          <h1>SAMPLE COLLECTION</h1>
          <div class="timer glow-text" id="timer">60s</div>
          <div class="score">SAMPLES: <span id="score">0</span>/${this.targetScore}</div>
        </div>

        <div class="map-container">
          <div class="map-bg" style="background-image: url('${mapSVG}');"></div>
          <div class="collection-area" id="collection-area"></div>
        </div>
      </div>
    `;

    // ---------- СТИЛЬ ИЗ STAGE 5 ----------
    const style = document.createElement('style');
    style.textContent = `
      .stage-scanning {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f0f4f8; /* Light background */
        color: #333;
        font-family: 'Orbitron', sans-serif;
      }
      .hud {
        margin-bottom: 20px;
        text-align: center;
        z-index: 10;
        position: relative;
        background: rgba(255, 255, 255, 0.8);
        padding: 10px 20px;
        border-radius: 10px;
        border: 1px solid rgba(0, 100, 255, 0.2);
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      }
      .hud h1 {
        font-size: 1.2rem;
        margin: 0 0 10px 0;
        color: #0055aa;
      }

      .map-container {
        position: relative;
        width: 80vw;
        max-width: 800px;
        height: 60vh;
        border: 2px solid rgba(0, 100, 255, 0.3);
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 100, 255, 0.1);
        overflow: hidden;
        background: #fff;
      }

      .light-map {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        opacity: 0.9;
        z-index: 1;
      }
      .collection-area {
        position: absolute;
        inset: 0;
        z-index: 5;
      }
        

      /* ——— КРИСТАЛЛ ———*/
      .crystal-item {
        position: absolute;
        width: 35px;
        height: 35px;
        background: radial-gradient(circle, #00eaff, #0077ff);
        border-radius: 50%;
        box-shadow: 0 0 12px #00eaff, 0 0 20px #0077ff;
        cursor: pointer;
        transition: transform 0.2s, opacity 0.3s;
        animation: float 2s infinite ease-in-out;
      }

      .crystal-item:hover {
        transform: scale(1.3);
      }

      @keyframes float {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }

      .glow-text {
        text-shadow: 0 0 10px #00c8ff;
      }
    `;
    this.container.appendChild(style);

    this.collectionArea = document.getElementById("collection-area");
    this.timerEl = document.getElementById("timer");
    this.scoreEl = document.getElementById("score");
  }

  // ---------- BLUE RELIEF MAP (Same as Stage 5) ----------
  generateMapSVG() {
    const width = 1000;
    const height = 700;
    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

    // Gradient definitions for relief shading
    svgContent += `<defs>`;
    svgContent += `<radialGradient id="hillShade" cx="30%" cy="30%">
      <stop offset="0%" style="stop-color:#e8f4f8;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#b3d9e8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4a7c99;stop-opacity:1" />
    </radialGradient>`;
    svgContent += `<radialGradient id="valleyShade" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:#1a3d52;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d5a73;stop-opacity:1" />
    </radialGradient>`;
    svgContent += `</defs>`;

    // Background - Light blue water
    svgContent += `<rect width="100%" height="100%" fill="#d4e8f0"/>`;

    // Helper for organic terrain shapes
    const generateTerrain = (cx, cy, r, points = 20, variation = 40) => {
      let path = "";
      for (let i = 0; i < points; i++) {
        const angle = (Math.PI * 2 * i) / points;
        const noise = (Math.sin(angle * 3) * 0.3 + Math.cos(angle * 5) * 0.2);
        const dist = r + (Math.random() - 0.5) * variation + noise * 20;
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        path += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
      }
      return path + "Z";
    };

    // Create terrain features (hills/mountains)
    const terrainFeatures = [];
    for (let i = 0; i < 8; i++) {
      terrainFeatures.push({
        cx: Math.random() * width,
        cy: Math.random() * height,
        r: 80 + Math.random() * 120,
        elevation: Math.random()
      });
    }

    // Draw base terrain with shading
    terrainFeatures.forEach(feature => {
      const baseColor = feature.elevation > 0.5 ? "url(#hillShade)" : "#a8cfe0";
      svgContent += `<path d="${generateTerrain(feature.cx, feature.cy, feature.r)}" 
        fill="${baseColor}" stroke="none" opacity="0.6"/>`;
    });

    // Add detailed contour lines (multiple layers)
    terrainFeatures.forEach(feature => {
      const levels = 6 + Math.floor(feature.elevation * 4);
      for (let level = 0; level < levels; level++) {
        const r = feature.r - (level * (feature.r / levels));
        if (r < 15) continue;

        const intensity = 1 - (level / levels);
        const strokeColor = level === 0 ? "#1a3d52" : `rgba(26, 61, 82, ${0.3 + intensity * 0.4})`;
        const strokeWidth = level === 0 ? 1.2 : (level % 2 === 0 ? 0.8 : 0.5);

        svgContent += `<path d="${generateTerrain(feature.cx, feature.cy, r, 20, 15)}" 
          fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
      }
    });

    // Add fine contour lines across entire map
    for (let y = 50; y < height; y += 40) {
      let path = `M0 ${y}`;
      for (let x = 0; x < width; x += 30) {
        const noise = Math.sin(x * 0.02 + y * 0.015) * 15 + Math.cos(x * 0.015) * 10;
        path += ` L${x} ${y + noise}`;
      }
      svgContent += `<path d="${path}" fill="none" stroke="rgba(74, 124, 153, 0.2)" stroke-width="0.5"/>`;
    }

    // Add depth shading (valleys)
    for (let i = 0; i < 4; i++) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      const r = 60 + Math.random() * 80;
      svgContent += `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.7}" 
        fill="url(#valleyShade)" opacity="0.3"/>`;
    }

    // Grid overlay (subtle)
    for (let x = 0; x < width; x += 100)
      svgContent += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" 
        stroke="rgba(74, 124, 153, 0.15)" stroke-width="0.5" stroke-dasharray="3,3"/>`;
    for (let y = 0; y < height; y += 100)
      svgContent += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" 
        stroke="rgba(74, 124, 153, 0.15)" stroke-width="0.5" stroke-dasharray="3,3"/>`;

    // Peak markers
    terrainFeatures.forEach(feature => {
      if (feature.elevation > 0.6) {
        svgContent += `<circle cx="${feature.cx}" cy="${feature.cy}" r="3" fill="#1a3d52"/>`;
        svgContent += `<circle cx="${feature.cx}" cy="${feature.cy}" r="2" fill="#fff" opacity="0.5"/>`;
      }
    });

    svgContent += `</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgContent);
  }

  // ---------- GAME LOGIC ----------
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.timerEl.textContent = `${this.timeLeft}s`;

      if (this.timeLeft <= 0) this.endGame(false);
    }, 1000);
  }

  spawnItems() {
    for (let i = 0; i < 3; i++) this.spawnCrystal();

    this.spawnInterval = setInterval(() => {
      if (document.querySelectorAll('.crystal-item').length < 8) {
        this.spawnCrystal();
      }
    }, 700);
  }

  spawnCrystal() {
    const el = document.createElement("div");
    el.classList.add("crystal-item");

    el.style.left = `${Math.random() * 90 + 5}%`;
    el.style.top = `${Math.random() * 90 + 5}%`;

    el.onclick = () => this.collect(el);

    this.collectionArea.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.style.opacity = 0;
      setTimeout(() => el.remove(), 300);
    }, 3000);
  }

  collect(el) {
    el.remove();
    this.score++;
    this.scoreEl.textContent = this.score;

    if (this.score >= this.targetScore) {
      this.endGame(true);
    }
  }

  endGame(success) {
    clearInterval(this.timerInterval);
    clearInterval(this.spawnInterval);

    if (success) {
      alert("MISSION COMPLETE!");
      this.gameManager.nextStage();
    } else {
      alert("MISSION FAILED!");
      location.reload();
    }
  }

  cleanup() {
    clearInterval(this.timerInterval);
    clearInterval(this.spawnInterval);
  }
}
