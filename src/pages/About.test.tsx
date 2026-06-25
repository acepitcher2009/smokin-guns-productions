import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { About } from './About';

// Light-tier smoke test: the About composition renders exactly one <h1>
// (the business-name lockup) inside the router + helmet harness.
function renderAbout() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <About />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('About page', () => {
  it('renders exactly one <h1> and it is the name lockup', () => {
    renderAbout();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Smokin' Guns Productions LLC");
  });
});
