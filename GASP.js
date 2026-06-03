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
    scene.fog = new THREE.FogExp2(0x070708, 0.018); 
    
    // Positioned camera to see the floor gears and the floating rings above
    const camera = new THREE.PerspectiveCamera(50, stage.clientWidth / stage.clientHeight, 0.1, 200);
    camera.position.set(0, 10, 30); 
    camera.lookAt(0, 2, 0); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    stage.appendChild(renderer.domElement);

    // --- LIGHTING RIG ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(15, 30, 15);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xea580c, 4.0); // Orange backlight
    rimLight.position.set(-20, 5, -20);
    scene.add(rimLight);

    // --- POST-PROCESSING (Balanced for Metal + Neon) ---
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(stage.clientWidth, stage.clientHeight),
        0.8,  // Strength of glow
        0.5,  // Spread
        0.65  // Threshold: Metal stays mostly solid, pure white/orange lines glow bright
    );
    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // =======================================================================
    // LAYER 1: THE INDUSTRIAL GRID FLOOR
    // =======================================================================
    const floorGroup = new THREE.Group();
    floorGroup.position.y = -5.0; 
    scene.add(floorGroup);

    const gridHelper = new THREE.GridHelper(150, 150, 0x333333, 0x111111);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.5;
    floorGroup.add(gridHelper);

    // =======================================================================
    // LAYER 2: THE HORIZONTAL GEAR MATRIX (Hardware)
    // =======================================================================
    const gearSystem = new THREE.Group();
    gearSystem.position.set(0, -2, -3);
    scene.add(gearSystem);

    function buildDetailedGear(radius, teethCount, extrusionDepth, colorHex, hasSpokes) {
        const gearAssembly = new THREE.Group();
        const metalMaterial = new THREE.MeshStandardMaterial({ 
            color: colorHex, metalness: 0.85, roughness: 0.3 
        });

        const shape = new THREE.Shape();
        const innerRadius = radius * 0.85; 
        const step = (Math.PI * 2) / teethCount;

        for (let i = 0; i < teethCount; i++) {
            const angle = i * step;
            shape.lineTo(Math.cos(angle - step/4) * innerRadius, Math.sin(angle - step/4) * innerRadius);
            shape.lineTo(Math.cos(angle - step/6) * radius, Math.sin(angle - step/6) * radius);
            shape.lineTo(Math.cos(angle + step/6) * radius, Math.sin(angle + step/6) * radius);
            shape.lineTo(Math.cos(angle + step/4) * innerRadius, Math.sin(angle + step/4) * innerRadius);
        }
        shape.closePath();

        if (hasSpokes) {
            for (let j = 0; j < 5; j++) {
                const spokeAngle = (Math.PI * 2) / 5;
                const holePath = new THREE.Path();
                holePath.absarc(0, 0, radius * 0.70, j * spokeAngle + 0.15, (j+1) * spokeAngle - 0.15, false);
                holePath.absarc(0, 0, radius * 0.35, (j+1) * spokeAngle - 0.15, j * spokeAngle + 0.15, true);
                shape.holes.push(holePath);
            }
        }
        const centerHole = new THREE.Path();
        centerHole.absarc(0, 0, radius * 0.15, 0, Math.PI * 2, false);
        shape.holes.push(centerHole);

        const extrudeSettings = { depth: extrusionDepth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
        const bodyMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, extrudeSettings), metalMaterial);
        bodyMesh.center();
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        gearAssembly.add(bodyMesh);

        // Axle Hub
        const hubMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.25, radius * 0.25, extrusionDepth + 0.2, 32), metalMaterial);
        hubMesh.rotation.x = Math.PI / 2;
        gearAssembly.add(hubMesh);

        gearAssembly.rotation.x = -Math.PI / 2;
        return gearAssembly;
    }

    const gears = [];
    const SILVER = 0xcccccc;
    const COPPER = 0xc06020; 
    const DARK_STEEL = 0x333333;

    function addMeshedGear(parentGear, radius, teeth, color, hasSpokes, angleFromParent, yOffset) {
        const dist = parentGear.userData.radius + radius - 0.15; 
        const x = parentGear.position.x + Math.cos(angleFromParent) * dist;
        const z = parentGear.position.z + Math.sin(angleFromParent) * dist;
        const gear = buildDetailedGear(radius, teeth, 0.8, color, hasSpokes);
        gear.position.set(x, parentGear.position.y + yOffset, z);
        gear.userData = { radius: radius, teeth: teeth, parent: parentGear, ratio: parentGear.userData.teeth / teeth };
        gearSystem.add(gear);
        gears.push(gear);
        return gear;
    }

    const g1 = buildDetailedGear(4.0, 24, 1.0, SILVER, true);
    g1.position.set(0, 0, 0);
    g1.userData = { radius: 4.0, teeth: 24, isDriver: true };
    gearSystem.add(g1);
    gears.push(g1);

    const g2 = addMeshedGear(g1, 2.5, 15, COPPER, true, 0.2, 0);
    const g3 = addMeshedGear(g2, 3.5, 21, DARK_STEEL, true, -0.2, 0); 
    const g4 = addMeshedGear(g1, 3.0, 18, DARK_STEEL, true, Math.PI - 0.3, 0); 
    const g5 = addMeshedGear(g4, 2.0, 12, COPPER, false, Math.PI + 0.2, 0);

    // =======================================================================
    // LAYER 3: THE FLOATING ORBITAL HUD (Software)
    // =======================================================================
    const orbitalSystem = new THREE.Group();
    // Floating high above the gears, tilted slightly toward the camera
    orbitalSystem.position.set(0, 7.5, -2);
    orbitalSystem.rotation.x = -0.15;
    scene.add(orbitalSystem);

    function buildGlowingRing(radius, colorHex, isDashed = false) {
        const points = [];
        for (let i = 0; i <= 64; i++) {
            const theta = (i / 64) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        let mat = isDashed 
            ? new THREE.LineDashedMaterial({ color: colorHex, dashSize: 0.3, gapSize: 0.2, transparent: true, opacity: 0.9 })
            : new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.6 });
        const line = new THREE.Line(geometry, mat);
        if (isDashed) line.computeLineDistances();
        return line;
    }

    const ring1 = buildGlowingRing(6.0, 0xea580c, false); // Outer Orange
    const ring2 = buildGlowingRing(5.5, 0xea580c, true);  // Inner Dashed Orange
    const ring3 = buildGlowingRing(3.5, 0xffffff, true);  // Core White
    
    orbitalSystem.add(ring1);
    orbitalSystem.add(ring2);
    orbitalSystem.add(ring3);

    // Orbiting Data Nodes
    const nodeGroup = new THREE.Group();
    orbitalSystem.add(nodeGroup);
    
    function createDataNode(color, size, x) {
        // Using MeshBasicMaterial so it ignores lighting and glows purely
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide }));
        mesh.rotation.x = Math.PI / 2;
        mesh.position.set(x, 0, 0);
        nodeGroup.add(mesh);
        return mesh;
    }
    
    createDataNode(0xffffff, 0.2, 6.0);
    createDataNode(0xea580c, 0.15, 6.0, 0.5); // Trailing
    createDataNode(0xffffff, 0.1, 3.5); // Inner track

    // =======================================================================
    // 4. ANIMATION & RENDER LOOP
    // =======================================================================
    let clock = new THREE.Clock();

    function renderFramePhysics() {
        requestAnimationFrame(renderFramePhysics);
        const time = clock.getElapsedTime();

        // 1. Hardware Animation (Gears)
        const gearSpeed = 0.4;
        g1.rotation.y = time * gearSpeed; 
        
        gears.forEach((gear, index) => {
            if (!gear.userData.isDriver && gear.userData.parent) {
                const parentRot = gear.userData.parent.rotation.y;
                gear.rotation.y = -(parentRot * gear.userData.ratio) + (index * 0.12);
            }
        });

        // 2. Software Animation (Holograms spinning independently)
        ring1.rotation.y = time * 0.1;
        ring2.rotation.y = -time * 0.15;
        ring3.rotation.y = time * 0.2;
        nodeGroup.rotation.y = time * 0.4; // Nodes fly around the track

        // Slow cinematic pan of the entire scene
        gearSystem.rotation.y = Math.sin(time * 0.1) * 0.1;
        orbitalSystem.rotation.y = Math.sin(time * 0.1) * 0.1;

        composer.render();
    }
    renderFramePhysics();

    window.addEventListener('resize', () => {
        camera.aspect = stage.clientWidth / stage.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(stage.clientWidth, stage.clientHeight);
        composer.setSize(stage.clientWidth, stage.clientHeight);
    });
});