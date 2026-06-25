import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Hero } from './Hero';

function renderHero() {
  return render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  );
}

describe('Hero', () => {
  it('renders the EXACT headline as the page <h1>', () => {
    renderHero();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/^RUN WHERE THE MONEY IS AT$/i);
    // Exactly one h1 on the page (one-h1 rule).
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('renders the EXACT tagline and the framing line', () => {
    renderHero();
    expect(screen.getByText("WELCOME TO THE HOUSE OF SMOKIN' RUNS!")).toBeInTheDocument();
    expect(screen.getByText('Experience Thrilling Speed Events')).toBeInTheDocument();
  });

  it('does not repeat the Register CTA (it lives in the sticky Header)', () => {
    renderHero();
    expect(screen.queryByRole('link', { name: 'Register' })).not.toBeInTheDocument();
  });

  it('hero image has descriptive alt and explicit numeric width + height (no CLS)', () => {
    renderHero();
    const img = screen.getByRole('img', {
      name: 'Barrel racer rounding a barrel at full speed in the arena',
    });
    expect(img.getAttribute('alt')).not.toBe('');
    expect(img).toHaveAttribute('width');
    expect(img).toHaveAttribute('height');
    expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
    expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
  });

  it('renders a literal apostrophe in the tagline, never an HTML entity', () => {
    const { container } = renderHero();
    expect(container.innerHTML).toContain("SMOKIN' RUNS!");
    expect(container.innerHTML).not.toContain('&#39;');
    expect(container.innerHTML).not.toContain('&amp;');
  });
});
