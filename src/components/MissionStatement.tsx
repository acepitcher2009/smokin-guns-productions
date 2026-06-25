import { businessInfo } from '../data/businessInfo';

/**
 * Verbatim mission for the About page. Reads the single source
 * (`businessInfo.missionVerbatim`) so it can never diverge from the Home
 * excerpt (`MissionSnippet`, story 15). The grammar fix "a upbeat" → "an upbeat"
 * is applied ONLY when the owner has approved it (`missionApproved === true`,
 * PRD §4.4); by default the text renders exactly as written, including "a upbeat".
 * Do not hand-type a corrected string.
 */
function missionText(): string {
  if (businessInfo.missionApproved) {
    return businessInfo.missionVerbatim.replace('a upbeat', 'an upbeat');
  }
  return businessInfo.missionVerbatim;
}

export function MissionStatement() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-5xl uppercase tracking-wide text-ink">
        {businessInfo.legalName}
      </h1>
      <p className="font-display text-3xl uppercase tracking-wide text-ink">
        Experience Thrilling Speed Events
      </p>
      <p className="font-sans text-xl text-ink">{missionText()}</p>
    </div>
  );
}
