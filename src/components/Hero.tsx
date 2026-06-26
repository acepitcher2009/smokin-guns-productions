import { businessInfo } from '../data/businessInfo';

import hero960 from '../assets/hero-960.jpg';
import hero1440 from '../assets/hero-1440.jpg';
import hero1920 from '../assets/hero-1920.jpg';

// Home hero — a compact two-column band: brand headline beside the photo. The
// photo is shown WHOLE (w-full h-auto, never cropped); a shorter hero keeps the
// sections below visible above the fold. The cream ground is the brand's
// connective background; ink text meets WCAG AA (~13.7:1). The Register CTA
// lives in the sticky Header, so the hero doesn't repeat it.
// Image: "Barrel racing at the Methow Valley Rodeo" via Wikimedia Commons, CC0
// (public domain — no attribution required). Responsive 960/1440/1920w variants;
// explicit width/height keep CLS at 0. Owner may swap in their own photography
// later (PRD §10 item 1).
export function Hero() {
  return (
    <section className="w-full bg-cream">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 py-12 md:flex-row">
        <div className="flex flex-col items-start gap-6 md:w-1/2">
          <p className="font-display text-xl uppercase tracking-wide text-ink">
            Experience Thrilling Speed Events
          </p>
          <h1 className="font-display text-6xl uppercase tracking-wide text-ink">
            RUN WHERE THE MONEY IS AT
          </h1>
          <p className="font-display text-3xl uppercase tracking-wide text-ink">
            WELCOME TO THE HOUSE OF SMOKIN' RUNS!
          </p>
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl uppercase tracking-wide text-ink">Our Mission</h2>
            <p className="font-sans text-base text-ink">{businessInfo.missionVerbatim}</p>
          </div>
        </div>

        <img
          src={hero1920}
          srcSet={`${hero960} 960w, ${hero1440} 1440w, ${hero1920} 1920w`}
          sizes="(min-width: 768px) 50vw, 100vw"
          alt="Barrel racer rounding a barrel at full speed in the arena"
          width={1920}
          height={1280}
          loading="eager"
          fetchPriority="high"
          className="h-auto w-full rounded-lg md:w-1/2"
        />
      </div>
    </section>
  );
}
