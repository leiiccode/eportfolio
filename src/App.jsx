import { useState } from 'react';
import logo from './assets/calling-card-logo.png';
import {
  Code,
  Bot,
  Globe,
  Palette,
  Wifi,
  HardDrive,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Send,
} from 'lucide-react';
import './App.css';

const SERVICES_DATA = [
  {
    id: 'web-dev',
    title: 'Web Development',
    description: 'Building custom responsive websites tailored to specific client project requirements.',
    badge: 'Specialty',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Code,
  },
  {
    id: 'ai-tools',
    title: 'AI Tools & Solutions',
    description: 'Integrating AI capabilities like automated chat responses and content workflows.',
    badge: 'Specialty',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Bot,
  },
  {
    id: 'fb-admin',
    title: 'FB Page Admin & PubMats',
    description: 'Designing promotional graphics, writing engaging captions, and managing FB business pages.',
    badge: 'Social Media',
    badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    icon: Globe,
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design & Decks',
    description: 'Creating posters, social media banners, and presentation decks for school or work.',
    badge: 'Creative',
    badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    icon: Palette,
  },
  {
    id: 'nfc-cards',
    title: 'Smart NFC Cards',
    description: 'Programming and configuring tap-to-share digital contact business cards.',
    badge: 'Hardware',
    badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    icon: Wifi,
  },
  {
    id: 'file-recovery',
    title: 'Deleted File Recovery',
    description: 'Recovering missing files or photos (subject to drive condition and damage severity).',
    badge: 'Data',
    badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    icon: HardDrive,
  },
  {
    id: 'tech-support',
    title: 'PC OS Fixes & Basic Printer Setup',
    description: 'Solving laptop/PC software issues, Microsoft apps setup, and basic printer driver installation (software configuration only, no internal hardware repairs).',
    badge: 'Tech Support',
    badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    icon: Headphones,
    fullWidth: true,
  },
];

const MAX_NAME_LENGTH = 80;
const MAX_CONTACT_LENGTH = 255;
const MAX_DETAILS_LENGTH = 1500;

const stripHtml = (value = '') => {
  const withoutTags = value.replace(/<[^>]*>/g, '');
  let cleaned = '';

  for (const char of withoutTags) {
    const code = char.charCodeAt(0);
    if ((code >= 0 && code <= 31) || code === 127) {
      continue;
    }
    cleaned += char;
  }

  return cleaned.trim();
};

const sanitizeField = (value = '', maxLength = 255) => {
  const cleaned = stripHtml(String(value));
  return cleaned.slice(0, maxLength);
};

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isFacebookUrl = (value) => {
  const normalized = value.trim().toLowerCase();
  return /^(https?:\/\/)?(www\.)?facebook\.com\//i.test(normalized) || /^@?[a-z0-9._-]{2,50}$/i.test(normalized);
};

const validateContact = (value) => {
  const normalized = sanitizeField(value, MAX_CONTACT_LENGTH);
  if (!normalized) {
    return 'Contact information is required.';
  }

  if (isEmail(normalized) || isFacebookUrl(normalized)) {
    return '';
  }

  return 'Use a valid email or Facebook profile link.';
};

const validateForm = (formData) => {
  const name = sanitizeField(formData.name, MAX_NAME_LENGTH);
  if (!name || name.length < 2) {
    return { error: 'Please enter your name.' };
  }

  if (!/^[\p{L}\p{N} .,'’-]{2,80}$/u.test(name)) {
    return { error: 'Your name contains unsupported characters.' };
  }

  const contactError = validateContact(formData.contact);
  if (contactError) {
    return { error: contactError };
  }

  const details = sanitizeField(formData.details, MAX_DETAILS_LENGTH);
  if (!details || details.length < 10) {
    return { error: 'Please provide a few more details about your project.' };
  }

  if (/(?:<\s*script|javascript:|on\w+\s*=)/i.test(details)) {
    return { error: 'Your message contains invalid content.' };
  }

  return {
    name,
    contact: sanitizeField(formData.contact, MAX_CONTACT_LENGTH),
    details,
  };
};

const PROFILE_CONFIG = {
  name: 'Francis Pascua',
  age: 21,
  education: 'Computer Engineering',
  specialties: [
    'Web Development',
    'AI Tools Integration',
    'FB Page Admin & PubMats',
    'Smart NFC Cards',
    'Deleted File Recovery (Conditional)',
    'Basic Printer & OS Software Fixes',
  ],
  rates: 'Affordable & Student-Friendly',
};

export default function App() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({ name: '', contact: '', details: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationResult = validateForm(formData);
    if (validationResult.error) {
      setFormError(validationResult.error);
      setFormSubmitted(false);
      return;
    }

    setIsSending(true);
    setFormError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: validationResult.name,
          contact: validationResult.contact,
          details: validationResult.details,
        }),
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const result = isJson ? await response.json() : null;

      if (response.status === 404 && !result) {
        setFormError('Hindi makita ang contact service. Tiyaking kasama sa Vercel deployment ang API endpoint.');
        return;
      }

      if (!response.ok) {
        setFormSubmitted(false);
        setFormError(result?.error || 'Hindi naipadala ang inquiry. Pakisubukan muli mamaya.');
        return;
      }

      setFormSubmitted(true);
      setFormData({ name: '', contact: '', details: '' });
      setTimeout(() => setFormSubmitted(false), 4000);
    } catch (error) {
      console.error('Inquiry send error:', error);
      setFormSubmitted(false);
      setFormError('Hindi maabot ang contact service. Tiyaking online ang Vercel deployment at subukan muli.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbfbfd] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <header className="sticky top-0 z-50 bg-[#fbfbfd]/90 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          <a href="#" className="flex items-center justify-start min-w-0 hover:opacity-80 transition">
            <img src={logo} alt="Francis Pascua logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          </a>

          <nav className="flex items-center justify-center gap-3 sm:gap-7 text-[10px] sm:text-sm font-medium text-zinc-600 whitespace-nowrap">
            <a href="#about" className="hover:text-zinc-950 transition">About</a>
            <a href="#services" className="hover:text-zinc-950 transition">Services</a>
            <a href="#contact" className="hover:text-zinc-950 transition">Contact</a>
          </nav>

          <a href="#contact" className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 transition shadow-sm">
            Hire Me
          </a>
        </div>
      </header>

      <main className="grow">
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

              <div className="pt-1 flex flex-wrap gap-2.5 sm:gap-3">
                <a href="#contact" className="flex-1 sm:flex-initial text-center px-5 py-2.5 rounded-lg bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 transition shadow-sm flex items-center justify-center gap-2">
                  Inquire Now <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a href="#services" className="flex-1 sm:flex-initial text-center px-5 py-2.5 rounded-lg bg-white border border-zinc-300 text-zinc-800 font-semibold text-xs hover:bg-zinc-50 transition shadow-sm">
                  View Services
                </a>
              </div>
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
                      {PROFILE_CONFIG.specialties.map((item, idx) => (
                        <p key={idx}>'{item}',</p>
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

        <section id="contact" className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-14 border-t border-zinc-200">
          <div className="space-y-4">
            <div className="text-left space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Inquire</span>
              <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Work With Me</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 bg-white p-4 sm:p-5 rounded-xl border border-zinc-200 shadow-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  maxLength={MAX_NAME_LENGTH}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-500 transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Email / Facebook Profile Link</label>
                <input
                  type="text"
                  required
                  maxLength={MAX_CONTACT_LENGTH}
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-500 transition"
                  placeholder="email@example.com or FB link"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Project Details / Service Request</label>
                <textarea
                  rows="3"
                  required
                  maxLength={MAX_DETAILS_LENGTH}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-500 transition resize-none"
                  placeholder="Describe what you need (e.g., Website, PubMats, FB Management, Tech Support)..."
                ></textarea>
              </div>

              <p className="text-[11px] leading-relaxed text-zinc-500">
                Privacy notice: Your name, contact details, and project information will be used to respond to your inquiry and sent to FormSubmit for email delivery. If duplicate detection is enabled, a hash of the inquiry is stored in Upstash Redis for 24 hours to identify identical repeat submissions. Please do not include sensitive personal information.
              </p>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-2.5 rounded-lg bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                {isSending ? 'Sending...' : 'Send Inquiry'}
              </button>

              {formError && (
                <div className="text-xs text-red-600 font-medium pt-1">{formError}</div>
              )}

              {formSubmitted && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-semibold pt-1">
                  <CheckCircle2 className="w-4 h-4" /> Thank you! Your inquiry has been received.
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-[#fbfbfd] py-6 px-4 text-center text-xs text-zinc-500 font-mono">
        <p>© 2026 Francis Pascua • Computer Engineering Student Portfolio</p>
      </footer>
    </div>
  );
}
