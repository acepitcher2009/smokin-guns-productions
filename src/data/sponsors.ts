export interface Sponsor {
  name: string;
  tagline?: string;
  phone?: string;
  location?: string;
  url?: string;
  logo?: string; // TODO(owner-confirm): high-fidelity logo asset + display permission (PRD §10 item 2)
}

export const sponsors: Sponsor[] = [
  {
    name: 'Teal Services LLC',
    tagline: 'Water and Wastewater Construction / General Contractor',
    phone: '281-467-4407',
    url: 'https://Tealtexas.com',
  },
  {
    name: 'Hay Girl Sales & Deliveries',
    tagline: 'Coastal Squares – Rolls – Alfalfa',
    phone: '281-686-8488',
    location: 'Waller, TX',
  },
  { name: 'Rustic Building Systems', phone: '713-906-4070' },
  { name: "Charlotte's Saddlery", tagline: 'Everything for Riding Except the Horse' },
  { name: 'Lavished Photography' },
  { name: '360 Equine' },
  { name: 'MC Mechanical of Texas LLC' },
  { name: 'The Jaeggi Team', tagline: 'Get Listed. Get Sold.' },
];
