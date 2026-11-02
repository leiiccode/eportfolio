import {
  Bot,
  Code,
  Globe,
  HardDrive,
  Headphones,
  Palette,
  Wifi,
} from 'lucide-react';

export const PROFILE_CONFIG = {
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

export const SERVICES_DATA = [
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
