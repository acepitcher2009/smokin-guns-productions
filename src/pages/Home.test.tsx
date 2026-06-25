import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Home } from './Home';
import { seo } from '../data/seo';

// Light-tier smoke test: the Home composition renders the Hero <h1> plus the
// mission / next-event / results sections, sets the home page title via Seo,
// and keeps exactly one <h1> on the page. System time is mocked so the
// NextEventCard selection is deterministic.
function renderHome() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('Home page', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-01T12:00:00-05:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders exactly one <h1> and it is the Hero headline', () => {
    renderHome();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('RUN WHERE THE MONEY IS AT');
  });

  it('renders the mission excerpt and a "Read more" link to /about', () => {
    renderHome();
    expect(screen.getByText(/^At Smokin' Guns Productions/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Read more' })).toHaveAttribute('href', '/about');
  });

  it('renders the next-event section with a Register link to /register', () => {
    renderHome();
    expect(screen.getByRole('heading', { level: 2, name: 'Next Event' })).toBeInTheDocument();
    const register = screen.getAllByRole('link', { name: 'Register' });
    expect(register.length).toBeGreaterThan(0);
    // The next-event card's Register routes to the event-scoped registration URL.
    expect(register[0].getAttribute('href')).toMatch(/^\/register/);
  });

  it('renders the results teaser linking to /results and never the tinyurl source', () => {
    const { container } = renderHome();
    const resultsLink = screen
      .getAllByRole('link')
      .find((link) => link.getAttribute('href') === '/results');
    expect(resultsLink).toBeDefined();
    expect(container.textContent).not.toContain('tinyurl');
  });
});

// Seo flushes the document title asynchronously via react-helmet-async, which
// relies on real timers — so this assertion runs outside the fake-timer block.
describe('Home page — head/meta', () => {
  it('sets the home page title via Seo', async () => {
    renderHome();
    await waitFor(() => expect(document.title).toBe(seo.home.title));
  });
});
