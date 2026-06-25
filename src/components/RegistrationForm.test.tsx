import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RegistrationForm } from './RegistrationForm';

/**
 * Light smoke test. @emailjs/browser is fully mocked so submission never hits
 * the network and no real VITE_EMAILJS_* keys are required. Covers: only
 * upcoming events are offered, the class/age-group field is populated from the
 * selected event, required-email validation gates the submit, a valid submit
 * calls emailjs.sendForm and surfaces success, the honeypot silently aborts, the
 * ?event= query pre-selects, and the honeypot field is present + hidden.
 *
 * A fixed pre-season `now` is injected so the WHOLE season is "upcoming" and the
 * option assertions are deterministic regardless of the real test-run date.
 */
vi.mock('@emailjs/browser', () => ({
  default: {
    sendForm: vi.fn(() => Promise.resolve({ status: 200, text: 'OK' })),
  },
}));

const sendForm = vi.mocked(emailjs.sendForm);
const PRE_SEASON = new Date('2026-01-01T12:00:00-06:00');

function renderForm(initialEntry = '/register') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <RegistrationForm now={PRE_SEASON} />
    </MemoryRouter>
  );
}

describe('RegistrationForm', () => {
  beforeEach(() => {
    sendForm.mockClear();
    sendForm.mockResolvedValue({ status: 200, text: 'OK' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('lists upcoming event options sourced from the season data (e.g. SNOOK JACKPOT)', () => {
    renderForm();
    expect(screen.getByRole('option', { name: /SNOOK JACKPOT/i })).toBeInTheDocument();
  });

  it('shows class/age-group controls populated from the selected event', async () => {
    const user = userEvent.setup();
    renderForm();

    // No class/age-group controls until an event is chosen.
    expect(screen.queryByRole('checkbox', { name: /5D Open/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Age group')).not.toBeInTheDocument();

    // A buckle-series event offers CLASSES ONLY, as multi-select checkboxes
    // (e.g. 5D Open — $50). No age-group selector for a series.
    await user.selectOptions(screen.getByLabelText(/which race/i), 'snook-series-2026-05-30');
    expect(screen.getByRole('checkbox', { name: /5D Open/i })).toBeInTheDocument();
    expect(screen.queryByLabelText('Age group')).not.toBeInTheDocument();

    // A playday offers BOTH a single-select Age group AND class checkboxes;
    // the series-only class is gone.
    await user.selectOptions(screen.getByLabelText(/which race/i), 'magnolia-playday-2026-06-27');
    const ageGroup = screen.getByLabelText('Age group');
    expect(ageGroup).toBeInTheDocument();
    expect(within(ageGroup).getByRole('option', { name: /Pee Wee/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Poles/i })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: /5D Open/i })).not.toBeInTheDocument();
  });

  it('allows selecting multiple classes (classes are multi-select)', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.selectOptions(screen.getByLabelText(/which race/i), 'magnolia-playday-2026-06-27');
    const poles = screen.getByRole('checkbox', { name: /Poles/i });
    const barrels = screen.getByRole('checkbox', { name: /Barrels/i });

    await user.click(poles);
    await user.click(barrels);

    expect(poles).toBeChecked();
    expect(barrels).toBeChecked();
  });

  it('requires at least one class when the selected event has classes', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.selectOptions(screen.getByLabelText(/which race/i), 'snook-series-2026-05-30');
    await user.type(screen.getByLabelText(/email/i), 'rider@example.com');
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByText(/select at least one class/i)).toBeInTheDocument();
    expect(sendForm).not.toHaveBeenCalled();

    // Choosing a class clears the gate and lets the entry submit.
    await user.click(screen.getByRole('checkbox', { name: /5D Open/i }));
    await user.click(screen.getByRole('button', { name: /register/i }));
    expect(sendForm).toHaveBeenCalledTimes(1);
  });

  it('blocks submit and shows an inline error when the email is empty/invalid', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    expect(sendForm).not.toHaveBeenCalled();

    // The error is associated with the field via aria-describedby.
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('submits via emailjs.sendForm and shows success on a valid entry', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/email/i), 'rider@example.com');
    await user.type(screen.getByLabelText(/^name$/i), 'Jane Rider');
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(sendForm).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/your entry has been sent/i)).toBeInTheDocument();
  });

  it('silently aborts (no emailjs call) when the honeypot is filled', async () => {
    const user = userEvent.setup();
    const { container } = renderForm();

    await user.type(screen.getByLabelText(/email/i), 'bot@example.com');
    // Bots fill the hidden field; type into it directly (it is not user-reachable).
    const honeypot = container.querySelector('input[name="company"]') as HTMLInputElement;
    await user.type(honeypot, 'spammy corp');

    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(sendForm).not.toHaveBeenCalled();
  });

  it('pre-selects the event from the ?event=<id> query param', () => {
    renderForm('/register?event=snook-jackpot-2026-06-20');
    const select = screen.getByLabelText(/which race/i) as HTMLSelectElement;
    expect(select.value).toBe('snook-jackpot-2026-06-20');
  });

  it('renders the honeypot field present and hidden from users/AT', () => {
    const { container } = renderForm();
    const honeypot = container.querySelector('input[name="company"]') as HTMLInputElement;

    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveAttribute('tabindex', '-1');
    expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    expect(honeypot).toHaveClass('hidden'); // display:none — visually hidden
    // Not exposed to assistive tech / accessibility tree.
    expect(screen.queryByLabelText(/company/i)).not.toBeInTheDocument();
  });
});
