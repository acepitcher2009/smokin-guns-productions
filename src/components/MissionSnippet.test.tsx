import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { MissionSnippet } from './MissionSnippet';
import { businessInfo } from '../data/businessInfo';

function renderMissionSnippet() {
  return render(
    <MemoryRouter>
      <MissionSnippet />
    </MemoryRouter>
  );
}

describe('MissionSnippet', () => {
  it('renders the section heading as an <h2>', () => {
    renderMissionSnippet();
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(/our mission/i);
  });

  it('renders an excerpt that is a prefix of the single-source missionVerbatim', () => {
    renderMissionSnippet();
    const excerpt = screen.getByText(/^At Smokin' Guns Productions/);
    const text = excerpt.textContent ?? '';
    // Proves the excerpt derives from businessInfo, not a separate hand-written string.
    expect(businessInfo.missionVerbatim.startsWith(text)).toBe(true);
    // It is an excerpt, not the full mission.
    expect(text.length).toBeLessThan(businessInfo.missionVerbatim.length);
  });

  it('renders a descriptive "Read more" link pointing to /about', () => {
    renderMissionSnippet();
    const link = screen.getByRole('link', { name: 'Read more' });
    expect(link).toHaveAttribute('href', '/about');
  });

  it('renders a literal apostrophe in the excerpt, never an HTML entity', () => {
    const { container } = renderMissionSnippet();
    expect(container.innerHTML).toContain("Smokin' Guns Productions");
    expect(container.innerHTML).not.toContain('&#39;');
    expect(container.innerHTML).not.toContain('&amp;');
  });
});
