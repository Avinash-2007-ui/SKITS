/* ==========================================================================
   SKITS CINEMATIC ANIMATION ENGINE (GSAP & SCROLLTRIGGER)
   ========================================================================== */

window.addEventListener('DOMContentLoaded', () => {
    // Register the scroll plugin so GSAP knows how to track scroll events
    gsap.registerPlugin(ScrollTrigger);
    
    const tl = gsap.timeline();
    
    // 1. FADE OUT PRELOADER FIRST
    tl.to("#preloader", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
            // Completely clear the preloader barrier from the DOM
            document.getElementById("preloader").style.display = "none"; 
        }
    })
    // 2. THEN BRING IN HERO CONTENT SMOOTHLY
    .to("#hero-content", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.2") 
    // 3. DROP DOWN THE GLASS NAVBAR
    .to("#navbar", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.6"); 

    // 4. SCROLL TRIGGERS FOR BENTO CARDS
    // Fires sequentially when the services section comes into view
    gsap.from(".bento-card", {
        scrollTrigger: {
            trigger: "#services-section",
            start: "top 75%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 30,
        stagger: 0.15, 
        duration: 0.8,
        ease: "power2.out"
    });
});
// MOBILE INTERACTIVE NAVIGATION SCRIPT HOOK
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const menuPanel = document.getElementById('mobile-menu-panel');

    if (toggleBtn && menuPanel) {
        toggleBtn.addEventListener('click', () => {
            menuPanel.classList.toggle('hidden');
            
            // Optional: Changes hamburger icon to an 'X' close graphic when opened
            const isHidden = menuPanel.classList.contains('hidden');
            toggleBtn.innerHTML = isHidden 
                ? `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>`
                : `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;
        });

        // Close menu panel when any link inside it is tapped
        menuPanel.querySelectorAll('a, button').forEach(link => {
            link.addEventListener('click', () => {
                menuPanel.classList.add('hidden');
                toggleBtn.innerHTML = `<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>`;
            });
        });
    }
});

/* ==========================================================================
   GSAP MATCH SEQUENCE FOR SKITS_FIRST_STYLE_3 VIDEO MATCH
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================================
    // ⚙️ THE SAFE CONFIGURATION ZONE ⚙️
    // =======================================================================
    const CONFIG = {
        // 🔸 CURRENT: ORIGINAL VIDEO THEME (ORANGE/GOLD)
        colorMain: 0xea580c,   // Deep Orange
        colorSub: 0xfacc15,    // Gold
        colorAccent: 0xffffff, // White
        
        /* // 🔹 WANT THE BLUISH THEME? Delete the 3 colors above and use these instead:
        colorMain: 0x0284c7,   // Deep Cyber Blue
        colorSub: 0x38bdf8,    // Light Neon Blue
        colorAccent: 0xffffff, // White
        */
        
        spinSpeed: 0.15,       // Overall rotation speed
        glowIntensity: 1.2,    // How bright the neon lines glow
        fogDensity: 0.015      // Fades the far edges into the darkness
    };
    // =======================================================================

    // 1. GSAP ENTRANCE TIMELINE
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();
    
    tl.to("#preloader", {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => { document.getElementById("preloader").style.display = "none"; }
    })
    .to("#hero-content", {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power3.out"
    }, "-=0.2");

    // 2. THREE.JS ENGINE SETUP
    const stage = document.getElementById('canvas-3d-stage');
    if (!stage) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070708);
    scene.fog = new THREE.FogExp2(0x070708, CONFIG.fogDensity); 
    
    // Positioned to look down across the vast radar field
    const camera = new THREE.PerspectiveCamera(50, stage.clientWidth / stage.clientHeight, 0.1, 200);
    camera.position.set(0, 15, 30); 
    camera.lookAt(0, -2, 0); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    stage.appendChild(renderer.domElement);

    // --- POST-PROCESSING (THE NEON GLOW) ---
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(stage.clientWidth, stage.clientHeight),
        CONFIG.glowIntensity, // Strength
        0.5,                  // Spread
        0.1                   // Threshold (Low means all lines will glow)
    );
    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // =======================================================================
    // LAYER 1: THE RADAR UNIVERSE
    // =======================================================================
    const orbitalSystem = new THREE.Group();
    // Tilted flat and pushed down to sit perfectly beneath the text
    orbitalSystem.position.set(0, -5, -5); 
    orbitalSystem.rotation.x = -1.2; // Steep tilt like the video
    scene.add(orbitalSystem);

    // Faint tracking grid on the floor
    const gridHelper = new THREE.GridHelper(150, 60, 0x1a1a1a, 0x111111);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.5;
    gridHelper.rotation.x = Math.PI / 2; // Align grid with the tilted orbital system
    orbitalSystem.add(gridHelper);

    // --- HELPER TO DRAW GLOWING RINGS ---
    function buildGlowingRing(radius, colorHex, opacity, isDashed = false) {
        const points = [];
        for (let i = 0; i <= 128; i++) {
            const theta = (i / 128) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0)); 
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        let mat = isDashed 
            ? new THREE.LineDashedMaterial({ color: colorHex, dashSize: 0.6, gapSize: 0.4, transparent: true, opacity: opacity })
            : new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: opacity });
        const line = new THREE.Line(geometry, mat);
        if (isDashed) line.computeLineDistances();
        return line;
    }

    // --- MASSIVE CONCENTRIC RINGS ---
    // The larger the radius, the further out it sweeps
    const rings = new THREE.Group();
    orbitalSystem.add(rings);

    // Core targeting rings
    rings.add(buildGlowingRing(4.0, CONFIG.colorSub, 0.4, true));
    rings.add(buildGlowingRing(6.0, CONFIG.colorAccent, 0.2, false));
    
    // Main UI Data Rings
    rings.add(buildGlowingRing(10.0, CONFIG.colorMain, 0.8, false));
    rings.add(buildGlowingRing(10.5, CONFIG.colorMain, 0.3, true));
    
    // Outer expanse rings
    rings.add(buildGlowingRing(16.0, CONFIG.colorSub, 0.5, true));
    rings.add(buildGlowingRing(22.0, CONFIG.colorMain, 0.2, false));

    // --- ORBITING DATA NODES ---
    // Tiny glowing squares representing data packets traveling along the rings
    const nodeGroup = new THREE.Group();
    orbitalSystem.add(nodeGroup);
    
    function createDataNode(color, size, radius, angleOffset) {
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(size, size), 
            new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide })
        );
        // Position on the ring using trigonometry
        mesh.position.set(Math.cos(angleOffset) * radius, Math.sin(angleOffset) * radius, 0);
        nodeGroup.add(mesh);
        return mesh;
    }
    
    // Track 10.0 nodes
    createDataNode(CONFIG.colorAccent, 0.3, 10.0, 0);
    createDataNode(CONFIG.colorMain, 0.2, 10.0, 0.2); 
    
    // Track 16.0 nodes
    createDataNode(CONFIG.colorSub, 0.4, 16.0, Math.PI);
    createDataNode(CONFIG.colorAccent, 0.2, 16.0, Math.PI + 0.15);

    // --- 3. RENDER LOOP ---
    let clock = new THREE.Clock();

    function renderFramePhysics() {
        requestAnimationFrame(renderFramePhysics);
        const time = clock.getElapsedTime();

        // Spin the rings in opposite directions for complex parallax
        rings.children[0].rotation.z = time * CONFIG.spinSpeed;
        rings.children[1].rotation.z = -time * (CONFIG.spinSpeed * 0.5);
        rings.children[2].rotation.z = time * (CONFIG.spinSpeed * 0.8);
        rings.children[3].rotation.z = -time * CONFIG.spinSpeed;
        rings.children[4].rotation.z = time * (CONFIG.spinSpeed * 1.2);
        
        // Data nodes fly rapidly around the tracks
        nodeGroup.rotation.z = time * (CONFIG.spinSpeed * 2.5);

        // Slow cinematic camera float
        camera.position.x = Math.sin(time * 0.1) * 2;
        camera.lookAt(0, -2, 0);

        composer.render();
    }
    renderFramePhysics();

    // Responsive Canvas
    window.addEventListener('resize', () => {
        camera.aspect = stage.clientWidth / stage.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(stage.clientWidth, stage.clientHeight);
        composer.setSize(stage.clientWidth, stage.clientHeight);
    });
});