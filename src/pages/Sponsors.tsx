import { Button } from '../components/Button';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';
import { SponsorTierCard } from '../components/SponsorTierCard';
import { SponsorWall } from '../components/SponsorWall';

import { sponsorTiers } from '../data/sponsorTiers';

// Sponsors page composition (build-order #27). Leads with the lone page <h1>
// ("2026 Sponsors"), then the "Join In" lead-in + three SponsorTierCards mapped
// from sponsorTiers on the teal program ground, then the SponsorWall on cream,
// closing with the single brand-red CTA (Button) → /contact.
//
// CONVENTIONS.md §A/§E: teal is the sponsor-program GROUND only (never a CTA);
// the only solid CTA on the page is the brand-red Button. §E text-on-teal rule
// is MANDATORY with no per-component exception — all text on the teal band uses
// `text-ink` (white-on-teal fails AA), so the "Join In" heading is `text-ink`,
// not the story example's `text-white`.
export function Sponsors() {
  return (
    <>
      <Seo pageKey="sponsors" />

      <SectionBand tone="cream">
        <h1 className="font-display text-5xl uppercase tracking-wide text-ink">2026 Sponsors</h1>
      </SectionBand>

      <SectionBand tone="teal">
        <div className="flex flex-col gap-8">
          <h2 className="font-display text-4xl uppercase tracking-wide text-ink">Join In</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {sponsorTiers.map((tier) => (
              <SponsorTierCard key={tier.name} tier={tier} />
            ))}
          </div>
          <Button as="link" to="/contact">
            Become a 2026 Sponsor
          </Button>
        </div>
      </SectionBand>

      <SectionBand tone="cream">
        <div className="flex flex-col gap-8">
          <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
            Our 2026 Sponsors
          </h2>
          <SponsorWall />
        </div>
      </SectionBand>
    </>
  );
}
