import { ResultsPanel } from '../components/ResultsPanel';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';

export function Results() {
  return (
    <>
      <Seo pageKey="results" />
      <SectionBand tone="cream">
        <div className="flex flex-col gap-8">
          <h1 className="font-display text-5xl uppercase tracking-wide text-ink">
            Series Points &amp; Standings
          </h1>
          <ResultsPanel />
        </div>
      </SectionBand>
    </>
  );
}
