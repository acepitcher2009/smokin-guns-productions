export interface NavItem {
  label: string;
  path: string;
}

export const nav: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/events' },
  { label: 'Results & Standings', path: '/results' },
  { label: 'About', path: '/about' },
  { label: 'Sponsors', path: '/sponsors' },
  { label: 'Contact / Location', path: '/contact' },
];
