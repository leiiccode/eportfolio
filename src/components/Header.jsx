import logo from '../assets/calling-card-logo.png';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#fbfbfd]/90 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        <a href="#about" className="flex items-center justify-start min-w-0 hover:opacity-80 transition">
          <img src={logo} alt="Francis Pascua logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
        </a>

        <nav className="flex items-center justify-center gap-3 sm:gap-7 text-[10px] sm:text-sm font-medium text-zinc-600 whitespace-nowrap">
          <a href="#about" className="hover:text-zinc-950 transition">About</a>
          <a href="#services" className="hover:text-zinc-950 transition">Services</a>
        </nav>
      </div>
    </header>
  );
}
