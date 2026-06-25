import { BusinessJsonLd } from '../components/BusinessJsonLd';
import { Hero } from '../components/Hero';
import { MissionSnippet } from '../components/MissionSnippet';
import { NextEventCard } from '../components/NextEventCard';
import { ResultsTeaser } from '../components/ResultsTeaser';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';

// Home page composition (build-order 17). Assembles the head/meta + business
// schema, the full-bleed Hero (which owns the page's single <h1>), then the
// three content blocks on cream bands with consistent vertical rhythm. Every
// section heading below the Hero is an <h2>, and the only CTA color across the
// page is brand-red (Hero + NextEventCard Register buttons) — mission/results
// are text links, never buttons. See CONVENTIONS.md §A/§D/§E.
export function Home() {
  return (
    <>
      <Seo pageKey="home" />
      <BusinessJsonLd />

      <Hero />

      <SectionBand tone="cream">
        <NextEventCard />
      </SectionBand>

      <SectionBand tone="cream">
        <div className="grid gap-12 md:grid-cols-2">
          <MissionSnippet />
          <ResultsTeaser />
        </div>
      </SectionBand>
    </>
  );
}
