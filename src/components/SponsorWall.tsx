import { SponsorCard } from './SponsorCard';

import { sponsors } from '../data/sponsors';

export function SponsorWall() {
  return (
    <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
      {sponsors.map((sponsor) => (
        <li key={sponsor.name}>
          <SponsorCard sponsor={sponsor} />
        </li>
      ))}
    </ul>
  );
}
