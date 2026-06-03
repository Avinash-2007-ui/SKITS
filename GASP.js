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

    // 2. THREE.JS SOLID MECHANICAL ENGINE SETUP
    const stage = document.getElementById('canvas-3d-stage');
    if (!stage) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070708);
    scene.fog = new THREE.FogExp2(0x070708, 0.015); // Lighter fog so we can see the wide expanse
    
    // Pulled camera further back and up to capture the massive horizontal scale
    const camera = new THREE.PerspectiveCamera(45, stage.clientWidth / stage.clientHeight, 0.1, 200);
    camera.position.set(0, 18, 30); 
    camera.lookAt(0, -2, 0); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // High-quality shadows for realistic depth
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Cinematic color grading
    renderer.toneMappingExposure = 1.0;
    stage.appendChild(renderer.domElement);

    // --- BRINGING BACK THE INDUSTRIAL FLOOR GRID ---
    const gridHelper = new THREE.GridHelper(150, 150, 0x333333, 0x111111);
    gridHelper.position.y = -5.0; 
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.4;
    scene.add(gridHelper);

    // --- PHOTOREALISTIC STUDIO LIGHTING RIG ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
    scene.add(ambientLight);

    // Key Light (Main bright white light from top-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(20, 30, 20);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    // Fill Light (Soft cool blue light from bottom-left to fill shadows)
    const fillLight = new THREE.DirectionalLight(0x88bbff, 1.0);
    fillLight.position.set(-20, 10, 20);
    scene.add(fillLight);

    // Rim Light (Sharp SKITS Orange light from the back to highlight edges)
    const rimLight = new THREE.DirectionalLight(0xea580c, 4.0);
    rimLight.position.set(-15, 5, -25);
    scene.add(rimLight);

    // --- SUBTLE POST-PROCESSING ---
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(stage.clientWidth, stage.clientHeight),
        0.15, // Extremely subtle bloom just for specular metallic glints
        0.2, 
        0.85  // High threshold so only direct light reflections glow
    );

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- PROCEDURAL MACHINED GEAR GENERATOR ---
    function createGear(radius, teethCount, extrusionDepth, colorHex, hasSpokes, initialRotation = 0) {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.85; 
        const step = (Math.PI * 2) / teethCount;

        for (let i = 0; i < teethCount; i++) {
            const angle = i * step;
            shape.lineTo(Math.cos(angle - step/4) * innerRadius, Math.sin(angle - step/4) * innerRadius);
            shape.lineTo(Math.cos(angle - step/5) * radius, Math.sin(angle - step/5) * radius);
            shape.lineTo(Math.cos(angle + step/5) * radius, Math.sin(angle + step/5) * radius);
            shape.lineTo(Math.cos(angle + step/4) * innerRadius, Math.sin(angle + step/4) * innerRadius);
        }
        shape.closePath();

        if (hasSpokes) {
            const numSpokes = 6;
            const spokeInner = radius * 0.25;
            const spokeOuter = radius * 0.65;
            
            for (let j = 0; j < numSpokes; j++) {
                const spokeAngle = (Math.PI * 2) / numSpokes;
                const angleStart = j * spokeAngle + 0.15;
                const angleEnd = (j + 1) * spokeAngle - 0.15;
                
                const holePath = new THREE.Path();
                holePath.absarc(0, 0, spokeOuter, angleStart, angleEnd, false);
                holePath.absarc(0, 0, spokeInner, angleEnd, angleStart, true);
                shape.holes.push(holePath);
            }
        } else {
            const holePath = new THREE.Path();
            holePath.absarc(0, 0, radius * 0.3, 0, Math.PI * 2, false);
            shape.holes.push(holePath);
        }

        const extrudeSettings = { 
            depth: extrusionDepth, 
            bevelEnabled: true, 
            bevelSegments: 3, 
            steps: 1, 
            bevelSize: 0.1, 
            bevelThickness: 0.1 
        };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();

        // TRUE METALLIC SHADERS
        const material = new THREE.MeshStandardMaterial({ 
            color: colorHex, 
            metalness: 0.9,   // Highly metallic
            roughness: 0.35,  // Slight roughness for brushed metal look
            envMapIntensity: 1.0 
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.x = -Math.PI / 2; 
        mesh.rotation.z = initialRotation; // Click teeth into place
        return mesh;
    }

    // --- BUILD THE EXPANSIVE HORIZONTAL GEAR MATRIX ---
    const gearSystem = new THREE.Group();
    gearSystem.position.set(0, -2, -5);
    scene.add(gearSystem);

    // Material Colors
    const SILVER = 0xe0e0e0;
    const BRONZE = 0xcc7733; 
    const DARK_STEEL = 0x444444;

    const gears = []; // Store them to animate cleanly

    // HELPER: Add a gear and calculate its interlocking position/rotation
    function addMeshedGear(parentGear, radius, teeth, color, hasSpokes, angleFromParent, yOffset) {
        const parentRadius = parentGear.userData.radius;
        const distance = parentRadius + radius - 0.15; // -0.15 forces teeth to sink into each other
        
        const x = parentGear.position.x + Math.cos(angleFromParent) * distance;
        const z = parentGear.position.z + Math.sin(angleFromParent) * distance;
        
        const gear = createGear(radius, teeth, 0.8, color, hasSpokes);
        gear.position.set(x, parentGear.position.y + yOffset, z);
        
        // Save data for animation physics
        gear.userData = {
            radius: radius,
            teeth: teeth,
            parent: parentGear,
            ratio: parentGear.userData.teeth / teeth
        };
        
        gearSystem.add(gear);
        gears.push(gear);
        return gear;
    }

    // LAYER 1: BASE LEVEL
    const g1_center = createGear(5.0, 30, 1.0, SILVER, true);
    g1_center.position.set(0, 0, 0);
    g1_center.userData = { radius: 5.0, teeth: 30, isDriver: true };
    gearSystem.add(g1_center);
    gears.push(g1_center);

    // Expanding horizontally
    const g2_right = addMeshedGear(g1_center, 3.0, 18, BRONZE, true, 0, 0); // Directly right
    const g3_farRight = addMeshedGear(g2_right, 4.0, 24, DARK_STEEL, true, 0.5, 0); 
    const g4_left = addMeshedGear(g1_center, 4.0, 24, DARK_STEEL, true, Math.PI, 0); // Directly left
    const g5_farLeft = addMeshedGear(g4_left, 2.5, 15, BRONZE, false, Math.PI - 0.5, 0);

    // LAYER 2: ELEVATED GEARS
    const g6_topCenter = createGear(2.5, 15, 0.6, BRONZE, false);
    g6_topCenter.position.set(0, 1.2, 0); // Stacked exactly on center axle
    g6_topCenter.userData = { radius: 2.5, teeth: 15, isDriver: true, linkedTo: g1_center };
    gearSystem.add(g6_topCenter);
    gears.push(g6_topCenter);

    const g7_topRight = addMeshedGear(g6_topCenter, 3.5, 21, SILVER, true, -0.8, 0);
    const g8_topLeft = addMeshedGear(g6_topCenter, 3.0, 18, DARK_STEEL, true, 3.5, 0);

    // LAYER 3: BACKGROUND/BOTTOM SUPPORT GEARS
    const g9_back = addMeshedGear(g1_center, 6.0, 36, DARK_STEEL, true, -1.5, -1.0);


    // --- 3. HARDWARE ACCELERATED RENDER LOOP ---
    let clock = new THREE.Clock();

    function renderFramePhysics() {
        requestAnimationFrame(renderFramePhysics);
        const elapsedTime = clock.getElapsedTime();
        const baseSpeed = 0.4;

        // Drive the center gears
        const mainRotation = elapsedTime * baseSpeed;
        g1_center.rotation.z = mainRotation;
        g6_topCenter.rotation.z = mainRotation; // Stacked on same axle
        
        // Physics engine: automatically calculate rotation for all meshed gears
        gears.forEach((gear, index) => {
            if (!gear.userData.isDriver && gear.userData.parent) {
                // Determine direction based on parent's current rotation
                const parentRot = gear.userData.parent.rotation.z;
                // Add a tiny arbitrary offset based on the index to force the teeth to slot in
                const offset = index * 0.12; 
                gear.rotation.z = -(parentRot * gear.userData.ratio) + offset;
            }
        });

        // Slow cinematic panning
        gearSystem.rotation.y = Math.sin(elapsedTime * 0.1) * 0.1;

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