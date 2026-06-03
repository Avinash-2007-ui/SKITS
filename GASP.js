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
    // =======================================================================
    const CONFIG = {
        // The Sleek Cyber Blue Theme from your screenshot
        colorMain: 0x0ea5e9,   // Deep Blue
        colorSub: 0x38bdf8,    // Light Cyan
        colorAccent: 0xffffff, // White
        
        spinSpeed: 0.05,       
        glowIntensity: 1.5,    
        ambientLight: 0.5      
    };
    // =======================================================================

    // 1. GSAP ENTRANCE TIMELINE (Cinematic Reveal)
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();
    
    // Instantly strip the old CSS block-fade so we can animate individual elements
    gsap.set("#hero-content", { opacity: 1, y: 0 }); 

    tl.to("#preloader", {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => { document.getElementById("preloader").style.display = "none"; }
    })
    // Step 1: Slide in the "Enterprise Grade Systems" pill
    .fromTo("#hero-content > span", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 
        "-=0.2"
    )
    // Step 2: The Video-Style Reformation (Blur & Scale in) for the H1
    .fromTo("#hero-content h1", 
        { opacity: 0, y: 30, scale: 0.95, filter: "blur(12px)" }, 
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }, 
        "-=0.6"
    )
    // Step 3: Smooth fade-up for the description paragraph
    .fromTo("#hero-content p", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 
        "-=0.8"
    )
    // Step 4: Stagger the buttons so they pop up one after the other
    .fromTo("#hero-content button", 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" }, 
        "-=0.8"
    );
    // 2. THREE.JS ENGINE SETUP
    const stage = document.getElementById('canvas-3d-stage');
    if (!stage) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070708);
    scene.fog = new THREE.FogExp2(0x070708, 0.015); 
    
    // Camera positioned high up looking down at the network
    const camera = new THREE.PerspectiveCamera(50, stage.clientWidth / stage.clientHeight, 0.1, 200);
    camera.position.set(0, 18, 35); 
    camera.lookAt(0, 0, 0); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    stage.appendChild(renderer.domElement);

    // --- POST-PROCESSING (THE NEON GLOW) ---
    const renderScene = new THREE.RenderPass(scene, camera);
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(stage.clientWidth, stage.clientHeight),
        CONFIG.glowIntensity, 
        0.5,                  
        0.2                   
    );
    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // =======================================================================
    // LAYER 1: THE GRID FLOOR
    // =======================================================================
    const gridHelper = new THREE.GridHelper(100, 100, 0x222222, 0x111111);
    gridHelper.position.y = -4.0;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.5;
    scene.add(gridHelper);

    // =======================================================================
    // LAYER 2: THE ORBITAL NETWORK
    // =======================================================================
    const orbitalSystem = new THREE.Group();
    orbitalSystem.rotation.x = -0.15; // Slight tilt
    scene.add(orbitalSystem);

    // HELPER: Draw Rings
    function buildGlowingRing(radius, colorHex, opacity, isDashed = false) {
        const points = [];
        for (let i = 0; i <= 64; i++) {
            const theta = (i / 64) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        let mat = isDashed 
            ? new THREE.LineDashedMaterial({ color: colorHex, dashSize: 0.5, gapSize: 0.5, transparent: true, opacity: opacity })
            : new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: opacity });
        const line = new THREE.Line(geometry, mat);
        if (isDashed) line.computeLineDistances();
        return line;
    }

    // Add the Rings
    const ringRadii = [6, 8, 14, 20];
    orbitalSystem.add(buildGlowingRing(6, CONFIG.colorMain, 0.8, false));
    orbitalSystem.add(buildGlowingRing(8, CONFIG.colorMain, 0.4, true));
    orbitalSystem.add(buildGlowingRing(14, CONFIG.colorAccent, 0.4, true));
    orbitalSystem.add(buildGlowingRing(20, CONFIG.colorMain, 0.8, false));

    // GENERATE NODES & CONNECTIONS
    const nodePositions = [];
    const nodeMeshes = [];
    const nodeCount = 45;

    // 1. Create the floating data nodes
    for (let i = 0; i < nodeCount; i++) {
        const radius = ringRadii[Math.floor(Math.random() * ringRadii.length)];
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const pos = new THREE.Vector3(x, 0, z);
        nodePositions.push(pos);

        const isHighlighted = Math.random() > 0.85;
        const size = isHighlighted ? 0.3 : 0.15;
        const color = isHighlighted ? CONFIG.colorSub : CONFIG.colorAccent;

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(size, 16, 16),
            new THREE.MeshBasicMaterial({ color: color })
        );
        mesh.position.copy(pos);
        
        // Save a random time offset so they bob up and down independently
        mesh.userData = { timeOffset: Math.random() * 100 };
        
        orbitalSystem.add(mesh);
        nodeMeshes.push(mesh);
    }

    // 2. Draw lines between nearby nodes to create the constellation
    const lineMat = new THREE.LineBasicMaterial({ color: CONFIG.colorAccent, transparent: true, opacity: 0.15 });
    for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
            if (nodePositions[i].distanceTo(nodePositions[j]) < 6.5) {
                const geo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
                const line = new THREE.Line(geo, lineMat);
                orbitalSystem.add(line);
            }
        }
    }

    // --- 3. RENDER LOOP ---
    let clock = new THREE.Clock();

    function renderFramePhysics() {
        requestAnimationFrame(renderFramePhysics);
        const time = clock.getElapsedTime();

        // Rotate the entire constellation
        orbitalSystem.rotation.y = time * CONFIG.spinSpeed;

        // Bob the nodes up and down slightly
        nodeMeshes.forEach((mesh) => {
            mesh.position.y = Math.sin(time * 1.5 + mesh.userData.timeOffset) * 0.3;
        });

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