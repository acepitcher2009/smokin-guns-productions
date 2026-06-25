import { CalendarPlus } from 'lucide-react';
import { createEvents } from 'ics';

import type { SeasonEvent } from '../data/events';
import { buildIcsAttributes } from './addToCalendarIcs';

interface AddToCalendarButtonProps {
  event: SeasonEvent;
}

/**
 * Tertiary "Add to calendar" control: generates + downloads a per-event .ics.
 *
 * Deliberately a plain text/icon <button> with neutral text-ink styling — NOT
 * the brand-red Button primitive and NOT any solid CTA — so the per-event
 * Register CTA stays the single brand-red primary action (single-CTA
 * discipline, PRD §2/§9). The lucide icon uses text-brand-red as an accent
 * tint only (no fill).
 */
export function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  function download() {
    const { error, value } = createEvents(buildIcsAttributes(event));
    if (error || !value) return;

    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      aria-label={`Add ${event.title} to calendar`}
      className="inline-flex min-h-[44px] items-center gap-2 font-sans text-sm text-ink underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark focus-visible:ring-offset-2"
    >
      <CalendarPlus aria-hidden="true" className="h-4 w-4 text-brand-red" />
      Add to calendar
    </button>
  );
}
