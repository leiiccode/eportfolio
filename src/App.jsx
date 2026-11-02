import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import HeroSection from './components/HeroSection.jsx';
import ServicesSection from './components/ServicesSection.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbfbfd] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <Header />

      <main className="grow">
        <HeroSection />
        <ServicesSection />
      </main>

      <Footer />
    </div>
  );
}
