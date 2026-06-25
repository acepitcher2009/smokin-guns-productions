import { SectionBand } from './SectionBand';

import { season } from '../data/events';
import type { BuckleSeriesDetail as SeriesDetailData } from '../data/events';

interface BuckleSeriesDetailProps {
  /** The buckle-series detail block; defaults to the first series event's seriesDetail. */
  detail?: SeriesDetailData;
}

/** Pull the shared series detail off the first Snook series event (single source). */
function defaultDetail(): SeriesDetailData | undefined {
  return season.find((event) => event.kind === 'series')?.seriesDetail;
}

export function BuckleSeriesDetail({ detail = defaultDetail() }: BuckleSeriesDetailProps) {
  if (!detail) return null;

  return (
    <SectionBand tone="cream" labelledBy="buckle-series-detail-heading">
      <div className="flex flex-col gap-8">
        <h2
          id="buckle-series-detail-heading"
          className="font-display text-4xl uppercase tracking-wide text-ink"
        >
          Snook Summer Buckle Series — Entry Details
        </h2>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-3xl uppercase tracking-wide text-ink">Schedule</h3>
          <ul className="flex flex-col gap-1 font-sans text-base text-ink">
            <li>{detail.schedule.books}</li>
            <li>{detail.schedule.exhibitions}</li>
            <li>{detail.schedule.race}</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-3xl uppercase tracking-wide text-ink">Pre-Entries</h3>
          <ul className="flex flex-col gap-1 font-sans text-base text-ink">
            <li>{detail.preEntries.window}</li>
            <li>{detail.preEntries.contact}</li>
            <li>{detail.preEntries.officeFee}</li>
            <li>{detail.preEntries.walkUps}</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-3xl uppercase tracking-wide text-ink">Nominations</h3>
          <p className="font-sans text-base text-ink">{detail.nominations}</p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-3xl uppercase tracking-wide text-ink">
            Classes &amp; Pricing
          </h3>
          <dl className="flex flex-col gap-1 font-sans text-base text-ink">
            {detail.classes.map((klass) => (
              <div key={klass.name} className="flex gap-2">
                <dt>{klass.name}</dt>
                <dd>
                  {klass.price === 'TBC' ? '— price TBC (confirm with owner)' : `— ${klass.price}`}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-3xl uppercase tracking-wide text-ink">Rules</h3>
          <ul className="flex flex-col gap-1 font-sans text-base text-ink">
            {detail.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <p className="font-sans text-sm text-ink">
          Series dates include May 23, 2026. June 20, 2026 is the series rain date (and the Snook
          Jackpot).
        </p>
      </div>
    </SectionBand>
  );
}
