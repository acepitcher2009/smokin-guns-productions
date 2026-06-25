import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { Register } from './Register';

// Light-tier smoke test for the Register page: it renders the lone <h1>, the
// registration form's event <select>, sets the register page <title> via Seo,
// and pre-selects the event from ?event=<id> (the EventCard "Register" CTA path).
// @emailjs/browser is mocked so RegistrationForm never touches the network and
// no real VITE_EMAILJS_* keys are required.
vi.mock('@emailjs/browser', () => ({
  default: {
    sendForm: vi.fn(() => Promise.resolve({ status: 200, text: 'OK' })),
  },
}));

// Pre-season date so the whole season (incl. the June Snook Jackpot) is upcoming
// and selectable, regardless of the real test-run date.
const PRE_SEASON = new Date('2026-01-01T12:00:00-06:00');

function renderRegister(initialEntry = '/register') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Register now={PRE_SEASON} />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('Register page', () => {
  it('renders exactly one <h1> ("Register for an Event")', () => {
    renderRegister();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('Register for an Event');
  });

  it('renders the registration form event <select>', () => {
    renderRegister();
    expect(screen.getByLabelText('Which race are you entering?')).toBeInTheDocument();
  });

  it('pre-selects the event from ?event=<id> (EventCard CTA integration)', () => {
    renderRegister('/register?event=snook-jackpot-2026-06-20');
    const select = screen.getByLabelText('Which race are you entering?') as HTMLSelectElement;
    expect(select.value).toBe('snook-jackpot-2026-06-20');
  });

  it('sets the register page <title> via Seo', async () => {
    renderRegister();
    await waitFor(() => {
      expect(document.title).toContain('Register');
    });
  });
});
