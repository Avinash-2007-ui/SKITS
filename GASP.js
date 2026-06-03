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
    scene.fog = new THREE.FogExp2(0x070708, 0.035); 
    
    // Camera positioned for massive scale
    const camera = new THREE.PerspectiveCamera(60, stage.clientWidth / stage.clientHeight, 0.1, 100);
    camera.position.set(0, 1.8, 9.5); 
    camera.lookAt(0, -0.5, 0); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    stage.appendChild(renderer.domElement);

    // --- POST-PROCESSING: THE BLOOM (GLOW) ---
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(stage.clientWidth, stage.clientHeight),
        1.5,  // Intensity
        0.5,  // Spread
        0.25  // Threshold
    );

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const orbitalGroup = new THREE.Group();
    orbitalGroup.rotation.x = -0.05; 
    scene.add(orbitalGroup);

    // --- MECHANICAL HELPER FUNCTIONS ---

    // 1. Builds segmented mechanical arcs instead of full circles
    function buildArc(radius, startAngle, endAngle, colorHex, opacity) {
        const points = [];
        const segments = 64; 
        for (let i = 0; i <= segments; i++) {
            const theta = startAngle + (i / segments) * (endAngle - startAngle);
            points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: opacity });
        return new THREE.Line(geometry, mat);
    }

    // 2. Builds mechanical gear teeth / compass ticks
    function buildTicks(radius, tickLength, numTicks, colorHex, opacity) {
        const points = [];
        for (let i = 0; i < numTicks; i++) {
            const theta = (i / numTicks) * Math.PI * 2;
            // Inner point
            points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
            // Outer point
            points.push(new THREE.Vector3(Math.cos(theta) * (radius + tickLength), 0, Math.sin(theta) * (radius + tickLength)));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: opacity });
        return new THREE.LineSegments(geometry, mat); // LineSegments connects pairs of points
    }

    // 3. Builds radar crosshairs
    function buildCrosshairs(radius, colorHex, opacity) {
        const points = [
            new THREE.Vector3(-radius, 0, 0), new THREE.Vector3(radius, 0, 0),
            new THREE.Vector3(0, 0, -radius), new THREE.Vector3(0, 0, radius)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: opacity });
        return new THREE.LineSegments(geometry, mat);
    }

    // --- LAYER 1: INDUSTRIAL RADAR FLOOR ---
    const floorGroup = new THREE.Group();
    floorGroup.position.y = -0.5;
    orbitalGroup.add(floorGroup);

    // Base Grid
    const gridHelper = new THREE.GridHelper(80, 80, 0x1a1a1a, 0x0a0a0a);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.5;
    floorGroup.add(gridHelper);

    // Mechanical Floor Elements
    floorGroup.add(buildCrosshairs(15, 0x555555, 0.2));
    floorGroup.add(buildTicks(4.0, 0.2, 120, 0x444444, 0.3)); // Fine inner gear
    floorGroup.add(buildArc(6.0, 0, Math.PI * 2, 0x333333, 0.2)); // Faint full ring
    floorGroup.add(buildArc(9.0, 0, Math.PI * 2, 0x222222, 0.2)); 

    // --- LAYER 2: ELEVATED MECHANICAL UI RING ---
    const elevatedRingTrack = new THREE.Group();
    elevatedRingTrack.position.y = 0.6; 
    orbitalGroup.add(elevatedRingTrack);

    // Main Orange Mechanical Arcs (Broken circle effect)
    elevatedRingTrack.add(buildArc(7.0, 0, Math.PI * 0.8, 0xea580c, 0.9));
    elevatedRingTrack.add(buildArc(7.0, Math.PI * 0.9, Math.PI * 1.6, 0xea580c, 0.9));
    elevatedRingTrack.add(buildArc(7.0, Math.PI * 1.7, Math.PI * 1.9, 0xea580c, 0.9));

    // Outer gear ticks attached to the orange ring
    elevatedRingTrack.add(buildTicks(7.1, 0.15, 72, 0xea580c, 0.5));

    // Inner dashed technical ring
    const innerTechGroup = new THREE.Group();
    elevatedRingTrack.add(innerTechGroup);
    innerTechGroup.add(buildArc(6.5, 0, Math.PI * 0.4, 0xffffff, 0.3));
    innerTechGroup.add(buildArc(6.5, Math.PI * 1.0, Math.PI * 1.4, 0xffffff, 0.3));
    innerTechGroup.add(buildTicks(6.5, 0.1, 36, 0xffffff, 0.4));


    // --- LAYER 3: VERTICAL DATA PANELS ---
    const panelCount = 3;
    for (let i = 0; i < panelCount; i++) {
        const panelGeometry = new THREE.PlaneGeometry(1.8, 1.0); 
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

        const angle = (i / panelCount) * Math.PI * 0.4 + (Math.PI * 0.3); 
        mesh.position.set(Math.cos(angle) * 7.0, 0.5, Math.sin(angle) * 7.0);
        mesh.rotation.y = -angle + Math.PI / 2; 
        elevatedRingTrack.add(mesh);
    }

    // --- LAYER 4: GEOMETRIC DATA NODES (No more planets) ---
    const nodeGroup = new THREE.Group();
    elevatedRingTrack.add(nodeGroup);

    // Using PlaneGeometry rotated flat to look like digital UI markers instead of spheres
    const createDataMarker = (color, size, x, z) => {
        const geo = new THREE.PlaneGeometry(size, size);
        const mat = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = Math.PI / 2; // Lay it flat on the ring
        mesh.position.set(x, 0, z);
        nodeGroup.add(mesh);
        return mesh;
    };
    
    createDataMarker(0xffffff, 0.15, 7.0, 0); // Primary white tracker square
    createDataMarker(0xea580c, 0.1, 7.0, 0.4); // Orange trailing marker
    createDataMarker(0xea580c, 0.08, 7.0, 0.7); // Orange trailing marker

    // --- 3. HARDWARE ACCELERATED RENDER LOOP ---
    let clock = new THREE.Clock();

    function renderFramePhysics() {
        requestAnimationFrame(renderFramePhysics);
        const elapsedTime = clock.getElapsedTime();

        // Complex mechanical counter-rotations
        elevatedRingTrack.rotation.y = elapsedTime * 0.04;
        innerTechGroup.rotation.y = -elapsedTime * 0.08; // Inner UI spins backward
        floorGroup.rotation.y = -elapsedTime * 0.015; 
        
        // Data markers sliding along the track
        nodeGroup.rotation.y = elapsedTime * 0.15;

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