import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MissionStatement } from './MissionStatement';
import { businessInfo } from '../data/businessInfo';

// Light-tier smoke test. The key About guarantee: while `missionApproved` is
// false (the shipped default) the mission renders VERBATIM — including the
// literal "a upbeat" — and is never silently corrected to "an upbeat".
describe('MissionStatement', () => {
  it('is shipped with missionApproved === false (verbatim path is the default)', () => {
    expect(businessInfo.missionApproved).toBe(false);
  });

  it('renders the mission verbatim, preserving the literal "a upbeat" wording', () => {
    const { container } = render(<MissionStatement />);
    expect(container.textContent).toContain('a upbeat professional attitude');
    // Proves it was NOT silently corrected to "an upbeat".
    expect(container.textContent).not.toContain('an upbeat professional attitude');
    // And it matches the single source exactly.
    expect(container.textContent).toContain(businessInfo.missionVerbatim);
  });

  it('renders the business-name lockup as the only <h1>', () => {
    render(<MissionStatement />);
    const h1s = screen.getAllByRole('heading', { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Smokin' Guns Productions LLC");
  });

  it('renders the "Experience Thrilling Speed Events" framing', () => {
    render(<MissionStatement />);
    expect(screen.getByText('Experience Thrilling Speed Events')).toBeInTheDocument();
  });

  it('adds no fabricated history or claims beyond the source content', () => {
    const { container } = render(<MissionStatement />);
    const text = container.textContent ?? '';
    // The only rendered text is: name lockup + framing + verbatim mission.
    const expected =
      businessInfo.legalName + 'Experience Thrilling Speed Events' + businessInfo.missionVerbatim;
    expect(text).toBe(expected);
  });

  it('renders a literal apostrophe, never an HTML entity', () => {
    const { container } = render(<MissionStatement />);
    expect(container.innerHTML).toContain("Smokin' Guns Productions");
    expect(container.innerHTML).not.toContain('&#39;');
    expect(container.innerHTML).not.toContain('&amp;');
  });
});
