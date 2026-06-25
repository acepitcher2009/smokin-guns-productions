import type { ReactNode } from 'react';

// Full-bleed section banding primitive (CONVENTIONS.md §A/§E, PRD §2).
// The brand uses exactly three section grounds — red, teal, cream — selected
// through a TYPED `tone` prop, never a free-form class. Each tone pairs the
// ground with its on-tone text color, and inner content is constrained to a
// centered max-width container with consistent vertical rhythm so banding
// cannot drift per section.
type SectionTone = 'red' | 'teal' | 'cream';

const toneClasses: Record<SectionTone, string> = {
  red: 'bg-brand-red text-white',
  teal: 'bg-teal text-ink',
  cream: 'bg-cream text-ink',
};

interface SectionBandProps {
  tone: SectionTone;
  children: ReactNode;
  /** Semantic element; defaults to section. */
  as?: 'section' | 'header' | 'footer';
  /** id of a heading inside, for aria-labelledby. */
  labelledBy?: string;
}

export function SectionBand({ tone, children, as: Tag = 'section', labelledBy }: SectionBandProps) {
  return (
    <Tag className={`w-full ${toneClasses[tone]}`} aria-labelledby={labelledBy}>
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">{children}</div>
    </Tag>
  );
}
