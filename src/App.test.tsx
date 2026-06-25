import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AppShell } from './App';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppShell />
    </MemoryRouter>
  );
}

describe('App router shell', () => {
  it('renders the Home page at /', () => {
    renderAt('/');
    expect(
      screen.getByRole('heading', { level: 1, name: 'RUN WHERE THE MONEY IS AT' })
    ).toBeInTheDocument();
  });

  it('renders the Events page at /events', () => {
    renderAt('/events');
    expect(screen.getByRole('heading', { level: 1, name: '2026 Season' })).toBeInTheDocument();
  });

  it('redirects an unknown route back to Home', () => {
    renderAt('/does-not-exist');
    expect(
      screen.getByRole('heading', { level: 1, name: 'RUN WHERE THE MONEY IS AT' })
    ).toBeInTheDocument();
  });

  it('keeps the header and main landmarks mounted across routes', () => {
    const { unmount } = renderAt('/');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    unmount();

    renderAt('/sponsors');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: '2026 Sponsors' })).toBeInTheDocument();
  });
});
