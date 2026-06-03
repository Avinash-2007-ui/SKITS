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
    // Change your colors, speeds, and lighting here without breaking the math!
    // =======================================================================
    const CONFIG = {
        // Colors
        gearSilver: 0xcccccc,
        gearCopper: 0xc06020,
        gearDark: 0x333333,
        ringOuter: 0xea580c,   // Orange HUD
        ringInner: 0xffffff,   // White HUD
        
        // Speeds (Lower is slower)
        gearSpeed: 0.2,        
        hudSpinSpeed: 0.1,     
        cameraPanSpeed: 0.05,  

        // Lighting & Glow
        glowIntensity: 0.8,    // How much the rings glow
        ambientLight: 0.5      // Base brightness of the scene
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
    scene.fog = new THREE.FogExp2(0x070708, 0.018); 
    
    const camera = new THREE.PerspectiveCamera(50, stage.clientWidth / stage.clientHeight, 0.1, 200);
    camera.position.set(0, 10, 30); 
    camera.lookAt(0, 2, 0); 

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.appendChild(renderer.domElement);

    // --- LIGHTING RIG ---
    scene.add(new THREE.AmbientLight(0xffffff, CONFIG.ambientLight));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(15, 30, 15);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(CONFIG.ringOuter, 4.0);
    rimLight.position.set(-20, 5, -20);
    scene.add(rimLight);

    // --- POST-PROCESSING ---
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(stage.clientWidth, stage.clientHeight),
        CONFIG.glowIntensity, 0.5, 0.65 
    );
    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- LAYER 1: THE INDUSTRIAL GRID FLOOR ---
    const floorGroup = new THREE.Group();
    floorGroup.position.y = -5.0; 
    scene.add(floorGroup);

    const gridHelper = new THREE.GridHelper(150, 150, 0x333333, 0x111111);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.5;
    floorGroup.add(gridHelper);

    // --- LAYER 2: THE HORIZONTAL GEAR MATRIX ---
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
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center(); 
        
        const bodyMesh = new THREE.Mesh(geometry, metalMaterial);
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        gearAssembly.add(bodyMesh);

        const hubMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.25, radius * 0.25, extrusionDepth + 0.2, 32), metalMaterial);
        hubMesh.rotation.x = Math.PI / 2;
        gearAssembly.add(hubMesh);

        // LAYS THE GEAR FLAT ON THE FLOOR
        gearAssembly.rotation.x = -Math.PI / 2;
        return gearAssembly;
    }

    const gears = [];

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

    // Generating the gears using your CONFIG colors
    const g1 = buildDetailedGear(4.0, 24, 1.0, CONFIG.gearSilver, true);
    g1.position.set(0, 0, 0);
    g1.userData = { radius: 4.0, teeth: 24, isDriver: true };
    gearSystem.add(g1);
    gears.push(g1);

    const g2 = addMeshedGear(g1, 2.5, 15, CONFIG.gearCopper, true, 0.2, 0);
    const g3 = addMeshedGear(g2, 3.5, 21, CONFIG.gearDark, true, -0.2, 0); 
    const g4 = addMeshedGear(g1, 3.0, 18, CONFIG.gearDark, true, Math.PI - 0.3, 0); 
    const g5 = addMeshedGear(g4, 2.0, 12, CONFIG.gearCopper, false, Math.PI + 0.2, 0);

    // --- LAYER 3: THE FLOATING ORBITAL HUD ---
    const orbitalSystem = new THREE.Group();
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

    // Using your CONFIG colors for the HUD
    const ring1 = buildGlowingRing(6.0, CONFIG.ringOuter, false); 
    const ring2 = buildGlowingRing(5.5, CONFIG.ringOuter, true);  
    const ring3 = buildGlowingRing(3.5, CONFIG.ringInner, true);  
    
    orbitalSystem.add(ring1);
    orbitalSystem.add(ring2);
    orbitalSystem.add(ring3);

    const nodeGroup = new THREE.Group();
    orbitalSystem.add(nodeGroup);
    
    function createDataNode(color, size, x) {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide }));
        mesh.rotation.x = Math.PI / 2;
        mesh.position.set(x, 0, 0);
        nodeGroup.add(mesh);
        return mesh;
    }
    
    createDataNode(CONFIG.ringInner, 0.2, 6.0);
    createDataNode(CONFIG.ringOuter, 0.15, 6.0, 0.5); 
    createDataNode(CONFIG.ringInner, 0.1, 3.5); 

    // --- 4. RENDER LOOP ---
    let clock = new THREE.Clock();

    function renderFramePhysics() {
        requestAnimationFrame(renderFramePhysics);
        const time = clock.getElapsedTime();

        // BUG FIX: Rotating on the Z axis makes the flat gears spin like records!
        g1.rotation.z = time * CONFIG.gearSpeed; 
        
        gears.forEach((gear, index) => {
            if (!gear.userData.isDriver && gear.userData.parent) {
                const parentRot = gear.userData.parent.rotation.z;
                gear.rotation.z = -(parentRot * gear.userData.ratio) + (index * 0.12);
            }
        });

        // HUD Animation
        ring1.rotation.y = time * CONFIG.hudSpinSpeed;
        ring2.rotation.y = -time * (CONFIG.hudSpinSpeed * 1.5);
        ring3.rotation.y = time * (CONFIG.hudSpinSpeed * 2);
        nodeGroup.rotation.y = time * (CONFIG.hudSpinSpeed * 4); 

        // Cinematic Pan
        gearSystem.rotation.y = Math.sin(time * CONFIG.cameraPanSpeed) * 0.1;
        orbitalSystem.rotation.y = Math.sin(time * CONFIG.cameraPanSpeed) * 0.1;

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