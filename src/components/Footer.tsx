import { Link } from 'react-router-dom';

import { businessInfo } from '../data/businessInfo';
import { nav } from '../data/nav';

const linkClass =
  'font-sans text-base text-white underline-offset-2 hover:underline ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-brand-red text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        {/* NAP + hours */}
        <div>
          <h2 className="font-display text-3xl uppercase tracking-wide text-white">
            {businessInfo.legalName}
          </h2>
          <address className="mt-4 font-sans text-base not-italic text-white">
            {businessInfo.venueName}
            <br />
            {businessInfo.streetAddress}
            <br />
            {businessInfo.city}, {businessInfo.state} {businessInfo.zip}
            <br />
            <a href={businessInfo.phoneHref} className={linkClass}>
              {businessInfo.phone}
            </a>
            <br />
            <a href={`mailto:${businessInfo.email}`} className={linkClass}>
              {businessInfo.email}
            </a>
          </address>
          <p className="mt-4 font-sans text-sm text-white">
            {businessInfo.hours.weekdays}
            <br />
            {businessInfo.hours.weekend}
            <br />
            {businessInfo.hours.holidays}
          </p>
        </div>

        {/* Nav repeat — single source of truth (nav.ts), matching the Header */}
        <nav aria-label="Footer" className="flex flex-col gap-2">
          {nav.map((item) => (
            <Link key={item.path} to={item.path} className={linkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Owned policy + dynamic copyright */}
        <div className="flex flex-col gap-2">
          {/* TODO(owner-confirm): point to the owned privacy statement / re-open the
              ConsentNotice (PRD §10 item 14, story 10). Never a Google/GoDaddy
              boilerplate link (discard items 1, 3, 8). */}
          <Link to="/privacy" className={linkClass}>
            Privacy &amp; Consent
          </Link>
          <p className="mt-4 font-sans text-sm text-white">
            © {year} {businessInfo.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
