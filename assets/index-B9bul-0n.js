(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();class l{constructor(e,t){this.container=e,this.gameManager=t,this.energy=0,this.decayRate=2,this.clickValue=1.5,this.lastFrameTime=0,this.isActive=!1}init(){this.isActive=!0,this.render(),this.attachEvents(),this.loop=requestAnimationFrame(this.update.bind(this))}render(){this.container.innerHTML=`
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
    `;const e=document.createElement("style");e.textContent=`
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
    `,this.container.appendChild(e),this.energyFill=document.getElementById("energy-fill"),this.energyText=document.getElementById("energy-text"),this.rocket=document.getElementById("rocket")}attachEvents(){this.rocket.addEventListener("click",()=>{this.energy=Math.min(100,this.energy+this.clickValue),this.triggerVisualFeedback()})}triggerVisualFeedback(){this.rocket.classList.remove("pulse"),this.rocket.offsetWidth,this.rocket.classList.add("pulse")}update(e){if(!this.isActive)return;this.lastFrameTime||(this.lastFrameTime=e);const t=(e-this.lastFrameTime)/1e3;this.lastFrameTime=e,this.energy>0&&(this.energy=Math.max(0,this.energy-this.decayRate*t)),this.energyFill.style.width=`${Math.min(100,this.energy)}%`,this.energyText.textContent=`${Math.min(100,Math.round(this.energy))}%`,this.isActive&&(this.loop=requestAnimationFrame(this.update.bind(this)))}attachEvents(){this.rocket.addEventListener("click",()=>{this.energy=Math.min(100,this.energy+this.clickValue),this.triggerVisualFeedback(),this.energy>=100&&(this.energy=100,this.completeStage())})}completeStage(){var e;this.isActive=!1,cancelAnimationFrame(this.loop),console.log("🚀 ROCKET CHARGED!"),console.log("gameManager:",this.gameManager),console.log("nextStage type:",(e=this.gameManager)==null?void 0:e.nextStage),this.gameManager&&typeof this.gameManager.nextStage=="function"?this.gameManager.nextStage():console.error("gameManager.nextStage() не найден!")}cleanup(){this.isActive=!1,cancelAnimationFrame(this.loop)}}class d{constructor(e,t){this.container=e,this.gameManager=t,this.duration=5e3,this.startTime=null}init(){this.render(),this.startTime=Date.now(),this.loop=requestAnimationFrame(this.update.bind(this))}render(){this.container.innerHTML=`
      <div class="stage-flight">
        <canvas id="flight-canvas"></canvas>
        <div class="hud">
          <h1>FLIGHT TO PLANET</h1>
          <div class="status-text">APPROACHING DESTINATION...</div>
        </div>
      </div>
    `;const e=document.createElement("style");e.textContent=`
      .stage-flight {
        width: 100%;
        height: 100%;
        position: relative;
      }
      #flight-canvas {
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
      }
    `,this.container.appendChild(e),this.canvas=document.getElementById("flight-canvas"),this.ctx=this.canvas.getContext("2d"),this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas.bind(this)),this.stars=[];for(let t=0;t<200;t++)this.stars.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,z:Math.random()*2+.5})}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}update(){const e=Date.now()-this.startTime;this.ctx.fillStyle="#050505",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="#ffffff";const t=this.canvas.width/2,s=this.canvas.height/2;this.stars.forEach(i=>{const n=(i.x-t)/(this.canvas.width/2),a=(i.y-s)/(this.canvas.height/2);i.x+=n*i.z*10,i.y+=a*i.z*10,i.z+=.05,(i.x<0||i.x>this.canvas.width||i.y<0||i.y>this.canvas.height)&&(i.x=Math.random()*this.canvas.width,i.y=Math.random()*this.canvas.height,i.z=Math.random()*2+.5,i.x=t+(Math.random()-.5)*50,i.y=s+(Math.random()-.5)*50);const h=i.z*1.5;this.ctx.beginPath(),this.ctx.moveTo(i.x,i.y),this.ctx.lineTo(i.x-n*h*5,i.y-a*h*5),this.ctx.strokeStyle=`rgba(255, 255, 255, ${Math.min(1,i.z/5)})`,this.ctx.lineWidth=h,this.ctx.stroke()}),this.ctx.save(),this.ctx.translate(t,s+100),this.ctx.beginPath(),this.ctx.moveTo(0,-20),this.ctx.lineTo(15,20),this.ctx.lineTo(0,10),this.ctx.lineTo(-15,20),this.ctx.closePath(),this.ctx.strokeStyle="var(--neon-cyan)",this.ctx.strokeStyle="#00f3ff",this.ctx.lineWidth=2,this.ctx.stroke(),this.ctx.beginPath(),this.ctx.arc(0,15,5+Math.random()*5,0,Math.PI*2),this.ctx.fillStyle="#ff00ff",this.ctx.fill(),this.ctx.restore(),e>=this.duration?this.completeStage():this.loop=requestAnimationFrame(this.update.bind(this))}completeStage(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.gameManager.nextStage()}cleanup(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas)}}class g{constructor(e,t){this.container=e,this.gameManager=t,this.enemiesDestroyed=0,this.targetKills=20,this.enemies=[],this.lastSpawnTime=0,this.spawnInterval=1500,this.projectiles=[],this.explosions=[]}init(){this.render(),this.canvas=document.getElementById("combat-canvas"),this.ctx=this.canvas.getContext("2d"),this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas.bind(this)),this.canvas.addEventListener("mousedown",this.handleClick.bind(this)),this.loop=requestAnimationFrame(this.update.bind(this))}render(){this.container.innerHTML=`
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
    `;const e=document.createElement("style");e.textContent=`
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
    `,this.container.appendChild(e),this.killCountEl=document.getElementById("kill-count")}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}handleClick(e){const t=this.canvas.getBoundingClientRect(),s=e.clientX-t.left,i=e.clientY-t.top;this.projectiles.push({startX:this.canvas.width/2,startY:this.canvas.height,endX:s,endY:i,progress:0});for(let n=this.enemies.length-1;n>=0;n--){const a=this.enemies[n],h=s-a.x,r=i-a.y;if(Math.sqrt(h*h+r*r)<a.size){a.hp--,a.hitFlash=5,a.hp<=0&&this.destroyEnemy(n);break}}}destroyEnemy(e){const t=this.enemies[e];this.enemies.splice(e,1),this.enemiesDestroyed++,this.killCountEl.textContent=this.enemiesDestroyed,this.explosions.push({x:t.x,y:t.y,radius:1,maxRadius:t.size*2,alpha:1}),this.enemiesDestroyed>=this.targetKills&&setTimeout(()=>this.completeStage(),1e3)}spawnEnemy(){const e=Math.random();let t=1,s=30,i="#00f3ff",n=1+Math.random();e>.9?(t=3,s=50,i="#ff00ff",n=.5):e>.6&&(t=2,s=40,i="#ffffff",n=.8),this.enemies.push({x:Math.random()*(this.canvas.width-100)+50,y:-50,size:s,hp:t,maxHp:t,color:i,speed:n,hitFlash:0})}update(e){this.enemiesDestroyed>=this.targetKills&&this.enemies.length===0||e-this.lastSpawnTime>this.spawnInterval&&this.enemiesDestroyed+this.enemies.length<this.targetKills&&(this.spawnEnemy(),this.lastSpawnTime=e,this.spawnInterval=Math.max(500,this.spawnInterval-10)),this.ctx.fillStyle="#050505",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(255,255,255,0.5)";for(let t=0;t<50;t++)this.ctx.fillRect(Math.random()*this.canvas.width,Math.random()*this.canvas.height,1,1);this.enemies.forEach(t=>{t.y+=t.speed,this.ctx.save(),this.ctx.translate(t.x,t.y),this.ctx.beginPath(),t.maxHp===3?(this.ctx.moveTo(0,-t.size),this.ctx.lineTo(t.size,0),this.ctx.lineTo(0,t.size),this.ctx.lineTo(-t.size,0)):t.maxHp===2?(this.ctx.moveTo(0,-t.size),this.ctx.lineTo(t.size,t.size),this.ctx.lineTo(-t.size,t.size)):this.ctx.arc(0,0,t.size,0,Math.PI*2),this.ctx.closePath(),this.ctx.strokeStyle=t.hitFlash>0?"#ffffff":t.color,this.ctx.lineWidth=2,this.ctx.stroke(),t.hitFlash>0&&(this.ctx.fillStyle="rgba(255,255,255,0.5)",this.ctx.fill(),t.hitFlash--),this.ctx.restore(),t.y>this.canvas.height+50&&(t.y=-50,t.x=Math.random()*(this.canvas.width-100)+50)});for(let t=this.projectiles.length-1;t>=0;t--){const s=this.projectiles[t];s.progress+=.1;const i=s.startX+(s.endX-s.startX)*s.progress,n=s.startY+(s.endY-s.startY)*s.progress;this.ctx.beginPath(),this.ctx.moveTo(s.startX,s.startY),this.ctx.lineTo(i,n),this.ctx.strokeStyle=`rgba(0, 243, 255, ${1-s.progress})`,this.ctx.lineWidth=2,this.ctx.stroke(),s.progress>=1&&this.projectiles.splice(t,1)}for(let t=this.explosions.length-1;t>=0;t--){const s=this.explosions[t];s.radius+=2,s.alpha-=.05,this.ctx.beginPath(),this.ctx.arc(s.x,s.y,s.radius,0,Math.PI*2),this.ctx.strokeStyle=`rgba(255, 0, 255, ${s.alpha})`,this.ctx.lineWidth=2,this.ctx.stroke(),s.alpha<=0&&this.explosions.splice(t,1)}this.loop=requestAnimationFrame(this.update.bind(this))}completeStage(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.canvas.removeEventListener("mousedown",this.handleClick),alert("SECTOR CLEAR. LANDING SEQUENCE INITIATED."),this.gameManager.nextStage()}cleanup(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.canvas&&this.canvas.removeEventListener("mousedown",this.handleClick)}}class m{constructor(e,t){this.container=e,this.gameManager=t,this.duration=4e3,this.startTime=null}init(){this.render(),this.startTime=Date.now(),this.loop=requestAnimationFrame(this.update.bind(this))}render(){this.container.innerHTML=`
      <div class="stage-landing">
        <canvas id="landing-canvas"></canvas>
        <div class="hud">
          <h1>PLANET LANDING</h1>
          <div class="status-text">INITIATING DESCENT...</div>
        </div>
      </div>
    `;const e=document.createElement("style");e.textContent=`
      .stage-landing {
        width: 100%;
        height: 100%;
        position: relative;
      }
      #landing-canvas {
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
      }
    `,this.container.appendChild(e),this.canvas=document.getElementById("landing-canvas"),this.ctx=this.canvas.getContext("2d"),this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas.bind(this))}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}update(){const e=Date.now()-this.startTime,t=Math.min(1,e/this.duration);this.ctx.fillStyle="#050505",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const s=this.canvas.width/2,i=this.canvas.height/2,a=10+Math.min(this.canvas.width,this.canvas.height)*.4*t;this.ctx.beginPath(),this.ctx.arc(s,i,a,0,Math.PI*2),this.ctx.strokeStyle="var(--neon-cyan)",this.ctx.strokeStyle="#00f3ff",this.ctx.lineWidth=2,this.ctx.stroke(),this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(s,i,a,0,Math.PI*2),this.ctx.clip(),this.ctx.strokeStyle="rgba(0, 243, 255, 0.3)",this.ctx.lineWidth=1;const h=t*Math.PI;for(let r=0;r<8;r++){const c=s+Math.cos(h+r*Math.PI/4)*a;this.ctx.beginPath(),this.ctx.ellipse(s,i,Math.abs(c-s),a,0,0,Math.PI*2),this.ctx.stroke()}for(let r=1;r<5;r++){const c=i-a+r*a*2/5;this.ctx.beginPath(),this.ctx.moveTo(s-a,c),this.ctx.lineTo(s+a,c),this.ctx.stroke()}this.ctx.restore(),this.ctx.shadowBlur=20*t,this.ctx.shadowColor="#00f3ff",this.ctx.stroke(),this.ctx.shadowBlur=0,e>=this.duration?this.completeStage():this.loop=requestAnimationFrame(this.update.bind(this))}completeStage(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.gameManager.nextStage()}cleanup(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas)}}class v{constructor(e,t){this.container=e,this.gameManager=t,this.totalSegments=80,this.scannedSegments=0,this.grid=[]}init(){this.render(),this.attachEvents()}render(){this.container.innerHTML=`
      <div class="stage-scanning">
        <div class="hud">
          <h1>TERRITORY SCANNING</h1>
          <div class="progress-bar-container glow-box">
            <div class="progress-bar" id="scan-progress"></div>
          </div>
          <div class="status-text">SCANNED: <span id="scan-count">0</span>/${this.totalSegments}</div>
        </div>
        
        <div class="grid-container" id="grid-container">
          <!-- Grid items generated by JS -->
        </div>
      </div>
    `;const e=document.createElement("style");e.textContent=`
      .stage-scanning {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .hud {
        margin-bottom: 20px;
        text-align: center;
      }
      .progress-bar-container {
        width: 300px;
        height: 20px;
        margin: 10px auto;
        background: rgba(0,0,0,0.5);
      }
      .progress-bar {
        width: 0%;
        height: 100%;
        background-color: var(--neon-cyan);
        box-shadow: 0 0 10px var(--neon-cyan);
        transition: width 0.2s;
      }
      .grid-container {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        gap: 5px;
        width: 80vw;
        max-width: 600px;
        height: 60vh;
      }
      .grid-item {
        background: rgba(0, 243, 255, 0.1);
        border: 1px solid rgba(0, 243, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      .grid-item:hover {
        background: rgba(0, 243, 255, 0.3);
        transform: scale(1.05);
      }
      .grid-item.scanned {
        background: rgba(0, 243, 255, 0.05);
        border-color: var(--neon-magenta);
        cursor: default;
      }
      .grid-item.scanned:hover {
        transform: none;
      }
      .grid-object {
        width: 60%;
        height: 60%;
        background: var(--neon-magenta);
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%); /* Triangle */
        animation: appear 0.5s ease-out;
        box-shadow: 0 0 10px var(--neon-magenta);
      }
      @keyframes appear {
        0% { transform: scale(0); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
    `,this.container.appendChild(e),this.gridContainer=document.getElementById("grid-container"),this.scanProgress=document.getElementById("scan-progress"),this.scanCount=document.getElementById("scan-count"),this.generateGrid()}generateGrid(){for(let e=0;e<this.totalSegments;e++){const t=document.createElement("div");t.classList.add("grid-item"),t.dataset.index=e,t.addEventListener("click",()=>this.handleScan(t)),this.gridContainer.appendChild(t)}}handleScan(e){if(e.classList.contains("scanned"))return;e.classList.add("scanned");const t=document.createElement("div");t.classList.add("grid-object");const s=["polygon(50% 0%, 0% 100%, 100% 100%)","polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)","circle(50% at 50% 50%)"];t.style.clipPath=s[Math.floor(Math.random()*s.length)],e.appendChild(t),this.scannedSegments++,this.updateProgress(),this.scannedSegments>=this.totalSegments&&setTimeout(()=>this.completeStage(),500)}updateProgress(){const e=this.scannedSegments/this.totalSegments*100;this.scanProgress.style.width=`${e}%`,this.scanCount.textContent=this.scannedSegments}completeStage(){alert("TERRITORY FULLY SCANNED."),this.gameManager.nextStage()}cleanup(){}}class p{constructor(e,t){this.container=e,this.gameManager=t,this.timeLeft=60,this.score=0,this.gridSize=25,this.activeItems=[],this.timerInterval=null,this.spawnInterval=null}init(){this.render(),this.startTimer(),this.spawnItems()}render(){this.container.innerHTML=`
      <div class="stage-collection">
        <div class="hud">
          <h1>SAMPLE COLLECTION</h1>
          <div class="timer glow-text" id="timer">60s</div>
          <div class="score">SAMPLES: <span id="score">0</span></div>
        </div>
        
        <div class="collection-grid" id="collection-grid">
          <!-- Grid items generated by JS -->
        </div>
      </div>
    `;const e=document.createElement("style");e.textContent=`
      .stage-collection {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .hud {
        margin-bottom: 20px;
        text-align: center;
        display: flex;
        gap: 20px;
        font-size: 1.5rem;
      }
      .collection-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
        width: 60vw;
        max-width: 500px;
        height: 60vw;
        max-height: 500px;
      }
      .collection-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      .collection-item:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      .collection-item.active {
        background: rgba(0, 243, 255, 0.2);
        border-color: var(--neon-cyan);
        box-shadow: 0 0 10px var(--neon-cyan);
      }
      .collection-item.active::after {
        content: '';
        width: 50%;
        height: 50%;
        background: var(--neon-cyan);
        border-radius: 50%;
        animation: pulse-item 1s infinite;
      }
      @keyframes pulse-item {
        0% { transform: scale(0.8); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(0.8); opacity: 0.8; }
      }
    `,this.container.appendChild(e),this.gridContainer=document.getElementById("collection-grid"),this.timerEl=document.getElementById("timer"),this.scoreEl=document.getElementById("score"),this.generateGrid()}generateGrid(){for(let e=0;e<this.gridSize;e++){const t=document.createElement("div");t.classList.add("collection-item"),t.dataset.index=e,t.addEventListener("click",()=>this.handleCollect(t)),this.gridContainer.appendChild(t)}}startTimer(){this.timerInterval=setInterval(()=>{this.timeLeft--,this.timerEl.textContent=`${this.timeLeft}s`,this.timeLeft<=0&&this.endGame()},1e3)}spawnItems(){this.activateRandomItem(),this.spawnInterval=setInterval(()=>{document.querySelectorAll(".collection-item.active").length<5&&this.activateRandomItem()},500)}activateRandomItem(){const e=document.querySelectorAll(".collection-item:not(.active)");if(e.length===0)return;const t=e[Math.floor(Math.random()*e.length)];t.classList.add("active"),setTimeout(()=>{t.classList.contains("active")&&t.classList.remove("active")},2e3+Math.random()*1e3)}handleCollect(e){if(e.classList.contains("active")){e.classList.remove("active"),this.score++,this.scoreEl.textContent=this.score;const t=document.createElement("div");t.textContent="+1",t.style.position="absolute",t.style.color="var(--neon-cyan)",t.style.pointerEvents="none",t.style.animation="float-up 0.5s ease-out forwards",e.appendChild(t),setTimeout(()=>t.remove(),500)}}endGame(){clearInterval(this.timerInterval),clearInterval(this.spawnInterval),alert(`MISSION COMPLETE! SAMPLES COLLECTED: ${this.score}`),location.reload()}cleanup(){clearInterval(this.timerInterval),clearInterval(this.spawnInterval)}}console.log("Stage1 module:",l);class u{constructor(e){this.container=e,this.currentStage=null,this.state={energy:0,score:0,scannedSegments:0,collectedSamples:0}}start(){this.loadStage(1)}loadStage(e){switch(this.container.innerHTML="",this.currentStage&&this.currentStage.cleanup&&this.currentStage.cleanup(),e){case 1:this.currentStage=new l(this.container,this);break;case 2:this.currentStage=new d(this.container,this);break;case 3:this.currentStage=new g(this.container,this);break;case 4:this.currentStage=new m(this.container,this);break;case 5:this.currentStage=new v(this.container,this);break;case 6:this.currentStage=new p(this.container,this);break;default:console.error("Unknown stage:",e)}this.currentStage&&this.currentStage.init()}nextStage(){this.currentStage instanceof l?this.loadStage(2):this.currentStage instanceof d?this.loadStage(3):this.currentStage instanceof g?this.loadStage(4):this.currentStage instanceof m?this.loadStage(5):this.currentStage instanceof v&&this.loadStage(6)}}document.addEventListener("DOMContentLoaded",()=>{const o=document.querySelector("#app");new u(o).start()});
