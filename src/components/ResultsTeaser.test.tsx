import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { ResultsTeaser } from './ResultsTeaser';
import { results } from '../data/results';

function renderResultsTeaser() {
  return render(
    <MemoryRouter>
      <ResultsTeaser />
    </MemoryRouter>
  );
}

describe('ResultsTeaser', () => {
  it('renders the section heading as an <h2>', () => {
    renderResultsTeaser();
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(/series points & standings/i);
  });

  it('links internally to /results with the descriptive branded label', () => {
    renderResultsTeaser();
    const link = screen.getByRole('link', { name: results.label });
    expect(link).toHaveAttribute('href', '/results');
  });

  it('never exposes a tinyurl (or bare short URL) anywhere in the rendered output', () => {
    const { container } = renderResultsTeaser();
    expect(container.textContent ?? '').not.toContain('tinyurl');
    expect(container.innerHTML).not.toContain('tinyurl');
  });
});
