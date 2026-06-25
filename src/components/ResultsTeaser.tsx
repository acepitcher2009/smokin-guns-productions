import { Link } from 'react-router-dom';

import { results } from '../data/results';

/**
 * Home results teaser. Points to the INTERNAL /results page using descriptive
 * branded text (the `results.label`) — never the opaque tinyurl source. The
 * actual outbound link/embed lives only on the Results page (story 23); this
 * component must never render `results.destinationUrl`. `pink` is an accent
 * highlight here, never a button (CONVENTIONS.md §A — single CTA stays the Hero).
 */
export function ResultsTeaser() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
        Series Points &amp; Standings
      </h2>
      <p className="font-sans text-xl text-ink">
        Track the chase for the <span className="text-pink">22 Champion Buckles</span> all season
        long.
      </p>
      <Link to="/results" className="font-sans text-base text-brand-red underline">
        {results.label}
      </Link>
    </div>
  );
}
