import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { ConsentNotice } from './ConsentNotice';
import { CONSENT_KEY, hasConsent } from './consent';

describe('ConsentNotice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the owned privacy copy and a dismiss button when no consent is stored', () => {
    render(<ConsentNotice />);
    expect(screen.getByRole('region', { name: 'Privacy notice' })).toBeInTheDocument();
    expect(screen.getByText(/We use minimal cookies/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Got it' })).toBeInTheDocument();
  });

  it('hides the notice and persists dismissal in localStorage when dismissed', async () => {
    const user = userEvent.setup();
    render(<ConsentNotice />);

    await user.click(screen.getByRole('button', { name: 'Got it' }));

    expect(screen.queryByRole('region', { name: 'Privacy notice' })).not.toBeInTheDocument();
    expect(localStorage.getItem(CONSENT_KEY)).toBe('dismissed');
  });

  it('stays hidden on remount when localStorage is already set to dismissed', () => {
    localStorage.setItem(CONSENT_KEY, 'dismissed');
    render(<ConsentNotice />);
    expect(screen.queryByRole('region', { name: 'Privacy notice' })).not.toBeInTheDocument();
  });

  it('hasConsent reflects stored state', () => {
    expect(hasConsent()).toBe(false);
    localStorage.setItem(CONSENT_KEY, 'dismissed');
    expect(hasConsent()).toBe(true);
  });
});
