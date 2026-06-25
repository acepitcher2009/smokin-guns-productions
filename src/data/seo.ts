export type PageKey =
  | 'home'
  | 'events'
  | 'results'
  | 'about'
  | 'sponsors'
  | 'register'
  | 'contact';

export interface PageSeo {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage: string;
  canonicalPath: string;
}

// og:image must be a real brand image (NOT a wsimg.com blob, PRD §7). Placeholder until supplied.
const ogImage = '/og-default.jpg'; // TODO(owner-confirm): high-fidelity brand OG image (PRD §10 item 1)

export const seo: Record<PageKey, PageSeo> = {
  home: {
    title: "Smokin' Guns Productions — Barrel Racing & Pole Bending Events | Somerville, TX",
    description:
      "Join Smokin' Guns Productions for barrel racing and pole bending events at Snook Rodeo Arena in Somerville, TX. See the 2026 Snook Summer Buckle Series schedule and register today.",
    ogTitle: "WELCOME TO THE HOUSE OF SMOKIN' RUNS!",
    ogImage,
    canonicalPath: '/',
  },
  events: {
    title: '2026 Snook Summer Buckle Series — Barrel Racing Events | Somerville TX',
    description:
      'The full 2026 barrel racing and pole bending season — Snook Summer Buckle Series, Snook Jackpot, day shows, playdays and the Waller Co. Shootout. Exact times, classes and pricing.',
    ogImage,
    canonicalPath: '/events',
  },
  results: {
    title: "Series Points & Standings — Snook Summer Buckle Series | Smokin' Guns Productions",
    description:
      'Series points and standings for the Snook Summer Buckle Series, presented through the Rodeo Results App.',
    ogImage,
    canonicalPath: '/results',
  },
  about: {
    title: "About Smokin' Guns Productions — Barrel Racing & Pole Bending in the Brazos Valley",
    description:
      "Smokin' Guns Productions promotes barrel racing and pole bending events with good ground, great payout and a professional attitude across the Brazos Valley, Texas.",
    ogImage,
    canonicalPath: '/about',
  },
  sponsors: {
    title: "2026 Sponsors & Sponsorship — Smokin' Guns Productions | Somerville TX",
    description:
      "Meet the 2026 sponsors of Smokin' Guns Productions and explore our Platinum, Gold and Silver sponsorship opportunities.",
    ogImage,
    canonicalPath: '/sponsors',
  },
  register: {
    title: "Register for an Event — Barrel Racing & Pole Bending | Smokin' Guns Productions",
    description:
      "Enter an upcoming barrel racing or pole bending race with Smokin' Guns Productions at Snook Rodeo Arena, Somerville, TX. Pick your race and send your entry.",
    ogImage,
    canonicalPath: '/register',
  },
  contact: {
    title: "Contact — Snook Rodeo Arena, Somerville TX | Smokin' Guns Productions",
    description:
      "Get in touch with Smokin' Guns Productions about barrel racing and pole bending events at Snook Rodeo Arena in Somerville, TX.",
    ogImage,
    canonicalPath: '/contact',
  },
};
