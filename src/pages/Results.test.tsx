import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Results } from './Results';

// Light-tier smoke test: the Results page renders exactly one <h1> and never
// surfaces tinyurl/the opaque destination as visible text (PRD §4.3).
function renderResults() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <Results />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('Results page', () => {
  it('renders exactly one <h1> with the standings title', () => {
    renderResults();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('Series Points & Standings');
  });

  it('does not show tinyurl anywhere in the rendered page', () => {
    const { container } = renderResults();
    expect(container.textContent ?? '').not.toContain('tinyurl');
  });
});
