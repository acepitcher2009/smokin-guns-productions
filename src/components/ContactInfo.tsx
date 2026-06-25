import { businessInfo } from '../data/businessInfo';

// Brand-red NAP links on the cream content ground (CONVENTIONS.md §A: brand color
// as text/link, not a button). Visible focus ring for keyboard users (PRD §7).
const linkClass =
  'text-brand-red underline-offset-2 hover:underline ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2';

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      <h2
        id="contact-info-heading"
        className="font-display text-4xl uppercase tracking-wide text-ink"
      >
        Contact Us
      </h2>

      <p className="font-sans text-xl text-ink">{businessInfo.contactIntro}</p>

      <address className="flex flex-col gap-2 font-sans text-base not-italic text-ink">
        <span className="font-display text-3xl uppercase tracking-wide text-ink">
          {businessInfo.legalName}
        </span>
        {/* No single street address — events run at multiple venues, each shown
            on its own event card. Contact block is name + phone + email only. */}
        <a href={businessInfo.phoneHref} className={linkClass}>
          {businessInfo.phone}
        </a>
        <a href={`mailto:${businessInfo.email}`} className={linkClass}>
          {businessInfo.email}
        </a>
      </address>

      <div className="flex flex-col gap-1 font-sans text-base text-ink">
        <span>{businessInfo.hours.weekdays}</span>
        <span>{businessInfo.hours.weekend}</span>
        <span>{businessInfo.hours.holidays}</span>
      </div>
    </div>
  );
}
