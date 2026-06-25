import { Link } from 'react-router-dom';

import { businessInfo } from '../data/businessInfo';

/**
 * Home mission excerpt. Derives the first sentence of the mission from the
 * single source (`businessInfo.missionVerbatim`) so it can never diverge from
 * the full text About (story 24) renders. Verbatim — no silent "a upbeat" fix.
 */
function missionExcerpt(mission: string): string {
  const firstSentenceEnd = mission.indexOf('. ');
  return firstSentenceEnd === -1 ? mission : mission.slice(0, firstSentenceEnd + 1);
}

export function MissionSnippet() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-4xl uppercase tracking-wide text-ink">Our Mission</h2>
      <p className="font-sans text-xl text-ink">{missionExcerpt(businessInfo.missionVerbatim)}</p>
      <Link to="/about" className="font-sans text-base text-brand-red underline">
        Read more
      </Link>
    </div>
  );
}
