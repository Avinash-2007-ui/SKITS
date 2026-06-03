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
    // Adjusted fog for a massive scale environment
    scene.fog = new THREE.FogExp2(0x070708, 0.035); 
    
    // CAMERA FIX: Dropped much lower to the ground and pulled back
    const camera = new THREE.PerspectiveCamera(60, stage.clientWidth / stage.clientHeight, 0.1, 100);
    camera.position.set(0, 1.8, 9.5); 
    camera.lookAt(0, -0.5, 0); // Looking slightly downward across the vast floor

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    stage.appendChild(renderer.domElement);

    // --- POST-PROCESSING: THE BLOOM PIPELINE ---
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(stage.clientWidth, stage.clientHeight),
        1.5,  // Intensity
        0.6,  // Spread
        0.2   // Threshold
    );

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const orbitalGroup = new THREE.Group();
    // Tilted the entire universe slightly to match the horizon
    orbitalGroup.rotation.x = -0.05; 
    scene.add(orbitalGroup);

    // --- HELPER FUNCTION ---
    function buildWireframeCircle(radius, colorHex, opacity, isDashed = false) {
        const points = [];
        const segments = 128; // Increased resolution for massive circles
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        let mat = isDashed 
            ? new THREE.LineDashedMaterial({ color: colorHex, dashSize: 0.2, gapSize: 0.2, transparent: true, opacity: opacity })
            : new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: opacity });
        
        const line = new THREE.Line(geometry, mat);
        if (isDashed) line.computeLineDistances();
        return line;
    }

    // --- LAYER 1: MASSIVE RADAR FLOOR ---
    const floorGroup = new THREE.Group();
    floorGroup.position.y = -0.5;
    orbitalGroup.add(floorGroup);

    // Huge background grid
    const gridHelper = new THREE.GridHelper(80, 80, 0x222222, 0x111111);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    floorGroup.add(gridHelper);

    // High-density concentric rings to simulate map complexity
    floorGroup.add(buildWireframeCircle(3.0, 0x555555, 0.2, true));
    floorGroup.add(buildWireframeCircle(4.5, 0x555555, 0.1, false));
    floorGroup.add(buildWireframeCircle(6.0, 0x555555, 0.2, true));
    floorGroup.add(buildWireframeCircle(7.5, 0x444444, 0.1, false));
    floorGroup.add(buildWireframeCircle(9.0, 0x333333, 0.15, true));
    floorGroup.add(buildWireframeCircle(12.0, 0x222222, 0.1, false));

    // --- LAYER 2: MASSIVE ELEVATED ORANGE RING ---
    const elevatedRingTrack = new THREE.Group();
    elevatedRingTrack.position.y = 0.6; // Hovering above the floor
    orbitalGroup.add(elevatedRingTrack);

    // Scaled up drastically (Radius 7.0 instead of 3.2)
    const orangeCircle = buildWireframeCircle(7.0, 0xea580c, 0.9, false);
    elevatedRingTrack.add(orangeCircle);

    // Inner glowing orange dashed track
    const orangeInnerDashed = buildWireframeCircle(6.6, 0xea580c, 0.3, true);
    elevatedRingTrack.add(orangeInnerDashed);

    // --- LAYER 3: VERTICAL PANELS (PUSHED TO FOREGROUND) ---
    const panelCount = 3;
    for (let i = 0; i < panelCount; i++) {
        const panelGeometry = new THREE.PlaneGeometry(1.8, 1.0); // Made panels larger
        const panelMaterial = new THREE.MeshBasicMaterial({
            color: 0xea580c,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.05, 
            depthWrite: false
        });
        const mesh = new THREE.Mesh(panelGeometry, panelMaterial);
        
        const edges = new THREE.EdgesGeometry(panelGeometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xea580c, opacity: 0.6, transparent: true }));
        mesh.add(line);

        // Positioned at the very front of the massive 7.0 radius ring
        // Angles calculated to place them directly in front of the camera
        const angle = (i / panelCount) * Math.PI * 0.4 + (Math.PI * 0.3); 
        mesh.position.set(Math.cos(angle) * 7.0, 0.5, Math.sin(angle) * 7.0);
        mesh.rotation.y = -angle + Math.PI / 2; 
        elevatedRingTrack.add(mesh);
    }

    // --- LAYER 4: ORBITING DATA NODES ---
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
    
    createNode(0xffffff, 0.08, 7.0, 0); // Primary white tracker
    createNode(0xfacc15, 0.05, 7.0, 0.4); // Yellow trail
    createNode(0xfacc15, 0.03, 7.0, 0.7); // Yellow trail

    // --- 3. HARDWARE ACCELERATED RENDER LOOP ---
    let clock = new THREE.Clock();

    function renderFramePhysics() {
        requestAnimationFrame(renderFramePhysics);
        const elapsedTime = clock.getElapsedTime();

        // Layer counter-rotations
        elevatedRingTrack.rotation.y = elapsedTime * 0.05;
        floorGroup.rotation.y = -elapsedTime * 0.02; 
        
        // Data nodes spinning faster along the track
        nodeGroup.rotation.y = elapsedTime * 0.2;

        // Render via Post-Processing Bloom Composer
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