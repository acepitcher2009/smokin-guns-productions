import type { Sponsor } from '../data/sponsors';

interface SponsorCardProps {
  sponsor: Sponsor;
}

export function SponsorCard({ sponsor }: SponsorCardProps) {
  const name = (
    <h3 className="font-display text-3xl uppercase tracking-wide text-ink">{sponsor.name}</h3>
  );

  const logo = sponsor.logo ? (
    <img
      src={sponsor.logo}
      alt={`${sponsor.name} logo`}
      width={160}
      height={80}
      loading="lazy"
      className="h-auto w-40 object-contain"
    />
  ) : (
    // Owner-pending logo asset (PRD §10 item 2) — marked text placeholder, never image-only content.
    <span
      aria-hidden="true"
      className="flex h-20 w-40 items-center justify-center rounded-sm bg-cream-deep font-sans text-sm text-ink"
    >
      Logo to come
    </span>
  );

  return (
    <article className="flex flex-col gap-2 rounded-md bg-white p-6 shadow-card">
      {sponsor.url ? (
        <a href={sponsor.url} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name}>
          {logo}
        </a>
      ) : (
        logo
      )}

      {sponsor.url ? (
        <a href={sponsor.url} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      ) : (
        name
      )}

      {sponsor.tagline ? (
        <p className="font-sans text-base text-ink">{sponsor.tagline}</p>
      ) : null}
      {sponsor.location ? (
        <p className="font-sans text-sm text-ink">{sponsor.location}</p>
      ) : null}
      {sponsor.phone ? (
        <a
          href={`tel:${sponsor.phone.replace(/[^0-9]/g, '')}`}
          className="font-sans text-base text-brand-red"
        >
          {sponsor.phone}
        </a>
      ) : null}
      {sponsor.url ? (
        <a
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm text-brand-red"
        >
          {sponsor.url.replace(/^https?:\/\//, '')}
        </a>
      ) : null}
    </article>
  );
}
