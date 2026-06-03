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
    scene.fog = new THREE.FogExp2(0x070708, 0.025); 
    
    // Pulled camera back to capture the massive horizontal scale
    const camera = new THREE.PerspectiveCamera(50, stage.clientWidth / stage.clientHeight, 0.1, 100);
    camera.position.set(0, 14, 18); 
    camera.lookAt(0, -2, 0); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.appendChild(renderer.domElement);

    // --- BRINGING BACK THE INDUSTRIAL FLOOR GRID ---
    const gridHelper = new THREE.GridHelper(100, 100, 0x333333, 0x111111);
    gridHelper.position.y = -3.5; // Placed below the lowest gears
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.5;
    scene.add(gridHelper);

    // --- PHOTOREALISTIC STUDIO LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(15, 25, 10);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Faint orange under-glow to keep the SKITS branding
    const orangeLight = new THREE.PointLight(0xea580c, 4.0, 50);
    orangeLight.position.set(-10, -2, -5);
    scene.add(orangeLight);

    // --- REFINED POST-PROCESSING (Less neon, more shiny metal) ---
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(stage.clientWidth, stage.clientHeight),
        0.3,  // Lowered intensity so it looks like reflections, not neon tubes
        0.4, 
        0.75  // High threshold so only the brightest highlights glow
    );

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- PROCEDURAL MACHINED GEAR GENERATOR ---
    function createGear(radius, teethCount, extrusionDepth, colorHex, hasSpokes) {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.85; 
        const step = (Math.PI * 2) / teethCount;

        // Draw the outer teeth
        for (let i = 0; i < teethCount; i++) {
            const angle = i * step;
            shape.lineTo(Math.cos(angle - step/4) * innerRadius, Math.sin(angle - step/4) * innerRadius);
            shape.lineTo(Math.cos(angle - step/5) * radius, Math.sin(angle - step/5) * radius);
            shape.lineTo(Math.cos(angle + step/5) * radius, Math.sin(angle + step/5) * radius);
            shape.lineTo(Math.cos(angle + step/4) * innerRadius, Math.sin(angle + step/4) * innerRadius);
        }
        shape.closePath();

        // Add spokes (cutouts) to make it look like a real machined part
        if (hasSpokes) {
            const numSpokes = 5;
            const spokeInner = radius * 0.25;
            const spokeOuter = radius * 0.65;
            
            for (let j = 0; j < numSpokes; j++) {
                const spokeAngle = (Math.PI * 2) / numSpokes;
                const angleStart = j * spokeAngle + 0.25;
                const angleEnd = (j + 1) * spokeAngle - 0.25;
                
                const holePath = new THREE.Path();
                holePath.absarc(0, 0, spokeOuter, angleStart, angleEnd, false);
                holePath.absarc(0, 0, spokeInner, angleEnd, angleStart, true);
                shape.holes.push(holePath);
            }
        } else {
            // Just a central axle hole for smaller gears
            const holePath = new THREE.Path();
            holePath.absarc(0, 0, radius * 0.3, 0, Math.PI * 2, false);
            shape.holes.push(holePath);
        }

        const extrudeSettings = { 
            depth: extrusionDepth, 
            bevelEnabled: true, 
            bevelSegments: 2, 
            steps: 1, 
            bevelSize: 0.05, 
            bevelThickness: 0.05 
        };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();

        // Premium Metal Material
        const material = new THREE.MeshStandardMaterial({ 
            color: colorHex, 
            metalness: 1.0,  // Full metal
            roughness: 0.25  // Highly polished
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.x = -Math.PI / 2; // Lay flat
        return mesh;
    }

    // --- BUILD THE MASSIVE INTERLOCKING GEAR TRAIN ---
    const gearSystem = new THREE.Group();
    // Centered but pushed slightly right to balance the text
    gearSystem.position.set(2, -1, -2);
    scene.add(gearSystem);

    const SILVER = 0xdddddd;
    const BRONZE = 0xd97736; // A true copper/brass tone
    const DARK_STEEL = 0x555555;

    // GEAR 1: Center Main Hub (Large, Silver, Spoked)
    const gear1 = createGear(4.0, 24, 0.6, SILVER, true);
    gearSystem.add(gear1);

    // GEAR 2: Right Extension (Medium, Bronze, Spoked)
    const gear2 = createGear(2.5, 15, 0.6, BRONZE, true);
    gear2.position.set(6.5, 0, 0); // 4.0 + 2.5 = 6.5
    gearSystem.add(gear2);

    // GEAR 3: Left Extension (Large, Dark Steel, Spoked)
    const gear3 = createGear(3.0, 18, 0.8, DARK_STEEL, true);
    gear3.position.set(-7.0, 0, 0); // 4.0 + 3.0 = 7.0
    gearSystem.add(gear3);

    // GEAR 4: Top Level - Stacked on Gear 2 (Small, Silver, Solid)
    const gear4 = createGear(1.5, 9, 0.4, SILVER, false);
    gear4.position.set(6.5, 0.8, 0); // Same axle as gear 2, shifted up
    gearSystem.add(gear4);

    // GEAR 5: Top Level - Meshing with Gear 4 (Medium, Bronze, Spoked)
    const gear5 = createGear(2.0, 12, 0.4, BRONZE, true);
    gear5.position.set(6.5, 0.8, -3.5); // 1.5 + 2.0 = 3.5 backward on Z axis
    gearSystem.add(gear5);

    // GEAR 6: Bottom Level - Stacked under Main Hub (Small, Bronze, Solid)
    const gear6 = createGear(2.0, 12, 0.5, BRONZE, false);
    gear6.position.set(0, -0.8, 0); // Underneath gear 1
    gearSystem.add(gear6);

    // GEAR 7: Bottom Level - Meshing with Gear 6 (Large, Silver, Spoked)
    const gear7 = createGear(3.0, 18, 0.5, SILVER, true);
    gear7.position.set(0, -0.8, 5.0); // Coming toward the camera
    gearSystem.add(gear7);


    // --- 3. HARDWARE ACCELERATED RENDER LOOP ---
    let clock = new THREE.Clock();

    function renderFramePhysics() {
        requestAnimationFrame(renderFramePhysics);
        const time = clock.getElapsedTime();
        const speed = 0.5;

        // TRUE MECHANICAL GEAR RATIO MATH
        // To make the teeth interlock perfectly, the rotation speed is multiplied 
        // by the ratio of (Driver Teeth / Driven Teeth) in the opposite direction.
        
        const r1 = time * speed;
        gear1.rotation.z = r1;
        
        const r2 = -(r1 * (24/15)) + 0.1; // +0.1 offset meshes the teeth into the gaps
        gear2.rotation.z = r2;
        
        const r3 = -(r1 * (24/18)) - 0.05;
        gear3.rotation.z = r3;

        // Gear 4 shares the axle with Gear 2, so it spins at the exact same speed
        const r4 = r2;
        gear4.rotation.z = r4;

        // Gear 5 meshes with Gear 4
        const r5 = -(r4 * (9/12)) + 0.15;
        gear5.rotation.z = r5;

        // Gear 6 shares the axle with the Main Hub (Gear 1)
        const r6 = r1;
        gear6.rotation.z = r6;

        // Gear 7 meshes with Gear 6
        const r7 = -(r6 * (12/18)) - 0.1;
        gear7.rotation.z = r7;

        // Slow cinematic panning of the entire complex
        gearSystem.rotation.y = time * 0.05;

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