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
    // 1. GSAP ENTRANCE TIMELINE (Unchanged)
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
    scene.fog = new THREE.FogExp2(0x070708, 0.02); 
    
    // Moved the camera up to look down at the gears, matching your reference image
    const camera = new THREE.PerspectiveCamera(50, stage.clientWidth / stage.clientHeight, 0.1, 100);
    camera.position.set(0, 12, 12); 
    camera.lookAt(0, 0, 0); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Enable physical lighting and shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    stage.appendChild(renderer.domElement);

    // --- STUDIO LIGHTING (Crucial for metallic reflections) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Orange accent light to tie into the SKITS theme
    const orangeLight = new THREE.PointLight(0xea580c, 5.0, 50);
    orangeLight.position.set(-10, 5, -5);
    scene.add(orangeLight);

    // --- POST-PROCESSING (Subtle bloom for the metal highlights) ---
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(stage.clientWidth, stage.clientHeight),
        0.6,  // Lower intensity so it looks like metal, not neon
        0.4, 
        0.6   // High threshold so only the brightest reflections glow
    );

    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- PROCEDURAL 3D GEAR GENERATOR ---
    function createGear(radius, teethCount, extrusionDepth, colorHex, metalness, roughness) {
        const shape = new THREE.Shape();
        const innerRadius = radius * 0.85; // Depth of the teeth
        const step = (Math.PI * 2) / teethCount;

        // Mathematically draw the gear teeth
        for (let i = 0; i < teethCount; i++) {
            const angle = i * step;
            shape.lineTo(Math.cos(angle - step/4) * innerRadius, Math.sin(angle - step/4) * innerRadius);
            shape.lineTo(Math.cos(angle - step/5) * radius, Math.sin(angle - step/5) * radius);
            shape.lineTo(Math.cos(angle + step/5) * radius, Math.sin(angle + step/5) * radius);
            shape.lineTo(Math.cos(angle + step/4) * innerRadius, Math.sin(angle + step/4) * innerRadius);
        }
        shape.closePath();

        // Cut a mechanical axle hole in the center
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, radius * 0.3, 0, Math.PI * 2, false);
        shape.holes.push(holePath);

        // Extrude the 2D drawing into a 3D block with beveled edges
        const extrudeSettings = { 
            depth: extrusionDepth, 
            bevelEnabled: true, 
            bevelSegments: 3, 
            steps: 1, 
            bevelSize: 0.1, 
            bevelThickness: 0.1 
        };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        // Center the geometry so it rotates perfectly on its axis
        geometry.center();

        // Realistic Metal Material
        const material = new THREE.MeshStandardMaterial({ 
            color: colorHex, 
            metalness: metalness, 
            roughness: roughness 
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Rotate to lay flat on the floor
        mesh.rotation.x = -Math.PI / 2;
        return mesh;
    }

    // --- BUILD THE INTERLOCKING GEAR TRAIN ---
    const gearSystem = new THREE.Group();
    // Shifted slightly to the right to frame the text nicely
    gearSystem.position.set(2, -2, -2);
    scene.add(gearSystem);

    // Materials based on your reference image
    const SILVER = 0xdddddd;
    const BRONZE = 0xea580c; // Adapted to SKITS Orange

    // 1. Center Gear (Large, Silver)
    const gearCenter = createGear(4.0, 24, 0.8, SILVER, 0.9, 0.3);
    gearSystem.add(gearCenter);

    // 2. Right Gear (Medium, Bronze) - Meshes with Center
    const gearRight = createGear(2.5, 15, 0.6, BRONZE, 0.8, 0.4);
    // Positioned exactly where the teeth intersect
    gearRight.position.set(6.2, 0.5, 0); 
    // Offset rotation so teeth slot into the gaps
    gearRight.rotation.z = 0.1;
    gearSystem.add(gearRight);

    // 3. Top Left Gear (Small, Silver) - Meshes with Center
    const gearTop = createGear(2.0, 12, 1.0, SILVER, 0.9, 0.2);
    gearTop.position.set(-3.5, -0.4, -4.5);
    gearTop.rotation.z = 0.2;
    gearSystem.add(gearTop);

    // 4. Floating Top Gear (Stacked on the Center Gear)
    const gearStacked = createGear(1.8, 10, 0.4, BRONZE, 0.8, 0.4);
    gearStacked.position.set(0, 1.0, 0);
    gearSystem.add(gearStacked);

    // --- 3. HARDWARE ACCELERATED RENDER LOOP ---
    let clock = new THREE.Clock();

    function renderFramePhysics() {
        requestAnimationFrame(renderFramePhysics);
        const elapsedTime = clock.getElapsedTime();

        // Base speed
        const speed = 0.5;

        // GEAR RATIO MATH: 
        // If the center gear has 24 teeth, and the right gear has 15 teeth, 
        // the right gear must spin (24/15) times faster in the OPPOSITE direction to mesh perfectly.
        
        gearCenter.rotation.z = elapsedTime * speed;
        gearStacked.rotation.z = elapsedTime * speed; // Stacked on the same axle

        gearRight.rotation.z = -(elapsedTime * speed * (24/15)) + 0.1; 
        gearTop.rotation.z = -(elapsedTime * speed * (24/12)) + 0.2; 

        // Very slow rotation of the entire system for a cinematic feel
        gearSystem.rotation.y = elapsedTime * 0.05;

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