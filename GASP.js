/* ==========================================================================
   SKITS GLOBAL ANIMATION & 3D ENGINE (Defensive Architecture)
   ========================================================================== */

window.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================================
    // 1. MOBILE INTERACTIVE NAVIGATION SCRIPT HOOK
    // =======================================================================
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const menuPanel = document.getElementById('mobile-menu-panel');

    if (toggleBtn && menuPanel) {
        toggleBtn.addEventListener('click', () => {
            menuPanel.classList.toggle('hidden');
            const isHidden = menuPanel.classList.contains('hidden');
            toggleBtn.innerHTML = isHidden 
                ? `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>`
                : `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;
        });

        menuPanel.querySelectorAll('a, button').forEach(link => {
            link.addEventListener('click', () => {
                menuPanel.classList.add('hidden');
                toggleBtn.innerHTML = `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>`;
            });
        });
    }

    // =======================================================================
    // 2. GSAP ENTRANCE TIMELINE (Cinematic Reveal)
    // =======================================================================
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        const tl = gsap.timeline();
        
        // --- A. Preloader Logic ---
        const preloaderElement = document.getElementById("preloader");
        if (preloaderElement) {
            tl.to(preloaderElement, {
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => { 
                    preloaderElement.style.display = "none"; 
                }
            });
        }

        // --- B. Hero Content Logic (Cinematic Text Reveal) ---
        const heroContent = document.getElementById("hero-content");
        if (heroContent) {
            gsap.set(heroContent, { opacity: 1, y: 0 }); 

            tl.fromTo("#hero-content > span", 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 
                "-=0.2"
            )
            .fromTo("#hero-content h1", 
                { opacity: 0, y: 30, scale: 0.95, filter: "blur(12px)" }, 
                { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }, 
                "-=0.6"
            )
            .fromTo("#hero-content p", 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 
                "-=0.8"
            )
            .fromTo("#hero-content button", 
                { opacity: 0, y: 15 }, 
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, 
                "-=0.8"
            );
        }

        // --- C. Navbar Dropdown Logic ---
        const navbar = document.getElementById("navbar");
        if (navbar) {
            tl.to(navbar, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.6");
        }

        // --- D. Services Bento Cards (Scroll Trigger) ---
        const servicesSection = document.getElementById("services-section");
        if (servicesSection) {
            gsap.from(".bento-card", {
                scrollTrigger: {
                    trigger: servicesSection,
                    start: "top 75%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 30,
                stagger: 0.15, 
                duration: 0.8,
                ease: "power2.out"
            });
        }
    }

    // =======================================================================
    // 3. THREE.JS ENGINE SETUP (Cyber Blue Theme)
    // =======================================================================
    const stage = document.getElementById('canvas-3d-stage');
    
    // ONLY initialize WebGL if the canvas stage actually exists on this page
    if (stage && typeof THREE !== 'undefined') {
        const CONFIG = {
            colorMain: 0x0ea5e9,   // Deep Blue
            colorSub: 0x38bdf8,    // Light Cyan
            colorAccent: 0xffffff, // White
            spinSpeed: 0.05,       
            glowIntensity: 1.5,    
            ambientLight: 0.5      
        };

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x070708);
        scene.fog = new THREE.FogExp2(0x070708, 0.015); 
        
        const camera = new THREE.PerspectiveCamera(50, stage.clientWidth / stage.clientHeight, 0.1, 200);
        camera.position.set(0, 22, 45); 
        camera.lookAt(0, 0, 0); 

        const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.setSize(stage.clientWidth, stage.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        stage.appendChild(renderer.domElement);

        const renderScene = new THREE.RenderPass(scene, camera);
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(stage.clientWidth, stage.clientHeight),
            CONFIG.glowIntensity, 
            0.5,                  
            0.2                   
        );
        const composer = new THREE.EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);

        const gridHelper = new THREE.GridHelper(100, 100, 0x222222, 0x111111);
        gridHelper.position.y = -4.0;
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.650;
        scene.add(gridHelper);

        const orbitalSystem = new THREE.Group();
        orbitalSystem.rotation.x = -0.15;
        scene.add(orbitalSystem);

        function buildGlowingRing(radius, colorHex, opacity, isDashed = false) {
            const points = [];
            for (let i = 0; i <= 96; i++) {
                const theta = (i / 96) * Math.PI * 2;
                points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            let mat = isDashed 
                ? new THREE.LineDashedMaterial({ color: colorHex, dashSize: 0.6, gapSize: 0.4, transparent: true, opacity: opacity })
                : new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: opacity });
            const line = new THREE.Line(geometry, mat);
            if (isDashed) line.computeLineDistances();
            return line;
        }

        const ringRadii = [8, 12, 18, 26]; 
        orbitalSystem.add(buildGlowingRing(8, CONFIG.colorMain, 0.8, false));
        orbitalSystem.add(buildGlowingRing(12, CONFIG.colorMain, 0.4, true));
        orbitalSystem.add(buildGlowingRing(18, CONFIG.colorAccent, 0.4, true));
        orbitalSystem.add(buildGlowingRing(26, CONFIG.colorMain, 0.8, false));

        const nodePositions = [];
        const nodeMeshes = [];
        const nodeCount = 55; 

        for (let i = 0; i < nodeCount; i++) {
            const radius = ringRadii[Math.floor(Math.random() * ringRadii.length)];
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const pos = new THREE.Vector3(x, 0, z);
            nodePositions.push(pos);

            const isHighlighted = Math.random() > 0.85;
            const size = isHighlighted ? 0.35 : 0.15;
            const color = isHighlighted ? CONFIG.colorSub : CONFIG.colorAccent;

            const mesh = new THREE.Mesh(
                new THREE.SphereGeometry(size, 16, 16),
                new THREE.MeshBasicMaterial({ color: color })
            );
            mesh.position.copy(pos);
            mesh.userData = { timeOffset: Math.random() * 100 };
            orbitalSystem.add(mesh);
            nodeMeshes.push(mesh);
        }

        const lineMat = new THREE.LineBasicMaterial({ color: CONFIG.colorAccent, transparent: true, opacity: 0.15 });
        for (let i = 0; i < nodePositions.length; i++) {
            for (let j = i + 1; j < nodePositions.length; j++) {
                if (nodePositions[i].distanceTo(nodePositions[j]) < 8.5) {
                    const geo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
                    const line = new THREE.Line(geo, lineMat);
                    orbitalSystem.add(line);
                }
            }
        }

        let clock = new THREE.Clock();
        function renderFramePhysics() {
            requestAnimationFrame(renderFramePhysics);
            const time = clock.getElapsedTime();
            orbitalSystem.rotation.y = time * CONFIG.spinSpeed;
            nodeMeshes.forEach((mesh) => {
                mesh.position.y = Math.sin(time * 1.5 + mesh.userData.timeOffset) * 0.4;
            });
            composer.render();
        }
        renderFramePhysics();

        window.addEventListener('resize', () => {
            camera.aspect = stage.clientWidth / stage.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(stage.clientWidth, stage.clientHeight);
            composer.setSize(stage.clientWidth, stage.clientHeight);
        });
    }
});