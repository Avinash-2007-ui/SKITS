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

window.addEventListener('DOMContentLoaded', () => {
    // 1. CHOREOGRAPH INITIAL ENTRANCE ANCHORS VIA GSAP
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

    // 2. INITIALIZE INTUITIVE THREE.JS ENGINE SCENERY
    const stage = document.getElementById('canvas-3d-stage');
    if (!stage) return;

    const scene = new THREE.Scene();
    
    // Set up camera positioning matching the video perspective plane
    const camera = new THREE.PerspectiveCamera(60, stage.clientWidth / stage.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    stage.appendChild(renderer.domElement);

    // Group elements to animate everything smoothly on entry if needed
    const orbitalGroup = new THREE.Group();
    orbitalGroup.rotation.x = -0.2; // Tilted horizon axis adjustment
    scene.add(orbitalGroup);

    // HELPER: Generate crisp vector tracing outlines
    function buildWireframeCircle(radius, steps, colorHex, dashed = false) {
        const points = [];
        for (let i = 0; i <= steps; i++) {
            const theta = (i / steps) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        let material;
        if (dashed) {
            material = new THREE.LineDashedMaterial({ color: colorHex, dashSize: 0.2, gapSize: 0.1, transparent: true, opacity: 0.3 });
        } else {
            material = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.4 });
        }
        const line = new THREE.Line(geometry, material);
        if (dashed) line.computeLineDistances();
        return line;
    }

    // LAYER A: Flat Ground Radar Reference Map
    const baseFloorGrid = buildWireframeCircle(3.5, 64, 0x3f3f46, false);
    orbitalGroup.add(baseFloorGrid);

    // LAYER B: Main Floating Telemetry Track (Elevated on the local Y-axis)
    const elevatedRingTrack = new THREE.Group();
    elevatedRingTrack.position.y = 0.6; // Lifts this entire ring subsystem into mid-air
    orbitalGroup.add(elevatedRingTrack);

    const orangeCircle = buildWireframeCircle(2.5, 64, 0xea580c, false);
    elevatedRingTrack.add(orangeCircle);

    // LAYER C: Standing Holographic Data Panels (Constructing true perpendicular planes)
    const panelCount = 3;
    const panels = [];
    for (let i = 0; i < panelCount; i++) {
        const panelGeometry = new THREE.PlaneGeometry(0.8, 0.4);
        const panelMaterial = new THREE.MeshBasicMaterial({
            color: 0xea580c,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.15,
            wireframe: true
        });
        const mesh = new THREE.Mesh(panelGeometry, panelMaterial);
        
        // Arrange sequentially along the circumference angle paths
        const angle = (i / panelCount) * Math.PI * 0.5 - 0.4; 
        mesh.position.set(Math.cos(angle) * 2.5, 0.2, Math.sin(angle) * 2.5);
        mesh.rotation.y = -angle + Math.PI / 2; // Direct vector facing
        elevatedRingTrack.add(mesh);
        panels.push(mesh);
    }

    // LAYER D: Orbiting Telemetry Data Marker Nodes
    const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const movingNode = new THREE.Mesh(particleGeo, particleMat);
    elevatedRingTrack.add(movingNode);

    // LAYER E: Core Center Target Grid System
    const innerRingTrack = buildWireframeCircle(1.2, 32, 0x71717a, true);
    innerRingTrack.position.y = 0.2;
    orbitalGroup.add(innerRingTrack);

    // 3. CONTINUOUS RENDERING LOOP & PERSPECTIVE FLUIDITY
    let clock = new THREE.Clock();

    function renderFramePhysics() {
        requestAnimationFrame(renderFramePhysics);
        const elapsedTime = clock.getElapsedTime();

        // Rotate separate track vectors independently at unique, variable rates
        elevatedRingTrack.rotation.y = elapsedTime * 0.15;
        innerRingTrack.rotation.y = -elapsedTime * 0.3;
        
        // Animate the single white pulse tracking around its circular orbit vector path
        const particleAngle = elapsedTime * 0.8;
        movingNode.position.set(Math.cos(particleAngle) * 2.5, 0, Math.sin(particleAngle) * 2.5);

        renderer.render(scene, camera);
    }
    renderFramePhysics();

    // Responsive window resizing listener hook
    window.addEventListener('resize', () => {
        camera.aspect = stage.clientWidth / stage.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(stage.clientWidth, stage.clientHeight);
    });
});