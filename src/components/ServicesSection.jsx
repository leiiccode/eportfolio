import { SERVICES_DATA } from '../data/portfolio.js';

export default function ServicesSection() {
  return (
    <section id="services" className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 border-t border-zinc-200">
      <div className="text-left space-y-1 mb-6 sm:mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Capabilities</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Services &amp; Specialties</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {SERVICES_DATA.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className={`p-4 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition flex flex-col justify-between ${
                service.fullWidth ? 'sm:col-span-2 lg:col-span-3' : ''
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Icon className="w-5 h-5 text-zinc-900" />
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${service.badgeColor}`}>
                    {service.badge}
                  </span>
                </div>
                <h3 className="font-bold text-zinc-900 text-sm">{service.title}</h3>
                <p className="text-xs text-zinc-600 leading-normal">{service.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
