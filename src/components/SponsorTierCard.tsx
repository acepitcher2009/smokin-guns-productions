import type { SponsorTier } from '../data/sponsorTiers';

interface SponsorTierCardProps {
  tier: SponsorTier;
}

// One sponsorship tier on the teal program ground (CONVENTIONS.md §A: teal is a
// section/background color, never a CTA). Per CONVENTIONS.md §E (mandatory, no
// per-component exceptions), text on ANY teal ground uses `text-ink` — white text
// fails AA on teal/teal-deep, so the story example's `text-white` is overridden to
// `text-ink` (bg-teal-deep + text-ink = 5.42:1, passes AA). All names/prices/benefits
// come from the `tier` prop (sourced from sponsorTiers.ts); nothing is hardcoded, and
// the obscured Silver benefits render verbatim as their stored "confirm with owner"
// string — never invented (PRD §10 item 3).
export function SponsorTierCard({ tier }: SponsorTierCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-md bg-teal-deep p-6 text-ink shadow-card">
      <h3 className="font-display text-3xl uppercase tracking-wide text-ink">{tier.name}</h3>
      <p className="font-display text-4xl uppercase tracking-wide text-ink">{tier.price}</p>
      <ul className="flex flex-col gap-2 font-sans text-base text-ink">
        {tier.benefits.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
    </article>
  );
}
