import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { ResultsPanel } from './ResultsPanel';
import { results } from '../data/results';

// Light-tier smoke test (PRD §4.3 no-tinyurl guarantee): in the default `link`
// mode the panel renders the single brand-red outbound CTA whose VISIBLE text
// is the descriptive results.label, never the opaque destinationUrl/tinyurl,
// and the accent "Series Points" uses text-pink (an accent, not a button).
function renderPanel() {
  return render(
    <MemoryRouter>
      <ResultsPanel />
    </MemoryRouter>
  );
}

describe('ResultsPanel', () => {
  it('renders the outbound CTA with the descriptive label as its visible text', () => {
    renderPanel();
    const link = screen.getByRole('link', { name: results.label });
    expect(link).toHaveTextContent('View Series Points & Standings');
  });

  it('never exposes tinyurl (or any bare short URL) as visible text', () => {
    const { container } = renderPanel();
    expect(container.textContent ?? '').not.toContain('tinyurl');
    // The opaque destination is also never surfaced as visible copy.
    expect(container.textContent ?? '').not.toContain(results.destinationUrl);
  });

  it('opens the outbound link safely in a new tab', () => {
    renderPanel();
    const link = screen.getByRole('link', { name: results.label });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel') ?? '').toContain('noopener');
  });

  it('uses pink as an accent on "Series Points", never as a button', () => {
    renderPanel();
    const accent = screen.getByText('Series Points');
    expect(accent.tagName).toBe('SPAN');
    expect(accent.className).toContain('text-pink');
    // The only actionable control is the brand-red CTA — no pink button exists.
    const link = screen.getByRole('link', { name: results.label });
    expect(link.className).not.toContain('pink');
    expect(link.className).toContain('bg-brand-red');
  });
});
