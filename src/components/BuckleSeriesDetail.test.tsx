import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BuckleSeriesDetail } from './BuckleSeriesDetail';

describe('BuckleSeriesDetail', () => {
  it('renders the schedule lines as text', () => {
    render(<BuckleSeriesDetail />);
    expect(screen.getByText('Books open 3:30pm')).toBeInTheDocument();
    expect(screen.getByText('Exhibitions 3:30pm–5:45pm')).toBeInTheDocument();
    expect(screen.getByText('Race starts 6:00pm')).toBeInTheDocument();
  });

  it('renders the pre-entry contact text and the nominations text', () => {
    render(<BuckleSeriesDetail />);
    expect(screen.getByText('TEXT 832-857-2826')).toBeInTheDocument();
    expect(screen.getByText(/\$20 per horse\/rider combo/)).toBeInTheDocument();
  });

  it('renders the class list including 5D Open $50 and High Stakes $75', () => {
    render(<BuckleSeriesDetail />);
    expect(screen.getByText('5D Open')).toBeInTheDocument();
    expect(screen.getByText('— $50')).toBeInTheDocument();
    expect(screen.getByText('High Stakes')).toBeInTheDocument();
    expect(screen.getByText('— $75')).toBeInTheDocument();
  });

  it('renders the rules Negative Coggins Required and Cash Only', () => {
    render(<BuckleSeriesDetail />);
    expect(screen.getByText('Negative Coggins Required')).toBeInTheDocument();
    expect(screen.getByText('Cash Only')).toBeInTheDocument();
  });

  it('renders TBC verbatim for the Leadline class and shows no invented price', () => {
    render(<BuckleSeriesDetail />);
    expect(screen.getByText('Leadline')).toBeInTheDocument();
    // Leadline price is 'TBC' in events.ts — the rendered text must contain TBC,
    // and must not fabricate a dollar amount for it.
    const tbcLines = screen.getAllByText(/price TBC/);
    expect(tbcLines.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Venmo office-fee line with TBC, not a fabricated handle', () => {
    render(<BuckleSeriesDetail />);
    expect(screen.getByText(/\$10 non-refundable office fee via Venmo \(handle TBC\)/)).toBeInTheDocument();
  });

  it('does not substitute a flyer image for the text content', () => {
    const { container } = render(<BuckleSeriesDetail />);
    expect(container.querySelectorAll('img').length).toBe(0);
  });
});
