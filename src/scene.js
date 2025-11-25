import * as THREE from 'three';
import gsap from 'gsap';
import { categories } from './data.js';

export class SceneManager {
    constructor(canvas, onPlanetSelect) {
        this.canvas = canvas;
        this.onPlanetSelect = onPlanetSelect;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.015);


        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.planets = [];
        this.hoveredPlanet = null;
        this.isZoomed = false;

        // Carousel State
        this.carouselGroup = new THREE.Group();
        this.scene.add(this.carouselGroup);
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.targetRotation = 0;
        this.currentRotation = 0;
        this.radius = 14;

        this.init();
        this.dragThreshold = 10; // Порог в пикселях: если смещение меньше, это "тап"
        this.draggedDistance = 0;
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 28;
        this.camera.position.y = 6;
        this.camera.lookAt(0, 0, 0);

        this.createGrid();
        this.createStars();
        this.createBlackHole();
        this.createPlanets();
        this.addLights();

        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mouseup', () => this.onMouseUp());

        // Touch events
        window.addEventListener('touchstart', (e) => this.onTouchStart(e));
        window.addEventListener('touchmove', (e) => this.onTouchMove(e));
        window.addEventListener('touchend', () => this.onTouchEnd());

        this.animate();
    }

    createGrid() {
        const gridHelper = new THREE.GridHelper(100, 40, 0x00f3ff, 0x111111);
        gridHelper.position.y = -8;
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);

        const gridHelperTop = new THREE.GridHelper(100, 20, 0x222222, 0x050505);
        gridHelperTop.position.y = 20;
        this.scene.add(gridHelperTop);
    }

    createStars() {
        const particlesGeometry = new THREE.BufferGeometry();
        const count = 5000;
        const posArray = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x00f3ff,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.stars = new THREE.Points(particlesGeometry, material);
        this.scene.add(this.stars);
    }

    createBlackHole() {
        // A simple black sphere to block stars behind it, adding depth
        const geometry = new THREE.SphereGeometry(5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        this.blackHole = new THREE.Mesh(geometry, material);
        this.blackHole.position.z = -20;
        this.scene.add(this.blackHole);

        // Accretion disk
        const diskGeo = new THREE.RingGeometry(6, 12, 64);
        const diskMat = new THREE.MeshBasicMaterial({
            color: 0x00f3ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.1
        });
        const disk = new THREE.Mesh(diskGeo, diskMat);
        disk.rotation.x = Math.PI / 2;
        disk.position.z = -20;
        this.scene.add(disk);
    }

    createPlanets() {
        const geometry = new THREE.IcosahedronGeometry(1.8, 1);

        categories.forEach((cat, index) => {
            const angle = (index / categories.length) * Math.PI * 2;
            const x = Math.sin(angle) * this.radius;
            const z = Math.cos(angle) * this.radius;

            // Wireframe Material
            const material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });

            // Inner Core
            const coreGeo = new THREE.IcosahedronGeometry(1.0, 0);
            const coreMat = new THREE.MeshBasicMaterial({
                color: 0x00f3ff,
                wireframe: true
            });
            const core = new THREE.Mesh(coreGeo, coreMat);

            const planet = new THREE.Mesh(geometry, material);
            planet.add(core);

            planet.position.set(x, 0, z);
            planet.userData = { id: cat.id, name: cat.name, angle: angle };

            // Rings
            const ringGeo = new THREE.TorusGeometry(3.0, 0.03, 16, 100);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0x444444 });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            planet.add(ring);

            this.planets.push(planet);
            this.carouselGroup.add(planet);
        });
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.camera.aspect < 1) {
            this.camera.position.z = 40;
        } else {
            if (!this.isZoomed) this.camera.position.z = 28;
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (this.isDragging && !this.isZoomed) {
            const deltaX = event.clientX - this.previousMousePosition.x;
            this.targetRotation += deltaX * 0.005;
            this.previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    }

    onMouseDown(event) {
        if (this.isZoomed) return;
        this.isDragging = true;
        this.previousMousePosition = { x: event.clientX, y: event.clientY };
    }

    onMouseUp() {
        this.isDragging = false;

        if (!this.isZoomed && this.hoveredPlanet) {
            // Если курсор был над планетой, и это был не-драг (надеемся на маленький draggedDistance)
            if (this.draggedDistance < this.dragThreshold) {
                this.zoomToPlanet(this.hoveredPlanet);
            }
        }
        this.draggedDistance = 0;
    }

    // Touch Handlers
    onTouchStart(event) {
        if (this.isZoomed) return;
        const touch = event.touches[0];
        this.isDragging = true;
        this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
        this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        this.draggedDistance = 0;
    }

    onTouchMove(event) {
        const touch = event.touches[0];
        this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;

        if (this.isDragging && !this.isZoomed) {
            const deltaX = touch.clientX - this.previousMousePosition.x;
            this.targetRotation += deltaX * 0.005;
            this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
        }
    }

    onTouchEnd() {
        this.isDragging = false;

        if (!this.isZoomed && this.draggedDistance < this.dragThreshold) {

            // Выполняем Raycasting по последним координатам тача
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.planets);

            if (intersects.length > 0) {
                // Если найдена планета, вызываем зум
                const object = intersects[0].object;
                this.zoomToPlanet(object);
            }
        }
        this.draggedDistance = 0
        // Check for click simulation if needed, but onClick usually fires on tap
    }



    zoomToPlanet(planet) {
        this.isZoomed = true;

        // Convert world position to local relative to camera isn't needed, just get world pos
        const targetPos = new THREE.Vector3();
        planet.getWorldPosition(targetPos);

        targetPos.y += 2;
        targetPos.z += 8; // Offset

        gsap.to(this.camera.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 1.5,
            ease: "power3.inOut",
            onUpdate: () => {
                const lookAtPos = new THREE.Vector3();
                planet.getWorldPosition(lookAtPos);
                this.camera.lookAt(lookAtPos);
            }
        });

        this.onPlanetSelect(planet.userData.id);
    }

    resetCamera() {
        this.isZoomed = false;
        const targetZ = (this.camera.aspect < 1) ? 40 : 28;

        gsap.to(this.camera.position, {
            x: 0,
            y: 6,
            z: targetZ,
            duration: 1.5,
            ease: "power3.inOut",
            onUpdate: () => this.camera.lookAt(0, 0, 0)
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Carousel Rotation with Inertia
        if (!this.isZoomed) {
            this.currentRotation += (this.targetRotation - this.currentRotation) * 0.05;
            this.carouselGroup.rotation.y = this.currentRotation;
        }

        // Star animation
        if (this.stars) {
            this.stars.rotation.y -= 0.0005;
        }

        // Raycasting
        if (!this.isZoomed) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.planets);

            if (intersects.length > 0) {
                const object = intersects[0].object;
                if (this.hoveredPlanet !== object) {
                    this.hoveredPlanet = object;
                    document.body.style.cursor = 'pointer';
                    gsap.to(object.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.3 });
                    object.material.opacity = 0.8;
                    object.material.color.setHex(0x00f3ff);
                }
            } else {
                if (this.hoveredPlanet) {
                    gsap.to(this.hoveredPlanet.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
                    this.hoveredPlanet.material.opacity = 0.3;
                    this.hoveredPlanet.material.color.setHex(0xffffff);
                    this.hoveredPlanet = null;
                    document.body.style.cursor = 'default';
                }
            }
        }

        // Highlight Center Planet Logic (Optional visual cue)
        // We could calculate which planet is closest to z-index positive and scale it up slightly

        this.planets.forEach(planet => {
            planet.rotation.y += 0.01;
            planet.children[0].rotation.y -= 0.02;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

