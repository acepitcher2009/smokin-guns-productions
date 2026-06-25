import { seriesInfo } from '../data/events';

/**
 * Events-page overview block: the "Upcoming Events" heading plus the A.M. Section
 * note. Both strings come from the single source (`seriesInfo` in events.ts) so
 * they can never diverge from the data — rendered as real, selectable text (not an
 * image). Heading is an <h2> so the Events page (story 22) keeps exactly one <h1>.
 */
export function AmSectionNote() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-4xl uppercase tracking-wide text-ink">
        {seriesInfo.upcomingHeading}
      </h2>
      <p className="font-sans text-xl text-ink">{seriesInfo.amSectionNote}</p>
    </div>
  );
}
