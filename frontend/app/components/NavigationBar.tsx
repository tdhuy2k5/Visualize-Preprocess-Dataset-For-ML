const NavigationBar = function () {
  return (
    <header className="bg-[#0b1326] flex justify-between items-center px-6 h-14 w-full z-50 docked full-width top-0 sticky">
      <div className="flex items-center gap-8">
        <span className="text-lg font-extrabold text-white tracking-tighter font-headline">
          The Observational Engine
        </span>
        <nav className="hidden md:flex gap-6 items-center h-full">
          <a
            className="font-['Manrope'] font-bold text-sm tracking-tight text-slate-400 hover:text-white transition-colors"
            href="#"
          >
            Workflows
          </a>
          <a
            className="font-['Manrope'] font-bold text-sm tracking-tight text-sky-400 border-b-2 border-sky-400 pb-1"
            href="#"
          >
            Datasets
          </a>
          <a
            className="font-['Manrope'] font-bold text-sm tracking-tight text-slate-400 hover:text-white transition-colors"
            href="#"
          >
            Models
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative group">
          <span className="material-symbols-outlined text-slate-400 group-hover:text-white cursor-pointer transition-colors">
            notifications
          </span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
        </div>
        <span className="material-symbols-outlined text-slate-400 hover:text-white cursor-pointer transition-colors">
          settings
        </span>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/30">
          <img
            alt="User Profile"
            className="w-full h-full object-cover"
            data-alt="close-up portrait of a professional data scientist in a dimly lit tech environment with blue ambient light"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBexv8Nz3EFz1maJmDAhVmd7PSBR3uhT-vzkp-xE-QNZa4Oq7QDrjUqAOa3rks2CKYAoMmp27b_1ZvrjLYDPq8Gw6PNJe9ZexJS4pwHpqYChAjIinmYXVKUUPtVoqFd6fhudEazuYcaYHwqzYScLnwUt-MJ3qKOJWJgj2PkuXbudj2LHims55EotNWEUlFSEi5l3ORy1d_vE_7JHeDAC-IlBtQoEcAKpMFhkmY9uzD77KmIIVhKpQFeoyTsXcjPfLSzUctG2GVsHmE"
          />
        </div>
      </div>
    </header>
  );
};
export default NavigationBar;
