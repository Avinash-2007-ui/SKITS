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
    // 1. GSAP ENTRANCE ANIMATIONS
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

    // 2. UPGRADED THREE.JS ENGINE
    const stage = document.getElementById('canvas-3d-stage');
    if (!stage) return;

    const scene = new THREE.Scene();
    // Adding a subtle fog to fade the grid out in the distance (Matches the video depth)
    scene.fog = new THREE.FogExp2(0x070708, 0.08);
    
    // Adjusted camera to match the exact tilt in your screenshot
    const camera = new THREE.PerspectiveCamera(55, stage.clientWidth / stage.clientHeight, 0.1, 100);
    camera.position.set(0, 4.5, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    stage.appendChild(renderer.domElement);

    const orbitalGroup = new THREE.Group();
    orbitalGroup.rotation.x = -0.15; 
    scene.add(orbitalGroup);

    // --- NEW: THE BACKGROUND GRID FLOOR ---
    // This creates the faint square graphing lines seen in the video
    const gridHelper = new THREE.GridHelper(30, 40, 0x333333, 0x1a1a1a);
    gridHelper.position.y = -0.2;
    // Fades the edges of the grid so it doesn't look like a harsh box
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    orbitalGroup.add(gridHelper);

    // HELPER: Generate circles with optional "Fake Glow" layering
    function buildGlowingRing(radius, colorHex, isDashed = false) {
        const group = new THREE.Group();
        const points = [];
        for (let i = 0; i <= 64; i++) {
            const theta = (i / 64) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Base solid line
        let mat = isDashed 
            ? new THREE.LineDashedMaterial({ color: colorHex, dashSize: 0.1, gapSize: 0.1, transparent: true, opacity: 0.6 })
            : new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.8 });
        
        const line = new THREE.Line(geometry, mat);
        if (isDashed) line.computeLineDistances();
        group.add(line);

        // Glow line (thicker, highly transparent)
        if (!isDashed) {
            const glowMat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.15, linewidth: 3 });
            const glowLine = new THREE.Line(geometry, glowMat);
            group.add(glowLine);
        }
        return group;
    }

    // LAYER A: Inner Target Ring
    const innerRingTrack = buildGlowingRing(1.5, 0x71717a, true);
    orbitalGroup.add(innerRingTrack);

    // LAYER B: Elevated Main Orange Ring (Lifted up on Y axis)
    const elevatedRingTrack = new THREE.Group();
    elevatedRingTrack.position.y = 0.8; 
    orbitalGroup.add(elevatedRingTrack);

    const orangeCircle = buildGlowingRing(3.2, 0xea580c, false);
    elevatedRingTrack.add(orangeCircle);

    // LAYER C: Standing Holographic Glass Panels
    const panelCount = 3;
    const panels = [];
    for (let i = 0; i < panelCount; i++) {
        const panelGeometry = new THREE.PlaneGeometry(1.2, 0.6);
        
        // Upgraded material to look more like actual glass
        const panelMaterial = new THREE.MeshBasicMaterial({
            color: 0xea580c,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.1,
            wireframe: false // Changed from wireframe to solid glass fill
        });
        const mesh = new THREE.Mesh(panelGeometry, panelMaterial);
        
        // Add a bright border to the glass
        const edges = new THREE.EdgesGeometry(panelGeometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xea580c, opacity: 0.5, transparent: true }));
        mesh.add(line);

        const angle = (i / panelCount) * Math.PI * 0.5 - 0.4; 
        mesh.position.set(Math.cos(angle) * 3.2, 0.3, Math.sin(angle) * 3.2);
        mesh.rotation.y = -angle + Math.PI / 2; 
        elevatedRingTrack.add(mesh);
        panels.push(mesh);
    }

    // LAYER D: Orbiting Particles (The yellow dots)
    const particleGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const movingNode = new THREE.Mesh(particleGeo, particleMat);
    elevatedRingTrack.add(movingNode);

    // 3. RENDER LOOP
    let clock = new THREE.Clock();

    function renderFramePhysics() {
        requestAnimationFrame(renderFramePhysics);
        const elapsedTime = clock.getElapsedTime();

        elevatedRingTrack.rotation.y = elapsedTime * 0.1;
        innerRingTrack.rotation.y = -elapsedTime * 0.15;
        
        const particleAngle = elapsedTime * 0.5;
        movingNode.position.set(Math.cos(particleAngle) * 3.2, 0, Math.sin(particleAngle) * 3.2);

        renderer.render(scene, camera);
    }
    renderFramePhysics();

    window.addEventListener('resize', () => {
        camera.aspect = stage.clientWidth / stage.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(stage.clientWidth, stage.clientHeight);
    });
});