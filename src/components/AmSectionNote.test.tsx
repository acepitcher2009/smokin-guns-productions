import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AmSectionNote } from './AmSectionNote';
import { seriesInfo } from '../data/events';

describe('AmSectionNote', () => {
  it('renders the "Upcoming Events" overview heading at level 2, from seriesInfo', () => {
    render(<AmSectionNote />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(seriesInfo.upcomingHeading);
    expect(heading).toHaveTextContent(/upcoming events/i);
  });

  it('renders the exact A.M. Section note as real text from seriesInfo', () => {
    render(<AmSectionNote />);
    expect(screen.getByText(seriesInfo.amSectionNote)).toBeInTheDocument();
    expect(screen.getByText(/A\.M\. Section Added/)).toBeInTheDocument();
  });
});
