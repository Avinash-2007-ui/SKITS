const { useState, useEffect } = React;

function SKITSNavbar() {
  const rootElement = document.getElementById('react-navbar-root');
  const activePage = rootElement.getAttribute('data-active-page') || 'home';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // --- THE INTEGRATION BRIDGE ---
  // This tells React to run your translate.js script every time the Navbar loads or the mobile menu opens!
  useEffect(() => {
    if (typeof applyTranslations === 'function') {
      const savedLang = localStorage.getItem('skits_lang') || 'en';
      applyTranslations(savedLang);
    }
  }, [isMobileMenuOpen]);

  return (
    // Added id="navbar" back so GASP.js can animate it!
    <header id="navbar" className="fixed top-6 inset-x-0 z-50 flex flex-col items-center px-4 opacity-0">
      <nav className="flex items-center justify-between w-full max-w-5xl h-14 px-6 rounded-full shadow-2xl relative border border-zinc-800/50 bg-zinc-950/60 backdrop-blur-md">
        
        <a href="index.html" className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500 cursor-pointer">
          SKITS
        </a>
        
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium h-full">
          <li>
            <a href="index.html" className={`transition-colors cursor-pointer ${activePage === 'home' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'}`} data-key="nav_home">
              Home
            </a>
          </li>
          
          <li className="relative group h-full flex items-center">
            <a href="automation.html" className={`transition-colors cursor-pointer flex items-center gap-1 py-4 ${activePage === 'services' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'}`} data-key="nav_services">
              Services
              <svg className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M19 9l-7 7-7-7"/></svg>
            </a>
            
            <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-64 hidden group-hover:block pt-2">
              <div className="bg-zinc-950/95 border border-zinc-800/80 backdrop-blur-xl p-3 rounded-2xl shadow-2xl flex flex-col gap-1">
                <a href="automation.html" className="px-4 py-2.5 text-xs font-semibold hover:bg-orange-500/10 hover:text-orange-400 rounded-xl transition-all text-zinc-400" data-key="card1_title">Industrial Automation & Robotics</a>
                <a href="#" className="px-4 py-2.5 text-xs font-semibold hover:bg-blue-500/10 hover:text-blue-400 rounded-xl transition-all text-zinc-400" data-key="card2_title">Medical Equipment & Health Care</a>
              </div>
            </div>
          </li>
          
          <li><a href="#" className={`transition-colors cursor-pointer ${activePage === 'about' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'}`} data-key="nav_about">About</a></li>
          <li><a href="#contact" className={`transition-colors cursor-pointer ${activePage === 'contact' ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'}`} data-key="nav_contact">Contact</a></li>
        </ul>
        
        <button className="hidden md:flex items-center justify-center px-6 h-9 text-xs font-bold bg-sky-500 text-white rounded-full hover:bg-sky-400 transition-all duration-300 shadow-[0_0_15px_rgba(14,165,233,0.4)]" data-key="nav_tech_brief">
          Initiate Contact
        </button>

        <button onClick={toggleMobileMenu} className="block md:hidden text-zinc-400 hover:text-white p-1 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            {isMobileMenuOpen ? (
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="w-full max-w-5xl mt-2 md:hidden px-4">
          <div className="bg-zinc-950/90 border border-zinc-800/60 backdrop-blur-xl rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <ul className="flex flex-col gap-3 text-sm font-medium text-zinc-400">
              <li><a href="index.html" className="block py-1 hover:text-white transition-colors" data-key="nav_home">Home</a></li>
              <li className="border-y border-zinc-900 py-2 my-1">
                <div className="text-xs font-bold tracking-widest text-zinc-600 uppercase mb-2" data-key="nav_services">Services</div>
                <div className="flex flex-col gap-2.5 pl-3 border-l border-zinc-800">
                  <a href="automation.html" className="text-xs hover:text-orange-400 transition-colors" data-key="card1_title">Industrial Automation & Robotics</a>
                  <a href="#" className="text-xs hover:text-blue-400 transition-colors" data-key="card2_title">Medical Equipment & Health Care</a>
                </div>
              </li>
              <li><a href="#" className="block py-1 hover:text-white transition-colors" data-key="nav_about">About</a></li>
              <li><a href="#contact" className="block py-1 hover:text-white transition-colors" data-key="nav_contact">Contact</a></li>
            </ul>
            <button className="w-full h-10 text-xs font-bold bg-zinc-100 text-black rounded-xl hover:bg-sky-500 hover:text-white transition-all duration-300" data-key="nav_tech_brief">
                Initiate Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

const root = ReactDOM.createRoot(document.getElementById('react-navbar-root'));
root.render(<SKITSNavbar />);