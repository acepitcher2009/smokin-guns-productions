import { SectionBand } from './SectionBand';

import { seriesInfo } from '../data/events';

export function SeasonBuckleBanner() {
  return (
    <SectionBand tone="red">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="font-display text-5xl uppercase tracking-wide text-white">
          {seriesInfo.championBucklesLine}
        </h2>
        <ul className="flex flex-wrap justify-center gap-4 font-display text-xl uppercase tracking-wide text-white">
          {seriesInfo.buckleCategories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>
    </SectionBand>
  );
}
