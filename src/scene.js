import * as THREE from 'three';
import gsap from 'gsap';

export class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.02);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.rocket = null;
        this.planet = null;
        this.enemies = [];

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Initial Camera for Stage 1
        this.camera.position.set(0, 2, 10);
        this.camera.lookAt(0, 2, 0);

        this.createLights();
        this.createStars();
        this.createRocket();

        window.addEventListener('resize', () => this.onResize());
        this.animate();
    }

    createLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambient);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 10, 7);
        this.scene.add(dirLight);
    }

    createStars() {
        const geo = new THREE.BufferGeometry();
        const count = 2000;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 100;
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ size: 0.05, color: 0x888888 });
        this.stars = new THREE.Points(geo, mat);
        this.scene.add(this.stars);
    }

    createRocket() {
        this.rocket = new THREE.Group();

        const neonMat = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
        const accentMat = new THREE.LineBasicMaterial({ color: 0xff00ff, linewidth: 2 });

        const bodyGeo = new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.8, 0.8, 4, 6));
        const body = new THREE.LineSegments(bodyGeo, neonMat);
        body.position.y = 2;
        this.rocket.add(body);

        const noseGeo = new THREE.EdgesGeometry(new THREE.ConeGeometry(0.8, 1.5, 6));
        const nose = new THREE.LineSegments(noseGeo, accentMat);
        nose.position.y = 4.75;
        this.rocket.add(nose);

        for (let i = 0; i < 3; i++) {
            const finGeo = new THREE.EdgesGeometry(new THREE.TetrahedronGeometry(0.8));
            const fin = new THREE.LineSegments(finGeo, neonMat);
            const angle = (i / 3) * Math.PI * 2;
            fin.position.set(Math.sin(angle) * 1.2, 0.5, Math.cos(angle) * 1.2);
            fin.lookAt(0, 0.5, 0);
            this.rocket.add(fin);
        }

        this.scene.add(this.rocket);
    }

    createCockpit() {
        this.cockpit = new THREE.Group();

        const panelGeo = new THREE.PlaneGeometry(4, 1);
        const panelMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.8 });
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.set(0, -1.5, -3);
        this.cockpit.add(panel);

        const lineGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(4, 1, 0.1));
        const lineMat = new THREE.LineBasicMaterial({ color: 0x00f3ff });
        const lines = new THREE.LineSegments(lineGeo, lineMat);
        lines.position.set(0, -1.5, -3);
        this.cockpit.add(lines);

        const crosshairGeo = new THREE.RingGeometry(0.02, 0.03, 32);
        const crosshairMat = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.8 });
        const crosshair = new THREE.Mesh(crosshairGeo, crosshairMat);
        crosshair.position.set(0, 0, -3);
        this.cockpit.add(crosshair);

        this.camera.add(this.cockpit);
        this.scene.add(this.camera);
    }

    enterShooterMode() {
        this.scene.remove(this.rocket);
        this.createCockpit();
        this.camera.position.set(0, 0, 0);
        this.camera.rotation.set(0, 0, 0);
    }

    createEnemy(type) {
        let geo, color, hp;

        if (type === 'basic') {
            geo = new THREE.OctahedronGeometry(1.0);
            color = 0xffaa00;
            hp = 1;
        } else if (type === 'strong') {
            geo = new THREE.IcosahedronGeometry(1.2);
            color = 0xff0055;
            hp = 2;
        } else {
            geo = new THREE.TetrahedronGeometry(1.5);
            color = 0xbc00ff;
            hp = 3;
        }

        const mat = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
        const mesh = new THREE.Mesh(geo, mat);

        const x = (Math.random() - 0.5) * 12;
        const y = (Math.random() - 0.5) * 8;
        const z = -10 - Math.random() * 15;
        mesh.position.set(x, y, z);
        mesh.userData = { type: 'enemy', hp, maxHp: hp };

        const wireGeo = new THREE.WireframeGeometry(geo);
        const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        mesh.add(wire);

        this.scene.add(mesh);
        this.enemies.push(mesh);

        gsap.to(mesh.rotation, { x: Math.PI, y: Math.PI, duration: 2 + Math.random() * 2, repeat: -1, ease: "none" });
        gsap.to(mesh.position, { z: mesh.position.z + 5, duration: 3, yoyo: true, repeat: -1 });

        return mesh;
    }

    raycast(x, y) {
        this.mouse.x = (x / window.innerWidth) * 2 - 1;
        this.mouse.y = -(y / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.enemies);
        return intersects.length > 0 ? intersects[0].object : null;
    }

    pulseRocket() {
        if (this.rocket) gsap.to(this.rocket.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 0.05, yoyo: true, repeat: 1 });
    }

    pulseObject(obj) {
        gsap.to(obj.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 0.1, yoyo: true, repeat: 1 });
    }

    destroyObject(obj) {
        this.createExplosion(obj.position);
        this.scene.remove(obj);
        this.enemies = this.enemies.filter(e => e !== obj);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
