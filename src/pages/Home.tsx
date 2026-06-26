import { BusinessJsonLd } from '../components/BusinessJsonLd';
import { Hero } from '../components/Hero';
import { NextEventCard } from '../components/NextEventCard';
import { SectionBand } from '../components/SectionBand';
import { Seo } from '../components/Seo';

// Home page composition (build-order 17). Assembles the head/meta + business
// schema, the Hero (which owns the page's single <h1> and the labelled mission
// statement), then the Next Event block on a cream band. The mission and series
// points/standings each have their own dedicated home (the Hero and the /results
// page), so they are not duplicated here. See CONVENTIONS.md §A/§D/§E.
export function Home() {
  return (
    <>
      <Seo pageKey="home" />
      <BusinessJsonLd />

      <Hero />

      <SectionBand tone="cream">
        <NextEventCard />
      </SectionBand>
    </>
  );
}
