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
    // 1. GSAP TIMELINE SETUP
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
    // Set a pure dark background so the glow calculations work perfectly
    scene.background = new THREE.Color(0x070708);
    scene.fog = new THREE.FogExp2(0x070708, 0.06); // Adds depth-of-field fading
    
    // Camera angle tilted to match the reference UI
    const camera = new THREE.PerspectiveCamera(55, stage.clientWidth / stage.clientHeight, 0.1, 100);
    camera.position.set(0, 3.8, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    stage.appendChild(renderer.domElement);

    // --- POST-PROCESSING: THE BLOOM PIPELINE ---
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(stage.clientWidth, stage.clientHeight),
        1.8,  // Strength of the glow (Intensity)
        0.5,  // Radius of the glow (Spread)
        0.25  // Threshold (Lower means more things will glow)
    );

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Group for global perspective tilt
    const orbitalGroup = new THREE.Group();
    orbitalGroup.rotation.x = -0.15; 
    scene.add(orbitalGroup);

    // --- HELPER FUNCTIONS ---
    function buildWireframeCircle(radius, colorHex, opacity, isDashed = false) {
        const points = [];
        for (let i = 0; i <= 64; i++) {
            const theta = (i / 64) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        let mat = isDashed 
            ? new THREE.LineDashedMaterial({ color: colorHex, dashSize: 0.15, gapSize: 0.15, transparent: true, opacity: opacity })
            : new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: opacity });
        
        const line = new THREE.Line(geometry, mat);
        if (isDashed) line.computeLineDistances();
        return line;
    }

    // --- LAYER 1: PROCEDURAL TOPOGRAPHIC RADAR FLOOR ---
    const floorGroup = new THREE.Group();
    floorGroup.position.y = -0.2;
    orbitalGroup.add(floorGroup);

    // Faint grid lattice
    const gridHelper = new THREE.GridHelper(40, 60, 0x333333, 0x1a1a1a);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    floorGroup.add(gridHelper);

    // Concentric mapping rings
    floorGroup.add(buildWireframeCircle(2.0, 0x555555, 0.2, true));
    floorGroup.add(buildWireframeCircle(4.0, 0x555555, 0.15, false));
    floorGroup.add(buildWireframeCircle(6.0, 0x555555, 0.1, true));

    // --- LAYER 2: ELEVATED GLOWING ORANGE RING ---
    const elevatedRingTrack = new THREE.Group();
    elevatedRingTrack.position.y = 0.7; // Lifted exactly like the screenshot
    orbitalGroup.add(elevatedRingTrack);

    // Main neon ring
    const orangeCircle = buildWireframeCircle(3.2, 0xea580c, 1.0, false);
    elevatedRingTrack.add(orangeCircle);

    // --- LAYER 3: VERTICAL STANDING DATA PANELS ---
    const panelCount = 3;
    for (let i = 0; i < panelCount; i++) {
        const panelGeometry = new THREE.PlaneGeometry(1.2, 0.7);
        const panelMaterial = new THREE.MeshBasicMaterial({
            color: 0xea580c,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.08, // Faint glass fill
            depthWrite: false
        });
        const mesh = new THREE.Mesh(panelGeometry, panelMaterial);
        
        // Bright glowing border for the panels
        const edges = new THREE.EdgesGeometry(panelGeometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xea580c, opacity: 0.8, transparent: true }));
        mesh.add(line);

        // Position them upright on the ring
        const angle = (i / panelCount) * Math.PI * 0.5 - 0.5; 
        mesh.position.set(Math.cos(angle) * 3.2, 0.35, Math.sin(angle) * 3.2);
        mesh.rotation.y = -angle + Math.PI / 2; // Face outward
        elevatedRingTrack.add(mesh);
    }

    // --- LAYER 4: ORBITING DATA NODES (YELLOW/WHITE) ---
    const nodeGroup = new THREE.Group();
    elevatedRingTrack.add(nodeGroup);

    const createNode = (color, size, x, z) => {
        const geo = new THREE.SphereGeometry(size, 16, 16);
        const mat = new THREE.MeshBasicMaterial({ color: color });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0, z);
        nodeGroup.add(mesh);
        return mesh;
    };
    
    // Main bright tracker
    const primaryNode = createNode(0xffffff, 0.05, 3.2, 0);
    // Smaller trailing particles
    createNode(0xfacc15, 0.03, 3.2, 0.3);
    createNode(0xfacc15, 0.02, 3.2, 0.5);

    // --- INNER CORE RING ---
    const innerRingTrack = new THREE.Group();
    innerRingTrack.position.y = 0.3; // Floating midway between floor and main ring
    orbitalGroup.add(innerRingTrack);
    innerRingTrack.add(buildWireframeCircle(1.4, 0xea580c, 0.4, true));

    // 3. HARDWARE ACCELERATED RENDER LOOP
    let clock = new THREE.Clock();

    function renderFramePhysics() {
        requestAnimationFrame(renderFramePhysics);
        const elapsedTime = clock.getElapsedTime();

        // Counter-rotating the layers for complex machine-like movement
        elevatedRingTrack.rotation.y = elapsedTime * 0.1;
        innerRingTrack.rotation.y = -elapsedTime * 0.2;
        floorGroup.rotation.y = elapsedTime * 0.02; // Very slow radar sweep
        
        // Pulse/Orbit the data node cluster
        const particleAngle = elapsedTime * 0.4;
        nodeGroup.rotation.y = particleAngle;

        // CRITICAL: Render using the Composer (Glow), NOT the standard renderer
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