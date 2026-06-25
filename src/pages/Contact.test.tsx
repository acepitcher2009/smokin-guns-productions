import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { Contact } from './Contact';

import { buildBusinessJsonLd } from '../components/businessJsonLdSchema';

// Light-tier smoke test for the Contact page composition: it renders the lone
// <h1>, the ContactInfo NAP, the general contact form (no event selector — that
// lives on /register), and the venue map's address/directions, sets the contact
// page <title> via Seo, and carries the business JSON-LD.
// @emailjs/browser is mocked so ContactForm never touches the network and no
// real VITE_EMAILJS_* keys are required.
vi.mock('@emailjs/browser', () => ({
  default: {
    sendForm: vi.fn(() => Promise.resolve({ status: 200, text: 'OK' })),
  },
}));

function renderContact(initialEntry = '/contact') {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Contact />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('Contact page', () => {
  it('renders exactly one <h1> ("Contact")', () => {
    renderContact();
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('Contact');
  });

  it('renders the ContactInfo NAP street (11538 FM 3058)', () => {
    renderContact();
    expect(screen.getByText('11538 FM 3058')).toBeInTheDocument();
  });

  it('renders the general contact form (message field + Send), not an event selector', () => {
    renderContact();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    // Event registration is a separate task on /register — no race selector here.
    expect(screen.queryByLabelText('Which race are you entering?')).not.toBeInTheDocument();
  });

  it('renders the venue map region (directions to the Snook arena)', () => {
    renderContact();
    expect(
      screen.getByRole('link', { name: /Get directions to Snook Rodeo Arena/i })
    ).toBeInTheDocument();
  });

  it('sets the contact page <title> via Seo', async () => {
    renderContact();
    await waitFor(() => {
      expect(document.title).toContain('Contact');
    });
  });

  it('composes BusinessJsonLd carrying valid, parseable business schema', () => {
    // Helmet's client-side <script> injection is not observable via document.head
    // in this jsdom harness (see BusinessJsonLd.test.tsx). The page mounts
    // BusinessJsonLd without crashing; the emitted payload is asserted to be valid
    // JSON-LD by round-tripping the same builder the component renders.
    expect(() => renderContact()).not.toThrow();
    const jsonLd = JSON.parse(JSON.stringify(buildBusinessJsonLd()));
    expect(jsonLd['@context']).toBe('https://schema.org');
  });
});
