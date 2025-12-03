(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const e of i.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&a(e)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();class u{constructor(t,n){this.container=t,this.gameManager=n,this.energy=0,this.decayRate=2,this.clickValue=1.5,this.lastFrameTime=0,this.isActive=!1,this.particles=[]}init(){this.isActive=!0,this.render(),this.initParticles(),this.attachEvents(),this.loop=requestAnimationFrame(this.update.bind(this))}render(){this.container.innerHTML=`
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
    `,this.container.appendChild(t),this.energyFill=document.getElementById("energy-fill"),this.energyText=document.getElementById("energy-text"),this.rocket=document.getElementById("rocket"),this.canvas=document.getElementById("bg-canvas"),this.ctx=this.canvas.getContext("2d"),this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas.bind(this))}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}initParticles(){for(let t=0;t<100;t++)this.particles.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,size:Math.random()*2,speedY:Math.random()*.5+.1,opacity:Math.random()*.5+.1})}updateParticles(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.fillStyle="#0055aa",this.particles.forEach(t=>{t.y-=t.speedY,t.y<0&&(t.y=this.canvas.height,t.x=Math.random()*this.canvas.width),this.ctx.globalAlpha=t.opacity,this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.size,0,Math.PI*2),this.ctx.fill()}),this.ctx.globalAlpha=1}attachEvents(){this.rocket.addEventListener("click",()=>{this.energy=Math.min(100,this.energy+this.clickValue),this.triggerVisualFeedback(),this.energy>=100&&(this.energy=100,this.completeStage())})}triggerVisualFeedback(){this.rocket.classList.remove("pulse"),this.rocket.offsetWidth,this.rocket.classList.add("pulse")}update(t){if(!this.isActive)return;this.lastFrameTime||(this.lastFrameTime=t);const n=(t-this.lastFrameTime)/1e3;this.lastFrameTime=t,this.energy>0&&(this.energy=Math.max(0,this.energy-this.decayRate*n)),this.energyFill.style.width=`${Math.min(100,this.energy)}%`,this.energyText.textContent=`${Math.min(100,Math.round(this.energy))}%`,this.updateParticles(),this.isActive&&(this.loop=requestAnimationFrame(this.update.bind(this)))}completeStage(){this.isActive=!1,cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.gameManager.nextStage()}cleanup(){this.isActive=!1,cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas)}}class y{constructor(t,n){this.container=t,this.gameManager=n,this.duration=5e3,this.startTime=null,this.speed=0,this.maxSpeed=50,this.acceleration=.5}init(){this.render(),this.startTime=Date.now(),this.loop=requestAnimationFrame(this.update.bind(this))}render(){this.container.innerHTML=`
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
    `,this.container.appendChild(t),this.canvas=document.getElementById("flight-canvas"),this.ctx=this.canvas.getContext("2d"),this.rocketOverlay=document.getElementById("rocket-overlay"),this.engineFlame=document.getElementById("engine-flame"),this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas.bind(this)),this.stars=[];for(let n=0;n<200;n++)this.stars.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,z:Math.random()*2+.5})}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}update(){const t=Date.now()-this.startTime;this.speed<this.maxSpeed&&(this.speed+=this.acceleration),this.ctx.fillStyle="#f0f4f8",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height),this.stars.forEach(i=>{const e=this.speed/2*i.z;i.y+=e,i.y>this.canvas.height&&(i.y=-50,i.x=Math.random()*this.canvas.width,i.z=Math.random()*2+.5);const h=i.z*(this.speed/2);this.ctx.beginPath(),this.ctx.moveTo(i.x,i.y),this.ctx.lineTo(i.x,i.y-h),this.ctx.strokeStyle=`rgba(0, 85, 170, ${Math.min(.5,i.z/5)})`,this.ctx.lineWidth=Math.min(3,i.z*.5),this.ctx.stroke()});const n=(Math.random()-.5)*(this.speed/5),a=(Math.random()-.5)*(this.speed/5);this.rocketOverlay.style.transform=`translate(calc(-50% + ${n}px), calc(-50% + ${a}px))`;const s=30+this.speed*1.5+Math.random()*10;this.engineFlame.setAttribute("d",`M85 260 L100 ${260+s} L115 260`),t>=this.duration?this.completeStage():this.loop=requestAnimationFrame(this.update.bind(this))}completeStage(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.gameManager.nextStage()}cleanup(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas)}}class w{constructor(t,n){this.container=t,this.gameManager=n,this.canvas=null,this.ctx=null,this.enemies=[],this.projectiles=[],this.particles=[],this.buildings=[],this.floatingTexts=[],this.score=0,this.money=0,this.kills=0,this.targetKills=130,this.maxHP=5,this.hp=5,this.weaponLevel=1,this.weaponDamage=1,this.upgradeCost=70,this.spawnTimer=0,this.spawnInterval=30,this.gunRecoil=0,this.roadZ=0,this.isGameOver=!1,this.loop=null,this.handleClick=this.handleClick.bind(this),this.resizeCanvas=this.resizeCanvas.bind(this),this.restartGame=this.restartGame.bind(this)}init(){this.container.innerHTML="",this.isGameOver=!1,this.enemies=[],this.projectiles=[],this.particles=[],this.floatingTexts=[],this.buildings=[],this.kills=0,this.money=0,this.hp=this.maxHP,this.spawnInterval=60,this.weaponLevel=1,this.weaponDamage=1,this.upgradeCost=70,this.gunRecoil=0,this.canvas=document.createElement("canvas"),this.canvas.id="combat-canvas",this.ctx=this.canvas.getContext("2d"),this.container.appendChild(this.canvas);const t=document.createElement("div");t.className="combat-ui",t.innerHTML=`
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
        `,this.container.appendChild(t);const n=document.createElement("style");n.textContent=`
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
        `,this.container.appendChild(n),this.hpFill=document.getElementById("hp-fill"),this.scoreDisplay=document.getElementById("score-display"),this.moneyDisplay=document.getElementById("money-display"),this.upgradeBtn=document.getElementById("upgrade-btn"),this.upgradeCostDisplay=document.getElementById("upgrade-cost"),this.upgradeCostDisplay.textContent="$"+this.upgradeCost,this.centerMessage=document.getElementById("center-message"),this.gameOverScreen=document.getElementById("game-over-screen"),this.retryBtn=document.getElementById("retry-btn"),this.upgradeBtn.onclick=a=>{a.stopPropagation(),this.buyUpgrade()},this.retryBtn.onclick=a=>{a.stopPropagation(),this.restartGame()};for(let a=0;a<40;a++)this.buildings.push(this.createBuilding(!0));this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas),this.canvas.addEventListener("mousedown",this.handleClick),this.canvas.addEventListener("touchstart",a=>{a.preventDefault(),this.handleClick(a.touches[0])},{passive:!1}),this.loop=requestAnimationFrame(this.update.bind(this)),setTimeout(()=>{this.centerMessage&&(this.centerMessage.style.display="none")},3e3),this.checkUpgradeAvailability(),this.upgradeBtn.classList.add("interactive"),this.moneyDisplay.parentElement.classList.add("interactive")}createBuilding(t=!1){const a=(Math.random()>.5?1:-1)*(200+Math.random()*800),s=t?Math.random()*2e3:2e3;return{x:a,z:s,w:100+Math.random()*200,h:200+Math.random()*500}}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}handleClick(t){if(this.isGameOver)return;const n=this.canvas.getBoundingClientRect(),a=t.clientX-n.left,s=t.clientY-n.top;this.fireShot(a,s);for(let i=this.enemies.length-1;i>=0;i--){const e=this.enemies[i],h=800/(800+e.z),o=this.canvas.width/2+e.x*h,r=this.canvas.height/2+e.y*h,l=e.size*h,d=a-o,c=s-r;if(d*d+c*c<(l/2+20)**2){this.damageEnemy(e,i);break}}}fireShot(t,n){this.gunRecoil=15,this.particles.push({type:"muzzle",life:5});let a=2+this.weaponLevel,s="#FFF";this.weaponLevel>=3&&(s="#0FF"),this.weaponLevel>=5&&(s="#F0F"),this.weaponLevel>=8&&(s="#FFD700"),this.projectiles.push({x:t,y:n,life:10,width:a,color:s})}damageEnemy(t,n){t.hp-=this.weaponDamage,t.flash=5;const a=800/(800+t.z),s=this.canvas.width/2+t.x*a,i=this.canvas.height/2+t.y*a;for(let e=0;e<5;e++)this.particles.push({type:"spark",x:s,y:i,vx:(Math.random()-.5)*10,vy:(Math.random()-.5)*10,life:20});t.hp<=0&&this.killEnemy(t,n)}killEnemy(t,n){const a=800/(800+t.z),s=this.canvas.width/2+t.x*a,i=this.canvas.height/2+t.y*a;this.enemies.splice(n,1),this.kills++,this.scoreDisplay.textContent=this.kills;const e=1+Math.floor(Math.random()*3);this.money+=e,this.moneyDisplay.textContent=this.money,this.checkUpgradeAvailability(),this.floatingTexts.push({x:s,y:i,text:`+$${e}`,life:60,vy:-2}),this.kills>=this.targetKills&&this.completeStage()}buyUpgrade(){this.money>=this.upgradeCost&&(this.money-=this.upgradeCost,this.weaponLevel++,this.weaponDamage++,this.upgradeCost+=50,this.moneyDisplay.textContent=this.money,this.upgradeCostDisplay.textContent="$"+this.upgradeCost,this.checkUpgradeAvailability())}checkUpgradeAvailability(){this.upgradeBtn.disabled=this.money<this.upgradeCost}spawnEnemy(){const t=this.kills>0&&this.kills%50===0&&!this.enemies.some(e=>e.type==="boss");let n="scout",a=60,s=1+Math.floor(this.kills/20),i=5+this.kills*.05;t?(n="boss",a=150,s=20+this.kills/10,i=2):Math.random()>.8&&(n="fighter",a=80,s*=2,i*=.8),this.enemies.push({x:(Math.random()-.5)*800,y:100,z:2e3,type:n,size:a,hp:s,maxHp:s,speed:i,flash:0,wobbleOffset:Math.random()*Math.PI*2})}takeDamage(){this.hp--,this.hpFill.style.width=`${this.hp/this.maxHP*100}%`;const t=document.createElement("div");t.style.position="absolute",t.style.top="0",t.style.left="0",t.style.width="100%",t.style.height="100%",t.style.background="rgba(255,0,0,0.3)",t.style.pointerEvents="none",this.container.appendChild(t),setTimeout(()=>t.remove(),200),this.hp<=0&&this.gameOver()}gameOver(){this.isGameOver=!0,this.gameOverScreen.style.display="flex"}restartGame(){this.init()}completeStage(){this.isGameOver=!0,cancelAnimationFrame(this.loop),alert("SECTOR CLEARED! PROCEEDING TO LANDING."),this.gameManager.nextStage()}update(){if(this.isGameOver)return;this.ctx.fillStyle="#000",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const t=this.canvas.width/2,n=this.canvas.height/2,a=800;this.ctx.fillStyle="#FFF";for(let s=0;s<50;s++){const i=(Math.sin(s*132+Date.now()*1e-4)*this.canvas.width+this.canvas.width)%this.canvas.width,e=Math.cos(s*453+Date.now()*1e-4)*this.canvas.height/2;this.ctx.fillRect(i,e,1,1)}this.ctx.strokeStyle="#FFF",this.ctx.lineWidth=1,this.roadZ-=10,this.roadZ<0&&(this.roadZ+=100),this.ctx.beginPath(),this.ctx.moveTo(0,n),this.ctx.lineTo(this.canvas.width,n),this.ctx.stroke();for(let s=this.roadZ;s<2e3;s+=100){const i=a/(a+s),e=n+200*i;this.ctx.beginPath(),this.ctx.moveTo(0,e),this.ctx.lineTo(this.canvas.width,e),this.ctx.globalAlpha=1-s/2e3,this.ctx.stroke()}for(let s=-1e3;s<=1e3;s+=200){const i=a/(a+0),e=t+s*i,h=n+200*i,o=a/(a+2e3),r=t+s*o,l=n+200*o;this.ctx.beginPath(),this.ctx.moveTo(e,h),this.ctx.lineTo(r,l),this.ctx.globalAlpha=.3,this.ctx.stroke()}this.ctx.globalAlpha=1,this.buildings.forEach(s=>{if(s.z-=10,s.z<-a&&(s.z=2e3),s.z>0){const i=a/(a+s.z),e=t+s.x*i,h=n+200*i,o=s.w*i,r=s.h*i;this.ctx.strokeRect(e-o/2,h-r,o,r),this.ctx.beginPath(),this.ctx.moveTo(e-o/2,h-r),this.ctx.lineTo(e-o/2+o/4,h-r-r/4),this.ctx.stroke()}}),this.spawnTimer++,this.spawnTimer>this.spawnInterval&&(this.spawnEnemy(),this.spawnTimer=0,this.spawnInterval>20&&(this.spawnInterval-=.1));for(let s=this.enemies.length-1;s>=0;s--){const i=this.enemies[s];if(i.z-=i.speed,i.x+=Math.sin(Date.now()*.002+i.wobbleOffset)*2,i.flash>0&&i.flash--,i.z>0){const e=a/(a+i.z),h=t+i.x*e,o=n+i.y*e,r=i.size*e;this.ctx.save(),this.ctx.translate(h,o),this.ctx.shadowBlur=20,this.ctx.shadowColor="#FFF",this.ctx.fillStyle=i.flash>0?"#F00":"#000",this.ctx.strokeStyle="#FFF",this.ctx.lineWidth=2,this.ctx.beginPath(),i.type==="boss"?(this.ctx.rect(-r/2,-r/2,r,r),this.ctx.rect(-r/4,-r,r/2,r/2)):(this.ctx.moveTo(0,-r/2),this.ctx.lineTo(r/2,0),this.ctx.lineTo(0,r/2),this.ctx.lineTo(-r/2,0),this.ctx.closePath()),this.ctx.fill(),this.ctx.stroke();const l=i.hp/i.maxHp;this.ctx.fillStyle="#FFF",this.ctx.fillRect(-r/2,-r/2-10,r*l,5),this.ctx.restore()}i.z<100&&(this.enemies.splice(s,1),this.takeDamage())}this.ctx.save(),this.ctx.translate(t,this.canvas.height),this.ctx.translate(0,this.gunRecoil),this.ctx.fillStyle="#111",this.ctx.strokeStyle="#555",this.ctx.lineWidth=2,this.ctx.beginPath(),this.ctx.moveTo(-40,0),this.ctx.lineTo(-30,-150),this.ctx.lineTo(-20,-150),this.ctx.lineTo(-20,-200),this.ctx.lineTo(20,-200),this.ctx.lineTo(20,-150),this.ctx.lineTo(30,-150),this.ctx.lineTo(40,0),this.ctx.fill(),this.ctx.stroke(),this.ctx.fillStyle="#333",this.ctx.fillRect(-5,-200,10,200),this.ctx.restore(),this.gunRecoil>0&&(this.gunRecoil-=2);for(let s=this.particles.length-1;s>=0;s--){const i=this.particles[s];i.life--,i.type==="muzzle"?(this.ctx.save(),this.ctx.translate(t,this.canvas.height-200),this.ctx.fillStyle=`rgba(255, 255, 255, ${i.life/5})`,this.ctx.beginPath(),this.ctx.arc(0,0,30+Math.random()*20,0,Math.PI*2),this.ctx.fill(),this.ctx.restore()):i.type==="spark"&&(i.x+=i.vx,i.y+=i.vy,this.ctx.fillStyle="#FFF",this.ctx.fillRect(i.x,i.y,2,2)),i.life<=0&&this.particles.splice(s,1)}this.ctx.font='bold 20px "Orbitron", sans-serif',this.ctx.textAlign="center";for(let s=this.floatingTexts.length-1;s>=0;s--){const i=this.floatingTexts[s];i.y+=i.vy,i.life--,this.ctx.fillStyle=`rgba(255, 215, 0, ${i.life/30})`,this.ctx.fillText(i.text,i.x,i.y),i.life<=0&&this.floatingTexts.splice(s,1)}this.ctx.lineWidth=1,this.ctx.beginPath();for(let s=this.projectiles.length-1;s>=0;s--){const i=this.projectiles[s];i.life--,this.ctx.strokeStyle=i.color||"#FFF",this.ctx.lineWidth=i.width||2,this.ctx.beginPath(),this.ctx.moveTo(t,this.canvas.height-200),this.ctx.lineTo(i.x,i.y),this.ctx.stroke(),i.life<=0&&this.projectiles.splice(s,1)}this.loop=requestAnimationFrame(this.update.bind(this))}cleanup(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.canvas&&(this.canvas.removeEventListener("mousedown",this.handleClick),this.canvas.removeEventListener("touchstart",this.handleClick))}}class b{constructor(t,n){this.container=t,this.gameManager=n,this.duration=4e3,this.startTime=null}init(){this.render(),this.startTime=Date.now(),this.loop=requestAnimationFrame(this.update.bind(this))}render(){this.container.innerHTML=`
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
    `,this.container.appendChild(t),this.canvas=document.getElementById("landing-canvas"),this.ctx=this.canvas.getContext("2d"),this.resizeCanvas(),window.addEventListener("resize",this.resizeCanvas.bind(this))}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}update(){const t=Date.now()-this.startTime,n=Math.min(1,t/this.duration);this.ctx.fillStyle="#f0f4f8",this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);const a=this.canvas.width/2,s=this.canvas.height/2,e=10+Math.min(this.canvas.width,this.canvas.height)*.4*n;this.ctx.beginPath(),this.ctx.arc(a,s,e,0,Math.PI*2),this.ctx.strokeStyle="#0055aa",this.ctx.lineWidth=2,this.ctx.stroke(),this.ctx.save(),this.ctx.beginPath(),this.ctx.arc(a,s,e,0,Math.PI*2),this.ctx.clip(),this.ctx.strokeStyle="rgba(0, 85, 170, 0.2)",this.ctx.lineWidth=1;const h=n*Math.PI;for(let o=0;o<8;o++){const r=a+Math.cos(h+o*Math.PI/4)*e;this.ctx.beginPath(),this.ctx.ellipse(a,s,Math.abs(r-a),e,0,0,Math.PI*2),this.ctx.stroke()}for(let o=1;o<5;o++){const r=s-e+o*e*2/5;this.ctx.beginPath(),this.ctx.moveTo(a-e,r),this.ctx.lineTo(a+e,r),this.ctx.stroke()}this.ctx.restore(),this.ctx.shadowBlur=20*n,this.ctx.shadowColor="rgba(0, 242, 255, 0.5)",this.ctx.stroke(),this.ctx.shadowBlur=0,t>=this.duration?this.completeStage():this.loop=requestAnimationFrame(this.update.bind(this))}completeStage(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas),this.gameManager.nextStage()}cleanup(){cancelAnimationFrame(this.loop),window.removeEventListener("resize",this.resizeCanvas)}}class k{constructor(t,n){this.container=t,this.gameManager=n,this.totalSegments=80,this.scannedSegments=0,this.grid=[]}init(){this.render(),this.attachEvents()}render(){const t=this.generateMapSVG();this.container.innerHTML=`
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
    `;const n=document.createElement("style");n.textContent=`
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
    `,this.container.appendChild(n),this.gridContainer=document.getElementById("grid-container"),this.scanProgress=document.getElementById("scan-progress"),this.scanCount=document.getElementById("scan-count"),this.generateGrid()}generateGrid(){for(let t=0;t<this.totalSegments;t++){const n=document.createElement("div");n.classList.add("grid-cell"),n.dataset.index=t,Math.random()<.2&&(n.dataset.bonus=Math.random()<.5?"ENERGY":"POINTS"),n.addEventListener("click",a=>this.handleScan(n,a)),this.gridContainer.appendChild(n)}}attachEvents(){}handleScan(t,n){if(t.classList.contains("revealed"))return;t.classList.add("revealed");const a=document.createElement("div");a.classList.add("scan-glow");const s=t.getBoundingClientRect(),i=this.gridContainer.getBoundingClientRect();a.style.left=s.left-i.left+s.width/2+"px",a.style.top=s.top-i.top+s.height/2+"px",a.style.width=s.width+"px",a.style.height=s.height+"px",a.style.position="absolute",this.gridContainer.appendChild(a),setTimeout(()=>a.remove(),500),t.dataset.bonus&&this.spawnBonus(t.dataset.bonus,s,i),this.scannedSegments++,this.updateProgress(),this.scannedSegments>=this.totalSegments&&setTimeout(()=>this.completeStage(),800)}spawnBonus(t,n,a){const s=document.createElement("div");s.classList.add("bonus-item"),s.textContent=t==="ENERGY"?"+ENERGY":"+100 PTS",s.style.color=t==="ENERGY"?"#00f2ff":"#0055aa",s.style.left=n.left-a.left+n.width/2+"px",s.style.top=n.top-a.top+n.height/2+"px",this.gridContainer.appendChild(s),setTimeout(()=>s.remove(),1e3)}updateProgress(){const t=this.scannedSegments/this.totalSegments*100;this.scanProgress.style.width=`${t}%`,this.scanCount.textContent=this.scannedSegments}completeStage(){this.gameManager.nextStage()}generateMapSVG(){let a='<svg width="1000" height="700" xmlns="http://www.w3.org/2000/svg">';a+="<defs>",a+=`<radialGradient id="hillShade" cx="30%" cy="30%">
      <stop offset="0%" style="stop-color:#e8f4f8;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#b3d9e8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4a7c99;stop-opacity:1" />
    </radialGradient>`,a+=`<radialGradient id="valleyShade" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:#1a3d52;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d5a73;stop-opacity:1" />
    </radialGradient>`,a+="</defs>",a+='<rect width="100%" height="100%" fill="#d4e8f0"/>';const s=(e,h,o,r=20,l=40)=>{let d="";for(let c=0;c<r;c++){const g=Math.PI*2*c/r,m=Math.sin(g*3)*.3+Math.cos(g*5)*.2,f=o+(Math.random()-.5)*l+m*20,x=e+Math.cos(g)*f,v=h+Math.sin(g)*f;d+=(c===0?"M":"L")+x.toFixed(1)+","+v.toFixed(1)}return d+"Z"},i=[];for(let e=0;e<8;e++)i.push({cx:Math.random()*1e3,cy:Math.random()*700,r:80+Math.random()*120,elevation:Math.random()});i.forEach(e=>{const h=e.elevation>.5?"url(#hillShade)":"#a8cfe0";a+=`<path d="${s(e.cx,e.cy,e.r)}" 
        fill="${h}" stroke="none" opacity="0.6"/>`}),i.forEach(e=>{const h=6+Math.floor(e.elevation*4);for(let o=0;o<h;o++){const r=e.r-o*(e.r/h);if(r<15)continue;const l=1-o/h,d=o===0?"#1a3d52":`rgba(26, 61, 82, ${.3+l*.4})`,c=o===0?1.2:o%2===0?.8:.5;a+=`<path d="${s(e.cx,e.cy,r,20,15)}" 
          fill="none" stroke="${d}" stroke-width="${c}"/>`}});for(let e=50;e<700;e+=40){let h=`M0 ${e}`;for(let o=0;o<1e3;o+=30){const r=Math.sin(o*.02+e*.015)*15+Math.cos(o*.015)*10;h+=` L${o} ${e+r}`}a+=`<path d="${h}" fill="none" stroke="rgba(74, 124, 153, 0.2)" stroke-width="0.5"/>`}for(let e=0;e<4;e++){const h=Math.random()*1e3,o=Math.random()*700,r=60+Math.random()*80;a+=`<ellipse cx="${h}" cy="${o}" rx="${r}" ry="${r*.7}" 
        fill="url(#valleyShade)" opacity="0.3"/>`}for(let e=0;e<1e3;e+=100)a+=`<line x1="${e}" y1="0" x2="${e}" y2="700" 
        stroke="rgba(74, 124, 153, 0.15)" stroke-width="0.5" stroke-dasharray="3,3"/>`;for(let e=0;e<700;e+=100)a+=`<line x1="0" y1="${e}" x2="1000" y2="${e}" 
        stroke="rgba(74, 124, 153, 0.15)" stroke-width="0.5" stroke-dasharray="3,3"/>`;return i.forEach(e=>{e.elevation>.6&&(a+=`<circle cx="${e.cx}" cy="${e.cy}" r="3" fill="#1a3d52"/>`,a+=`<circle cx="${e.cx}" cy="${e.cy}" r="2" fill="#fff" opacity="0.5"/>`)}),a+="</svg>","data:image/svg+xml;charset=utf-8,"+encodeURIComponent(a)}cleanup(){}}class M{constructor(t,n){this.container=t,this.gameManager=n,this.timeLeft=60,this.score=0,this.targetScore=15,this.timerInterval=null,this.spawnInterval=null}init(){this.render(),this.startTimer(),this.spawnItems()}render(){const t=this.generateMapSVG();this.container.innerHTML=`
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
    `;const n=document.createElement("style");n.textContent=`
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
    `,this.container.appendChild(n),this.collectionArea=document.getElementById("collection-area"),this.timerEl=document.getElementById("timer"),this.scoreEl=document.getElementById("score")}generateMapSVG(){let a='<svg width="1000" height="700" xmlns="http://www.w3.org/2000/svg">';a+="<defs>",a+=`<radialGradient id="hillShade" cx="30%" cy="30%">
      <stop offset="0%" style="stop-color:#e8f4f8;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#b3d9e8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4a7c99;stop-opacity:1" />
    </radialGradient>`,a+=`<radialGradient id="valleyShade" cx="50%" cy="50%">
      <stop offset="0%" style="stop-color:#1a3d52;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d5a73;stop-opacity:1" />
    </radialGradient>`,a+="</defs>",a+='<rect width="100%" height="100%" fill="#d4e8f0"/>';const s=(e,h,o,r=20,l=40)=>{let d="";for(let c=0;c<r;c++){const g=Math.PI*2*c/r,m=Math.sin(g*3)*.3+Math.cos(g*5)*.2,f=o+(Math.random()-.5)*l+m*20,x=e+Math.cos(g)*f,v=h+Math.sin(g)*f;d+=(c===0?"M":"L")+x.toFixed(1)+","+v.toFixed(1)}return d+"Z"},i=[];for(let e=0;e<8;e++)i.push({cx:Math.random()*1e3,cy:Math.random()*700,r:80+Math.random()*120,elevation:Math.random()});i.forEach(e=>{const h=e.elevation>.5?"url(#hillShade)":"#a8cfe0";a+=`<path d="${s(e.cx,e.cy,e.r)}" 
        fill="${h}" stroke="none" opacity="0.6"/>`}),i.forEach(e=>{const h=6+Math.floor(e.elevation*4);for(let o=0;o<h;o++){const r=e.r-o*(e.r/h);if(r<15)continue;const l=1-o/h,d=o===0?"#1a3d52":`rgba(26, 61, 82, ${.3+l*.4})`,c=o===0?1.2:o%2===0?.8:.5;a+=`<path d="${s(e.cx,e.cy,r,20,15)}" 
          fill="none" stroke="${d}" stroke-width="${c}"/>`}});for(let e=50;e<700;e+=40){let h=`M0 ${e}`;for(let o=0;o<1e3;o+=30){const r=Math.sin(o*.02+e*.015)*15+Math.cos(o*.015)*10;h+=` L${o} ${e+r}`}a+=`<path d="${h}" fill="none" stroke="rgba(74, 124, 153, 0.2)" stroke-width="0.5"/>`}for(let e=0;e<4;e++){const h=Math.random()*1e3,o=Math.random()*700,r=60+Math.random()*80;a+=`<ellipse cx="${h}" cy="${o}" rx="${r}" ry="${r*.7}" 
        fill="url(#valleyShade)" opacity="0.3"/>`}for(let e=0;e<1e3;e+=100)a+=`<line x1="${e}" y1="0" x2="${e}" y2="700" 
        stroke="rgba(74, 124, 153, 0.15)" stroke-width="0.5" stroke-dasharray="3,3"/>`;for(let e=0;e<700;e+=100)a+=`<line x1="0" y1="${e}" x2="1000" y2="${e}" 
        stroke="rgba(74, 124, 153, 0.15)" stroke-width="0.5" stroke-dasharray="3,3"/>`;return i.forEach(e=>{e.elevation>.6&&(a+=`<circle cx="${e.cx}" cy="${e.cy}" r="3" fill="#1a3d52"/>`,a+=`<circle cx="${e.cx}" cy="${e.cy}" r="2" fill="#fff" opacity="0.5"/>`)}),a+="</svg>","data:image/svg+xml;charset=utf-8,"+encodeURIComponent(a)}startTimer(){this.timerInterval=setInterval(()=>{this.timeLeft--,this.timerEl.textContent=`${this.timeLeft}s`,this.timeLeft<=0&&this.endGame(!1)},1e3)}spawnItems(){for(let t=0;t<3;t++)this.spawnCrystal();this.spawnInterval=setInterval(()=>{document.querySelectorAll(".crystal-item").length<8&&this.spawnCrystal()},700)}spawnCrystal(){const t=document.createElement("div");t.classList.add("crystal-item"),t.style.left=`${Math.random()*90+5}%`,t.style.top=`${Math.random()*90+5}%`,t.onclick=()=>this.collect(t),this.collectionArea.appendChild(t),setTimeout(()=>{t.parentNode&&(t.style.opacity=0),setTimeout(()=>t.remove(),300)},3e3)}collect(t){t.remove(),this.score++,this.scoreEl.textContent=this.score,this.score>=this.targetScore&&this.endGame(!0)}endGame(t){clearInterval(this.timerInterval),clearInterval(this.spawnInterval),t?(alert("MISSION COMPLETE!"),this.gameManager.nextStage()):(alert("MISSION FAILED!"),location.reload())}cleanup(){clearInterval(this.timerInterval),clearInterval(this.spawnInterval)}}console.log("Stage1 module:",u);class S{constructor(t){this.container=t,this.currentStage=null,this.state={energy:0,score:0,scannedSegments:0,collectedSamples:0}}start(){this.loadStage(1)}loadStage(t){switch(this.container.innerHTML="",this.currentStage&&this.currentStage.cleanup&&this.currentStage.cleanup(),t){case 1:this.currentStage=new u(this.container,this);break;case 2:this.currentStage=new y(this.container,this);break;case 3:this.currentStage=new w(this.container,this);break;case 4:this.currentStage=new b(this.container,this);break;case 5:this.currentStage=new k(this.container,this);break;case 6:this.currentStage=new M(this.container,this);break;default:console.error("Unknown stage:",t)}this.currentStage&&this.currentStage.init()}nextStage(){this.currentStage instanceof u?this.loadStage(2):this.currentStage instanceof y?this.loadStage(3):this.currentStage instanceof w?this.loadStage(4):this.currentStage instanceof b?this.loadStage(5):this.currentStage instanceof k&&this.loadStage(6)}}document.addEventListener("DOMContentLoaded",()=>{const p=document.querySelector("#app");new S(p).start()});
