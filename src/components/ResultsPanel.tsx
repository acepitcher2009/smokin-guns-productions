import { Button } from './Button';

import { results } from '../data/results';

// Branded Series Points / standings panel (CONVENTIONS.md §A/§E, PRD §4.3).
// Reads `results` from results.ts. When mode === 'embed' (and an embedUrl is
// set) it renders a lazy, titled standings iframe inside an aspect-ratio
// wrapper (NEVER an arbitrary h-[…px] value — token discipline). Otherwise it
// renders the single brand-red outbound CTA (the Button primitive) whose
// VISIBLE text is the descriptive results.label — the opaque destinationUrl /
// tinyurl is never surfaced as link text. `text-pink` is an accent only.
export function ResultsPanel() {
  const isEmbed = results.mode === 'embed' && Boolean(results.embedUrl);

  return (
    <div className="flex flex-col gap-6">
      <p className="font-sans text-xl text-ink">
        Follow the <span className="font-display uppercase tracking-wide text-pink">Series Points</span>{' '}
        standings for the Snook Summer Buckle Series and chase the buckles.
      </p>

      {isEmbed ? (
        <div className="aspect-[4/3] w-full overflow-hidden rounded-md shadow-card">
          <iframe
            src={results.embedUrl}
            title={results.label}
            loading="lazy"
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <Button as="a" href={results.destinationUrl} target="_blank" rel="noopener noreferrer">
          {results.label}
        </Button>
      )}
    </div>
  );
}
