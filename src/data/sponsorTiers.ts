export interface SponsorTier {
  name: string;
  price: string;
  benefits: string[];
}

export const sponsorTiers: SponsorTier[] = [
  {
    name: 'Platinum',
    price: '$5,000',
    benefits: [
      '2–4 (4×6) banners displayed at each event',
      'Logo / business on banner & wraps',
      'Social-media recognition',
      'Announcer / press recognition at each event',
      'Logo / business name on show flyers',
      '1-year live-stream coverage',
      'No vendor fee',
    ],
  },
  {
    name: 'Gold',
    price: '$1,500',
    benefits: [
      '2–3 (4×6) banners at each event',
      'Logo / business on banner & wraps',
      'Social-media recognition',
      'Announcer recognition at each event',
      'Logo / business name on show flyer',
      '6-month live-stream coverage',
      'No vendor fee',
    ],
  },
  {
    name: 'Silver',
    price: '$1,000',
    benefits: [
      '1× 4×4 banner displayed at each event',
      'Logo / business on banner & wraps',
      'Social-media recognition',
      'Announcer recognition at each event',
      'Additional benefits — confirm with owner', // TODO(owner-confirm): full Silver benefit list (PRD §10 item 3)
    ],
  },
];
