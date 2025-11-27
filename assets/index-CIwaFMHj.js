(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))e(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&e(i)}).observe(document,{childList:!0,subtree:!0});function s(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function e(a){if(a.ep)return;a.ep=!0;const n=s(a);fetch(a.href,n)}})();class u{constructor(t,s){this.container=t,this.gameManager=s,this.energy=0,this.decayRate=2,this.clickValue=1.5,this.lastFrameTime=0,this.isActive=!1,this.particles=[]}init(){this.isActive=!0,this.render(),this.initParticles(),this.attachEvents(),this.loop=requestAnimationFrame(this.update.bind(this))}render(){this.container.innerHTML=`
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
    `;const t=document.createElement("style");t.textContent=`
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
    `,this.container.appendChild(t),this.energyFill=document.getElementById("energy-fill"),this.energyText=document.getElementById("energy-text"),this.rocket=document.getElementById("rocket"),this.canvas=document.getElementById("bg-canvas"),this.ctx=this.canvas.getContext("2d"),this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas.bind(this))}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}initParticles(){for(let t=0;t<100;t++)this.particles.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,size:Math.random()*2,speedY:Math.random()*.5+.1,opacity:Math.random()*.5+.1})}updateParticles(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="#0055aa",this.particles.forEach(t=>{t.y-=t.speedY,t.y<0&&(t.y=this.canvas.height,t.x=Math.random()*this.canvas.width),this.ctx.globalAlpha=t.opacity,this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.size,0,Math.PI*2),this.ctx.fill()}),this.ctx.globalAlpha=1}attachEvents(){this.rocket.addEventListener("click",()=>{this.energy=Math.min(100,this.energy+this.clickValue),this.triggerVisualFeedback(),this.energy>=100&&(this.energy=100,this.completeStage())})}triggerVisualFeedback(){this.rocket.classList.remove("pulse"),this.rocket.offsetWidth,this.rocket.classList.add("pulse")}update(t){if(!this.isActive)return;this.lastFrameTime||(this.lastFrameTime=t);const s=(t-this.lastFrameTime)/1e3;this.lastFrameTime=t,this.energy>0&&(this.energy=Math.max(0,this.energy-this.decayRate*s)),this.energyFill.style.width=`${Math.min(100,this.energy)}%`,this.energyText.textContent=`${Math.min(100,Math.round(this.energy))}%`,this.updateParticles(),this.isActive&&(this.loop=requestAnimationFrame(this.update.bind(this)))}completeStage(){this.isActive=!1,cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.gameManager.nextStage()}cleanup(){this.isActive=!1,cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas)}}class y{constructor(t,s){this.container=t,this.gameManager=s,this.duration=5e3,this.startTime=null,this.speed=0,this.maxSpeed=50,this.acceleration=.5}init(){this.render(),this.startTime=Date.now(),this.loop=requestAnimationFrame(this.update.bind(this))}render(){this.container.innerHTML=`
      <div class="stage-flight">
        <canvas id="flight-canvas"></canvas>
        <div class="hud">
          <h1>FLIGHT TO PLANET</h1>
          <div class="status-text">ACCELERATING...</div>
        </div>
        <div class="rocket-overlay" id="rocket-overlay">
          <!-- Real Geometric Rocket SVG (Same as Stage 1) -->
          <svg width="100" height="150" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 20 L130 80 L130 220 L100 240 L70 220 L70 80 Z" stroke="#0055aa" stroke-width="2" fill="#ffffff" />
            <path d="M100 20 L100 240" stroke="#0055aa" stroke-width="1" stroke-dasharray="4 2" />
            <path d="M70 180 L40 240 L70 220" stroke="#0055aa" stroke-width="2" fill="#ffffff" />
            <path d="M130 180 L160 240 L130 220" stroke="#0055aa" stroke-width="2" fill="#ffffff" />
            <path d="M85 240 L75 260 L125 260 L115 240" stroke="#0055aa" stroke-width="2" fill="#ffffff" />
            <circle cx="100" cy="100" r="15" stroke="#00f2ff" stroke-width="2" fill="#ffffff" />
            <circle cx="100" cy="100" r="5" fill="#00f2ff" />
            
            <!-- Engine Flame -->
            <path id="engine-flame" d="M85 260 L100 290 L115 260" fill="#00f2ff" opacity="0.8">
            </path>
          </svg>
        </div>
      </div>
    `;const t=document.createElement("style");t.textContent=`
      .stage-flight {
        width: 100%;
        height: 100%;
        position: relative;
        background: #f0f4f8;
        overflow: hidden;
      }
      #flight-canvas {
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
      .rocket-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 5;
        filter: drop-shadow(0 10px 20px rgba(0, 85, 170, 0.2));
        transition: transform 0.05s; /* Fast transition for shake */
      }
    `,this.container.appendChild(t),this.canvas=document.getElementById("flight-canvas"),this.ctx=this.canvas.getContext("2d"),this.rocketOverlay=document.getElementById("rocket-overlay"),this.engineFlame=document.getElementById("engine-flame"),this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas.bind(this)),this.stars=[];for(let s=0;s<200;s++)this.stars.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,z:Math.random()*2+.5})}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}update(){const t=Date.now()-this.startTime;this.speed<this.maxSpeed&&(this.speed+=this.acceleration),this.ctx.fillStyle="#f0f4f8",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.stars.forEach(n=>{const i=this.speed/2*n.z;n.y+=i,n.y>this.canvas.height&&(n.y=-50,n.x=Math.random()*this.canvas.width,n.z=Math.random()*2+.5);const r=n.z*(this.speed/2);this.ctx.beginPath(),this.ctx.moveTo(n.x,n.y),this.ctx.lineTo(n.x,n.y-r),this.ctx.strokeStyle=`rgba(0, 85, 170, ${Math.min(.5,n.z/5)})`,this.ctx.lineWidth=Math.min(3,n.z*.5),this.ctx.stroke()});const s=(Math.random()-.5)*(this.speed/5),e=(Math.random()-.5)*(this.speed/5);this.rocketOverlay.style.transform=`translate(calc(-50% + ${s}px), calc(-50% + ${e}px))`;const a=30+this.speed*1.5+Math.random()*10;this.engineFlame.setAttribute("d",`M85 260 L100 ${260+a} L115 260`),t>=this.duration?this.completeStage():this.loop=requestAnimationFrame(this.update.bind(this))}completeStage(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.gameManager.nextStage()}cleanup(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas)}}class w{constructor(t,s){this.container=t,this.gameManager=s,this.enemiesDestroyed=0,this.targetKills=20,this.enemies=[],this.lastSpawnTime=0,this.spawnInterval=1500,this.projectiles=[],this.explosions=[],this.muzzleFlashes=[],this.flashRed=!1,this.flashRedTimer=0,this.minusOneText=null}init(){this.render(),this.canvas=document.getElementById("combat-canvas"),this.ctx=this.canvas.getContext("2d"),this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas.bind(this)),this.canvas.addEventListener("mousedown",this.handleClick.bind(this)),this.loop=requestAnimationFrame(this.update.bind(this))}render(){this.container.innerHTML=`
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
    `;const t=document.createElement("style");t.textContent=`
      .stage-combat { width: 100%; height: 100%; position: relative; cursor: crosshair; background: #f0f4f8; }
      #combat-canvas { width: 100%; height: 100%; }
      .hud { position: absolute; top: 20px; width: 100%; text-align: center; pointer-events: none; z-index: 20; }
      .hud h1 { font-size: 1.5rem; color: #0055aa; margin-bottom: 5px; font-family: 'Orbitron', sans-serif; }
      .status-text { color: #0055aa; font-family: 'Orbitron', sans-serif; font-size: 1rem; opacity: 0.8; }
      .progress { color: #333; font-weight: bold; margin-top: 5px; }
      .cockpit-overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10; }
    `,this.container.appendChild(t),this.killCountEl=document.getElementById("kill-count")}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}handleClick(t){const s=this.canvas.getBoundingClientRect(),e=t.clientX-s.left,a=t.clientY-s.top;this.projectiles.push({startX:this.canvas.width/2,startY:this.canvas.height,endX:e,endY:a,progress:0}),this.muzzleFlashes.push({x:this.canvas.width/2,y:this.canvas.height,size:30,alpha:1});for(let n=this.enemies.length-1;n>=0;n--){const i=this.enemies[n],r=e-i.x,o=a-i.y;if(Math.sqrt(r*r+o*o)<i.size){i.hp--,i.hitFlash=5,i.hp<=0&&this.destroyEnemy(n);break}}}destroyEnemy(t){const s=this.enemies[t];this.enemies.splice(t,1),this.enemiesDestroyed++,this.killCountEl.textContent=this.enemiesDestroyed,this.explosions.push({x:s.x,y:s.y,radius:1,maxRadius:s.size*2,alpha:1}),this.enemiesDestroyed>=this.targetKills&&setTimeout(()=>this.completeStage(),1e3)}spawnEnemy(){const t=Math.random();let s=1,e=30,a="#0055aa",n=2+Math.random()*2,i="scout";t>.9?(s=3,e=50,a="#e74c3c",n=.5,i="boss"):t>.6&&(s=2,e=40,a="#333333",n=.8,i="fighter"),this.enemies.push({x:Math.random()*(this.canvas.width-100)+50,y:-50,size:e,hp:s,maxHp:s,color:a,speed:n,hitFlash:0,type:i,crossedTerritory:!1})}drawEnemyShip(t,s){t.save(),t.translate(s.x,s.y),t.scale(s.size/30,s.size/30),t.strokeStyle=s.hitFlash>0?"#00f2ff":s.color,t.lineWidth=2,t.fillStyle=s.hitFlash>0?"rgba(0, 242, 255, 0.5)":"#ffffff",t.beginPath(),s.type==="boss"?(t.moveTo(0,20),t.lineTo(15,0),t.lineTo(25,-10),t.lineTo(10,-20),t.lineTo(-10,-20),t.lineTo(-25,-10),t.lineTo(-15,0),t.closePath(),t.moveTo(0,0),t.lineTo(0,-15)):s.type==="fighter"?(t.moveTo(0,15),t.lineTo(10,-5),t.lineTo(20,-10),t.lineTo(5,-15),t.lineTo(-5,-15),t.lineTo(-20,-10),t.lineTo(-10,-5),t.closePath()):(t.moveTo(0,15),t.lineTo(10,-15),t.lineTo(0,-5),t.lineTo(-10,-15),t.closePath()),t.fill(),t.stroke(),t.restore()}update(t){this.enemiesDestroyed>=this.targetKills&&this.enemies.length===0||t-this.lastSpawnTime>this.spawnInterval&&this.enemiesDestroyed+this.enemies.length<this.targetKills&&(this.spawnEnemy(),this.lastSpawnTime=t,this.spawnInterval=Math.max(500,this.spawnInterval-10)),this.ctx.fillStyle="#f0f4f8",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="rgba(0, 85, 170, 0.3)";for(let s=0;s<50;s++)this.ctx.fillRect(Math.random()*this.canvas.width,Math.random()*this.canvas.height,2,2);for(let s=this.enemies.length-1;s>=0;s--){const e=this.enemies[s];if(e.y+=e.speed*1.5,!e.crossedTerritory&&e.y>=this.canvas.height/2){e.crossedTerritory=!0,this.enemies.splice(s,1),this.flashRed=!0,this.flashRedTimer=60,this.minusOneText={x:this.canvas.width/2,y:this.canvas.height/2,alpha:1},this.enemiesDestroyed=Math.max(0,this.enemiesDestroyed-1),this.killCountEl.textContent=this.enemiesDestroyed;continue}this.drawEnemyShip(this.ctx,e),e.hitFlash>0&&e.hitFlash--,Math.random()<.02&&(this.projectiles.push({startX:e.x,startY:e.y-e.speed,endX:this.canvas.width/2+(Math.random()-.5)*200,endY:this.canvas.height,progress:0,isEnemy:!0}),this.muzzleFlashes.push({x:e.x,y:e.y+20,size:15,alpha:1,color:"#e74c3c"})),e.y>this.canvas.height+50&&this.enemies.splice(s,1)}for(let s=this.projectiles.length-1;s>=0;s--){const e=this.projectiles[s];e.progress+=.09;const a=e.startX+(e.endX-e.startX)*e.progress,n=e.startY+(e.endY-e.startY)*e.progress;if(this.ctx.beginPath(),e.isEnemy)this.ctx.moveTo(e.startX,e.startY),this.ctx.lineTo(a,n),this.ctx.setLineDash([10,10]),this.ctx.strokeStyle="#e74c3c",this.ctx.lineWidth=3,this.ctx.stroke(),this.ctx.setLineDash([]);else{const r=Math.atan2(e.endY-e.startY,e.endX-e.startX),o=a-Math.cos(r)*30,h=n-Math.sin(r)*30;this.ctx.moveTo(o,h),this.ctx.lineTo(a,n),this.ctx.shadowBlur=10,this.ctx.shadowColor="#00f2ff",this.ctx.strokeStyle="#00f2ff",this.ctx.lineWidth=4,this.ctx.stroke(),this.ctx.shadowBlur=0}e.progress>=1&&this.projectiles.splice(s,1)}for(let s=this.muzzleFlashes.length-1;s>=0;s--){const e=this.muzzleFlashes[s];e.alpha-=.2,this.ctx.save(),this.ctx.globalAlpha=e.alpha,this.ctx.fillStyle=e.color||"#00f2ff",this.ctx.beginPath(),this.ctx.arc(e.x,e.y,e.size,0,Math.PI*2),this.ctx.fill(),this.ctx.restore(),e.alpha<=0&&this.muzzleFlashes.splice(s,1)}for(let s=this.explosions.length-1;s>=0;s--){const e=this.explosions[s];e.radius+=2,e.alpha-=.05,this.ctx.beginPath(),this.ctx.arc(e.x,e.y,e.radius,0,Math.PI*2),this.ctx.strokeStyle=`rgba(0, 85, 170, ${e.alpha})`,this.ctx.lineWidth=2,this.ctx.stroke(),e.alpha<=0&&this.explosions.splice(s,1)}this.flashRed&&(this.ctx.fillStyle="rgba(255,0,0,0.3)",this.ctx.fillRect(0,this.canvas.height/2-2,this.canvas.width,4),this.flashRedTimer--,this.flashRedTimer<=0&&(this.flashRed=!1)),this.minusOneText&&(this.ctx.globalAlpha=this.minusOneText.alpha,this.ctx.fillStyle="#ff0000",this.ctx.font="30px Orbitron",this.ctx.fillText("-1",this.minusOneText.x,this.minusOneText.y),this.minusOneText.alpha-=.02,this.ctx.globalAlpha=1,this.minusOneText.alpha<=0&&(this.minusOneText=null)),this.loop=requestAnimationFrame(this.update.bind(this))}completeStage(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.canvas.removeEventListener("mousedown",this.handleClick),alert("SECTOR CLEAR. LANDING SEQUENCE INITIATED."),this.gameManager.nextStage()}cleanup(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.canvas&&this.canvas.removeEventListener("mousedown",this.handleClick)}}class b{constructor(t,s){this.container=t,this.gameManager=s,this.duration=4e3,this.startTime=null}init(){this.render(),this.startTime=Date.now(),this.loop=requestAnimationFrame(this.update.bind(this))}render(){this.container.innerHTML=`
      <div class="stage-landing">
        <canvas id="landing-canvas"></canvas>
        <div class="hud">
          <h1>PLANET LANDING</h1>
          <div class="status-text">INITIATING DESCENT...</div>
        </div>
      </div>
    `;const t=document.createElement("style");t.textContent=`
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
    `,this.container.appendChild(t),this.canvas=document.getElementById("landing-canvas"),this.ctx=this.canvas.getContext("2d"),this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas.bind(this))}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}update(){const t=Date.now()-this.startTime,s=Math.min(1,t/this.duration);this.ctx.fillStyle="#f0f4f8",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const e=this.canvas.width/2,a=this.canvas.height/2,i=10+Math.min(this.canvas.width,this.canvas.height)*.4*s;this.ctx.beginPath(),this.ctx.arc(e,a,i,0,Math.PI*2),this.ctx.strokeStyle="#0055aa",this.ctx.lineWidth=2,this.ctx.stroke(),this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(e,a,i,0,Math.PI*2),this.ctx.clip(),this.ctx.strokeStyle="rgba(0, 85, 170, 0.2)",this.ctx.lineWidth=1;const r=s*Math.PI;for(let o=0;o<8;o++){const h=e+Math.cos(r+o*Math.PI/4)*i;this.ctx.beginPath(),this.ctx.ellipse(e,a,Math.abs(h-e),i,0,0,Math.PI*2),this.ctx.stroke()}for(let o=1;o<5;o++){const h=a-i+o*i*2/5;this.ctx.beginPath(),this.ctx.moveTo(e-i,h),this.ctx.lineTo(e+i,h),this.ctx.stroke()}this.ctx.restore(),this.ctx.shadowBlur=20*s,this.ctx.shadowColor="rgba(0, 242, 255, 0.5)",this.ctx.stroke(),this.ctx.shadowBlur=0,t>=this.duration?this.completeStage():this.loop=requestAnimationFrame(this.update.bind(this))}completeStage(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.gameManager.nextStage()}cleanup(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas)}}class k{constructor(t,s){this.container=t,this.gameManager=s,this.totalSegments=80,this.scannedSegments=0,this.grid=[]}init(){this.render(),this.attachEvents()}render(){const t=this.generateMapSVG();this.container.innerHTML=`
      <div class="stage-scanning">
        <div class="hud">
          <h1>TERRITORY SCANNING</h1>
          <div class="progress-bar-container glow-box">
            <div class="progress-bar" id="scan-progress"></div>
          </div>
          <div class="status-text">SCANNED: <span id="scan-count">0</span>/${this.totalSegments}</div>
        </div>
        
        <div class="map-container">
          <div class="light-map" style="background-image: url('${t}');"></div>
          <div class="grid-overlay" id="grid-container">
            <!-- Grid items generated by JS -->
          </div>
        </div>
      </div>
    `;const s=document.createElement("style");s.textContent=`
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
      .progress-bar-container {
        width: 300px;
        height: 20px;
        margin: 0 auto 5px auto;
        background: rgba(0,0,0,0.1);
        border: 1px solid rgba(0, 100, 255, 0.3);
        border-radius: 4px;
        overflow: hidden;
      }
      .progress-bar {
        width: 0%;
        height: 100%;
        background-color: #00f2ff;
        box-shadow: 0 0 10px rgba(0, 242, 255, 0.5);
        transition: width 0.2s;
      }
      .status-text {
        color: #0055aa;
        font-weight: bold;
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
      .grid-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(8, 1fr);
        z-index: 2;
      }
      .grid-cell {
        background: #e0e5ec;
        border: 1px solid #d1d9e6;
        cursor: pointer;
        transition: opacity 0.5s ease, background-color 0.3s;
        position: relative;
      }
      .grid-cell:hover {
        background: #d1d9e6;
      }
      .grid-cell.revealed {
        opacity: 0;
        pointer-events: none;
      }
      .scan-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(0, 242, 255, 0.6) 0%, transparent 70%);
        opacity: 0;
        pointer-events: none;
        animation: glow-flash 0.5s ease-out forwards;
        z-index: 3;
      }
      @keyframes glow-flash {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
      }
      .bonus-item {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.2rem;
        font-weight: bold;
        color: #0055aa;
        text-shadow: 0 0 2px rgba(0, 242, 255, 0.5);
        pointer-events: none;
        animation: float-up 1s ease-out forwards;
        z-index: 4;
        white-space: nowrap;
      }
      @keyframes float-up {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
        100% { opacity: 0; transform: translate(-50%, -150%) scale(1.2); }
      }
    `,this.container.appendChild(s),this.gridContainer=document.getElementById("grid-container"),this.scanProgress=document.getElementById("scan-progress"),this.scanCount=document.getElementById("scan-count"),this.generateGrid()}generateGrid(){for(let t=0;t<this.totalSegments;t++){const s=document.createElement("div");s.classList.add("grid-cell"),s.dataset.index=t,Math.random()<.2&&(s.dataset.bonus=Math.random()<.5?"ENERGY":"POINTS"),s.addEventListener("click",e=>this.handleScan(s,e)),this.gridContainer.appendChild(s)}}attachEvents(){}handleScan(t,s){if(t.classList.contains("revealed"))return;t.classList.add("revealed");const e=document.createElement("div");e.classList.add("scan-glow");const a=t.getBoundingClientRect(),n=this.gridContainer.getBoundingClientRect();e.style.left=a.left-n.left+a.width/2+"px",e.style.top=a.top-n.top+a.height/2+"px",e.style.width=a.width+"px",e.style.height=a.height+"px",e.style.position="absolute",this.gridContainer.appendChild(e),setTimeout(()=>e.remove(),500),t.dataset.bonus&&this.spawnBonus(t.dataset.bonus,a,n),this.scannedSegments++,this.updateProgress(),this.scannedSegments>=this.totalSegments&&setTimeout(()=>this.completeStage(),800)}spawnBonus(t,s,e){const a=document.createElement("div");a.classList.add("bonus-item"),a.textContent=t==="ENERGY"?"+ENERGY":"+100 PTS",a.style.color=t==="ENERGY"?"#00f2ff":"#0055aa",a.style.left=s.left-e.left+s.width/2+"px",a.style.top=s.top-e.top+s.height/2+"px",this.gridContainer.appendChild(a),setTimeout(()=>a.remove(),1e3)}updateProgress(){const t=this.scannedSegments/this.totalSegments*100;this.scanProgress.style.width=`${t}%`,this.scanCount.textContent=this.scannedSegments}completeStage(){this.gameManager.nextStage()}generateMapSVG(){let e='<svg width="1000" height="700" xmlns="http://www.w3.org/2000/svg">';e+="<defs>",e+=`<radialGradient id="hillShade" cx="30%" cy="30%">
      <stop offset="0%" style="stop-color:#e8f4f8;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#b3d9e8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4a7c99;stop-opacity:1" />
    </radialGradient>`,e+=`<radialGradient id="valleyShade" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:#1a3d52;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d5a73;stop-opacity:1" />
    </radialGradient>`,e+="</defs>",e+='<rect width="100%" height="100%" fill="#d4e8f0"/>';const a=(i,r,o,h=20,f=40)=>{let d="";for(let l=0;l<h;l++){const g=Math.PI*2*l/h,m=Math.sin(g*3)*.3+Math.cos(g*5)*.2,p=o+(Math.random()-.5)*f+m*20,v=i+Math.cos(g)*p,x=r+Math.sin(g)*p;d+=(l===0?"M":"L")+v.toFixed(1)+","+x.toFixed(1)}return d+"Z"},n=[];for(let i=0;i<8;i++)n.push({cx:Math.random()*1e3,cy:Math.random()*700,r:80+Math.random()*120,elevation:Math.random()});n.forEach(i=>{const r=i.elevation>.5?"url(#hillShade)":"#a8cfe0";e+=`<path d="${a(i.cx,i.cy,i.r)}" 
        fill="${r}" stroke="none" opacity="0.6"/>`}),n.forEach(i=>{const r=6+Math.floor(i.elevation*4);for(let o=0;o<r;o++){const h=i.r-o*(i.r/r);if(h<15)continue;const f=1-o/r,d=o===0?"#1a3d52":`rgba(26, 61, 82, ${.3+f*.4})`,l=o===0?1.2:o%2===0?.8:.5;e+=`<path d="${a(i.cx,i.cy,h,20,15)}" 
          fill="none" stroke="${d}" stroke-width="${l}"/>`}});for(let i=50;i<700;i+=40){let r=`M0 ${i}`;for(let o=0;o<1e3;o+=30){const h=Math.sin(o*.02+i*.015)*15+Math.cos(o*.015)*10;r+=` L${o} ${i+h}`}e+=`<path d="${r}" fill="none" stroke="rgba(74, 124, 153, 0.2)" stroke-width="0.5"/>`}for(let i=0;i<4;i++){const r=Math.random()*1e3,o=Math.random()*700,h=60+Math.random()*80;e+=`<ellipse cx="${r}" cy="${o}" rx="${h}" ry="${h*.7}" 
        fill="url(#valleyShade)" opacity="0.3"/>`}for(let i=0;i<1e3;i+=100)e+=`<line x1="${i}" y1="0" x2="${i}" y2="700" 
        stroke="rgba(74, 124, 153, 0.15)" stroke-width="0.5" stroke-dasharray="3,3"/>`;for(let i=0;i<700;i+=100)e+=`<line x1="0" y1="${i}" x2="1000" y2="${i}" 
        stroke="rgba(74, 124, 153, 0.15)" stroke-width="0.5" stroke-dasharray="3,3"/>`;return n.forEach(i=>{i.elevation>.6&&(e+=`<circle cx="${i.cx}" cy="${i.cy}" r="3" fill="#1a3d52"/>`,e+=`<circle cx="${i.cx}" cy="${i.cy}" r="2" fill="#fff" opacity="0.5"/>`)}),e+="</svg>","data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e)}cleanup(){}}class M{constructor(t,s){this.container=t,this.gameManager=s,this.timeLeft=60,this.score=0,this.targetScore=15,this.timerInterval=null,this.spawnInterval=null}init(){this.render(),this.startTimer(),this.spawnItems()}render(){const t=this.generateMapSVG();this.container.innerHTML=`
      <div class="stage-collection">
        <div class="hud">
          <h1>SAMPLE COLLECTION</h1>
          <div class="timer glow-text" id="timer">60s</div>
          <div class="score">SAMPLES: <span id="score">0</span>/${this.targetScore}</div>
        </div>

        <div class="map-container">
          <div class="map-bg" style="background-image: url('${t}');"></div>
          <div class="collection-area" id="collection-area"></div>
        </div>
      </div>
    `;const s=document.createElement("style");s.textContent=`
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
    `,this.container.appendChild(s),this.collectionArea=document.getElementById("collection-area"),this.timerEl=document.getElementById("timer"),this.scoreEl=document.getElementById("score")}generateMapSVG(){let e='<svg width="1000" height="700" xmlns="http://www.w3.org/2000/svg">';e+="<defs>",e+=`<radialGradient id="hillShade" cx="30%" cy="30%">
      <stop offset="0%" style="stop-color:#e8f4f8;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#b3d9e8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4a7c99;stop-opacity:1" />
    </radialGradient>`,e+=`<radialGradient id="valleyShade" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:#1a3d52;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d5a73;stop-opacity:1" />
    </radialGradient>`,e+="</defs>",e+='<rect width="100%" height="100%" fill="#d4e8f0"/>';const a=(i,r,o,h=20,f=40)=>{let d="";for(let l=0;l<h;l++){const g=Math.PI*2*l/h,m=Math.sin(g*3)*.3+Math.cos(g*5)*.2,p=o+(Math.random()-.5)*f+m*20,v=i+Math.cos(g)*p,x=r+Math.sin(g)*p;d+=(l===0?"M":"L")+v.toFixed(1)+","+x.toFixed(1)}return d+"Z"},n=[];for(let i=0;i<8;i++)n.push({cx:Math.random()*1e3,cy:Math.random()*700,r:80+Math.random()*120,elevation:Math.random()});n.forEach(i=>{const r=i.elevation>.5?"url(#hillShade)":"#a8cfe0";e+=`<path d="${a(i.cx,i.cy,i.r)}" 
        fill="${r}" stroke="none" opacity="0.6"/>`}),n.forEach(i=>{const r=6+Math.floor(i.elevation*4);for(let o=0;o<r;o++){const h=i.r-o*(i.r/r);if(h<15)continue;const f=1-o/r,d=o===0?"#1a3d52":`rgba(26, 61, 82, ${.3+f*.4})`,l=o===0?1.2:o%2===0?.8:.5;e+=`<path d="${a(i.cx,i.cy,h,20,15)}" 
          fill="none" stroke="${d}" stroke-width="${l}"/>`}});for(let i=50;i<700;i+=40){let r=`M0 ${i}`;for(let o=0;o<1e3;o+=30){const h=Math.sin(o*.02+i*.015)*15+Math.cos(o*.015)*10;r+=` L${o} ${i+h}`}e+=`<path d="${r}" fill="none" stroke="rgba(74, 124, 153, 0.2)" stroke-width="0.5"/>`}for(let i=0;i<4;i++){const r=Math.random()*1e3,o=Math.random()*700,h=60+Math.random()*80;e+=`<ellipse cx="${r}" cy="${o}" rx="${h}" ry="${h*.7}" 
        fill="url(#valleyShade)" opacity="0.3"/>`}for(let i=0;i<1e3;i+=100)e+=`<line x1="${i}" y1="0" x2="${i}" y2="700" 
        stroke="rgba(74, 124, 153, 0.15)" stroke-width="0.5" stroke-dasharray="3,3"/>`;for(let i=0;i<700;i+=100)e+=`<line x1="0" y1="${i}" x2="1000" y2="${i}" 
        stroke="rgba(74, 124, 153, 0.15)" stroke-width="0.5" stroke-dasharray="3,3"/>`;return n.forEach(i=>{i.elevation>.6&&(e+=`<circle cx="${i.cx}" cy="${i.cy}" r="3" fill="#1a3d52"/>`,e+=`<circle cx="${i.cx}" cy="${i.cy}" r="2" fill="#fff" opacity="0.5"/>`)}),e+="</svg>","data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e)}startTimer(){this.timerInterval=setInterval(()=>{this.timeLeft--,this.timerEl.textContent=`${this.timeLeft}s`,this.timeLeft<=0&&this.endGame(!1)},1e3)}spawnItems(){for(let t=0;t<3;t++)this.spawnCrystal();this.spawnInterval=setInterval(()=>{document.querySelectorAll(".crystal-item").length<8&&this.spawnCrystal()},700)}spawnCrystal(){const t=document.createElement("div");t.classList.add("crystal-item"),t.style.left=`${Math.random()*90+5}%`,t.style.top=`${Math.random()*90+5}%`,t.onclick=()=>this.collect(t),this.collectionArea.appendChild(t),setTimeout(()=>{t.parentNode&&(t.style.opacity=0),setTimeout(()=>t.remove(),300)},3e3)}collect(t){t.remove(),this.score++,this.scoreEl.textContent=this.score,this.score>=this.targetScore&&this.endGame(!0)}endGame(t){clearInterval(this.timerInterval),clearInterval(this.spawnInterval),t?(alert("MISSION COMPLETE!"),this.gameManager.nextStage()):(alert("MISSION FAILED!"),location.reload())}cleanup(){clearInterval(this.timerInterval),clearInterval(this.spawnInterval)}}console.log("Stage1 module:",u);class S{constructor(t){this.container=t,this.currentStage=null,this.state={energy:0,score:0,scannedSegments:0,collectedSamples:0}}start(){this.loadStage(1)}loadStage(t){switch(this.container.innerHTML="",this.currentStage&&this.currentStage.cleanup&&this.currentStage.cleanup(),t){case 1:this.currentStage=new u(this.container,this);break;case 2:this.currentStage=new y(this.container,this);break;case 3:this.currentStage=new w(this.container,this);break;case 4:this.currentStage=new b(this.container,this);break;case 5:this.currentStage=new k(this.container,this);break;case 6:this.currentStage=new M(this.container,this);break;default:console.error("Unknown stage:",t)}this.currentStage&&this.currentStage.init()}nextStage(){this.currentStage instanceof u?this.loadStage(2):this.currentStage instanceof y?this.loadStage(3):this.currentStage instanceof w?this.loadStage(4):this.currentStage instanceof b?this.loadStage(5):this.currentStage instanceof k&&this.loadStage(6)}}document.addEventListener("DOMContentLoaded",()=>{const c=document.querySelector("#app");new S(c).start()});
