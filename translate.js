/* ==========================================================================
   SKITS GLOBAL LOCALIZATION ENGINE
   ========================================================================== */

const translations = {
    en: {
        // Navigation
        nav_home: "Home",
        nav_services: "Services",
        nav_about: "About",
        nav_contact: "Contact",
        nav_tech_brief: "Get Tech Brief",

        // Hero Section
        hero_pill: "Enterprise Grade Systems",
        hero_title: "Powering the Future of <br> Industrial Automation",
        hero_desc: "Engineered precision mapping solutions, multi-layer routing matrices, and fail-safe automation architectures built for industrial scaling.",
        hero_btn_explore: "Explore Infrastructure",
        hero_btn_arch: "Technical Architecture",

        // Metrics Banner
        metric_years: "Years Engineering",
        metric_nodes: "Industrial Nodes",
        metric_uptime: "System Uptime",

        // Services Section
        services_title: "Core Competencies & Services",
        services_desc: "High-integrity execution patterns designed to optimize factories, plants, and complex networking hardware fields.",
        
        card1_title: "Industrial Automation & Robotics",
        card1_desc: "High-speed system deployment, precise factory-wide wiring arrays, and machine-level control structures built for heavy industrial environments.",
        
        card2_title: "Custom PCB Design",
        card2_desc: "Multilayer routing and micro-component board development.",
        
        card3_title: "Telecom & Camera Matrices",
        card3_desc: "Structural enterprise network mapping, optical routing, and multi-layered closed-circuit safety arrays.",
        
        card4_title: "Fail-Safe Hardware Integration",
        card4_desc: "Deploying specialized security architecture safeguards directly to physical industrial nodes for uninterrupted uptime.",

        // Footer
        footer_copyright: "&copy; 2026 SKITS Engineering. All rights reserved."
    },
    es: {
        // Navigation
        nav_home: "Inicio",
        nav_services: "Servicios",
        nav_about: "Nosotros",
        nav_contact: "Contacto",
        nav_tech_brief: "Informe Técnico",

        // Hero Section
        hero_pill: "Sistemas de Nivel Empresarial",
        hero_title: "Impulsando el Futuro de la <br> Automatización Industrial",
        hero_desc: "Soluciones de mapeo de precisión, matrices de enrutamiento multicapa y arquitecturas de automatización a prueba de fallas para escalamiento industrial.",
        hero_btn_explore: "Explorar Infraestructura",
        hero_btn_arch: "Arquitectura Técnica",

        // Metrics Banner
        metric_years: "Años de Ingeniería",
        metric_nodes: "Nodos Industriales",
        metric_uptime: "Tiempo de Actividad",

        // Services Section
        services_title: "Competencias y Servicios Principales",
        services_desc: "Patrones de ejecución de alta integridad diseñados para optimizar fábricas, plantas y campos de hardware de redes complejas.",
        
        card1_title: "Automatización Industrial y Robótica",
        card1_desc: "Implementación de sistemas de alta velocidad, matrices de cableado precisas y estructuras de control a nivel de máquina construidas para entornos industriales pesados.",
        
        card2_title: "Diseño de PCB Personalizado",
        card2_desc: "Enrutamiento multicapa y desarrollo de placas de microcomponentes.",
        
        card3_title: "Telecomunicaciones y Matrices de Cámaras",
        card3_desc: "Mapeo estructural de redes empresariales, enrutamiento óptico y matrices de seguridad de circuito cerrado multicapa.",
        
        card4_title: "Integración de Hardware a Prueba de Fallas",
        card4_desc: "Implementación de salvaguardas de arquitectura de seguridad especializadas directamente en nodos industriales físicos para un tiempo de actividad ininterrumpido.",

        // Footer
        footer_copyright: "&copy; 2026 SKITS Engineering. Todos los derechos reservados."
    },
    de: {
        // Navigation
        nav_home: "Startseite",
        nav_services: "Dienste",
        nav_about: "Über uns",
        nav_contact: "Kontakt",
        nav_tech_brief: "Technik-Briefing",

        // Hero Section
        hero_pill: "Enterprise-Grade Systeme",
        hero_title: "Wir treiben die Zukunft der <br> Industrieautomatisierung an",
        hero_desc: "Präzisions-Mapping-Lösungen, mehrschichtige Routing-Matrizen und ausfallsichere Automatisierungsarchitekturen für industrielle Skalierung.",
        hero_btn_explore: "Infrastruktur Erkunden",
        hero_btn_arch: "Technische Architektur",

        // Metrics Banner
        metric_years: "Jahre Engineering",
        metric_nodes: "Industrieknoten",
        metric_uptime: "Systemverfügbarkeit",

        // Services Section
        services_title: "Kernkompetenzen & Dienstleistungen",
        services_desc: "Hochintegre Ausführungsmuster zur Optimierung von Fabriken, Anlagen und komplexen Netzwerk-Hardwarefeldern.",
        
        card1_title: "Industrieautomatisierung & Robotik",
        card1_desc: "Hochgeschwindigkeits-Systembereitstellung, präzise fabrikweite Verkabelungen und maschinennahe Steuerungsstrukturen für schwere Industrieumgebungen.",
        
        card2_title: "Kundenspezifisches PCB-Design",
        card2_desc: "Multilayer-Routing und Entwicklung von Mikrokomponenten-Boards.",
        
        card3_title: "Telekom- & Kameramatrizen",
        card3_desc: "Strukturelles Unternehmensnetzwerk-Mapping, optisches Routing und mehrschichtige Closed-Circuit-Sicherheitsarrays.",
        
        card4_title: "Ausfallsichere Hardware-Integration",
        card4_desc: "Einsatz spezieller Sicherheitsarchitektur-Schutzmaßnahmen direkt an physischen Industrieknoten für ununterbrochene Betriebszeit.",

        // Footer
        footer_copyright: "&copy; 2026 SKITS Engineering. Alle Rechte vorbehalten."
    }
};

/* --- CORE TRANSLATION LOGIC --- */
function applyTranslations(lang) {
    const dictionary = translations[lang];
    // Fallback to English if the dictionary doesn't exist yet (like for IT, FR, ZH)
    if (!dictionary) return applyTranslations('en'); 

    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        const translation = dictionary[key];
        
        if (translation) {
            // Uses innerHTML so tags like <br> work correctly in the hero title
            element.innerHTML = translation; 
        }
    });
}

/* --- EVENT LISTENERS FOR FOOTER BUTTONS --- */
document.querySelectorAll('[data-lang]').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Stops the page from jumping to top
        const lang = link.getAttribute('data-lang');
        
        applyTranslations(lang);
        localStorage.setItem('skits_lang', lang); // Save preference in browser
    });
});

/* --- INITIALIZATION ON LOAD --- */
function initializeLanguage() {
    // Check if the user has visited before and set a language
    const savedLang = localStorage.getItem('skits_lang');
    if (savedLang) {
        applyTranslations(savedLang);
    } else {
        applyTranslations('en'); // Default to English
    }
}

// Run the engine as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', initializeLanguage);