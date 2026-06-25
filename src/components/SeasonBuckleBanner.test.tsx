import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SeasonBuckleBanner } from './SeasonBuckleBanner';

import { seriesInfo } from '../data/events';

describe('SeasonBuckleBanner', () => {
  it('renders the champion buckles line from seriesInfo as a heading', () => {
    render(<SeasonBuckleBanner />);
    const heading = screen.getByRole('heading', { name: seriesInfo.championBucklesLine });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('22 Champion Buckles');
  });

  it('renders all six buckle categories from seriesInfo as text', () => {
    render(<SeasonBuckleBanner />);
    for (const category of seriesInfo.buckleCategories) {
      expect(screen.getByText(category)).toBeInTheDocument();
    }
    expect(seriesInfo.buckleCategories).toEqual([
      'Open',
      'Youth',
      'Rookie',
      'PeeWee',
      'Senior',
      'Adult',
    ]);
  });

  it('uses white text on the SectionBand red ground (AA-safe pairing)', () => {
    const { container } = render(<SeasonBuckleBanner />);
    expect(container.querySelector('.bg-brand-red')).not.toBeNull();
    expect(container.querySelector('.text-white')).not.toBeNull();
  });
});
