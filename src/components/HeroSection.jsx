import { ArrowRight, Terminal } from 'lucide-react';
import { PROFILE_CONFIG } from '../data/portfolio.js';

export default function HeroSection() {
  return (
    <section id="about" className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-12 sm:pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 text-[11px] sm:text-xs font-mono font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Available for work
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            Francis Pascua
          </h1>

          <p className="text-sm sm:text-base font-semibold text-zinc-700">
            Computer Engineering Student • Web Dev • Graphic Design • Tech Support
          </p>

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
            I am a 21-year-old Computer Engineering student balancing academic studies with hands-on tech services. I build custom websites, design graphics &amp; pubmats, manage FB pages, program Smart NFC cards, and handle PC/laptop software troubleshooting at student-friendly rates.
          </p>

          <div className="relative overflow-hidden p-3.5 sm:p-4 rounded-xl bg-zinc-900 text-white border border-zinc-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-mono text-zinc-100">
                &quot;RISE UP, EVEN WHEN EVERYBODY BRINGS YOU DOWN.&quot;
              </p>
            </div>
          </div>

          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 transition shadow-sm"
          >
            View Services <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-xl bg-zinc-900 border border-zinc-800 shadow-md overflow-hidden font-mono text-xs text-zinc-300">
            <div className="bg-zinc-950 px-3.5 py-2.5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <span className="text-zinc-400 text-[11px] flex items-center gap-1">
                <Terminal className="w-3 h-3" /> francis.config.js
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">STUDENT</span>
            </div>

            <div className="p-4 space-y-1.5 text-zinc-300 bg-zinc-900 text-[11px]">
              <div><span className="text-purple-400">const</span> <span className="text-yellow-300">studentProfile</span> = &#123;</div>
              <div className="pl-3">
                <span className="text-blue-400">name</span>: <span className="text-emerald-300">'{PROFILE_CONFIG.name}'</span>,
              </div>
              <div className="pl-3">
                <span className="text-blue-400">age</span>: <span className="text-amber-400">{PROFILE_CONFIG.age}</span>,
              </div>
              <div className="pl-3">
                <span className="text-blue-400">education</span>: <span className="text-emerald-300">'{PROFILE_CONFIG.education}'</span>,
              </div>
              <div className="pl-3">
                <span className="text-blue-400">coreSpecialties</span>: [
                <div className="pl-3 text-emerald-300">
                  {PROFILE_CONFIG.specialties.map((item) => (
                    <p key={item}>'{item}',</p>
                  ))}
                </div>
                ],
              </div>
              <div className="pl-3">
                <span className="text-blue-400">rates</span>: <span className="text-emerald-300">'{PROFILE_CONFIG.rates}'</span>
              </div>
              <div>&#125;;</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
