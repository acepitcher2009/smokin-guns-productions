import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SectionBand } from './SectionBand';

describe('SectionBand', () => {
  it('renders tone="red" as a <section> with bg-brand-red and text-white', () => {
    const { container } = render(<SectionBand tone="red">Red band</SectionBand>);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('bg-brand-red');
    expect(section).toHaveClass('text-white');
  });

  it('renders tone="cream" with bg-cream and text-ink (ink on cream meets AA)', () => {
    const { container } = render(<SectionBand tone="cream">Cream band</SectionBand>);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-cream');
    expect(section).toHaveClass('text-ink');
  });

  it('renders tone="teal" with bg-teal and text-ink (ink on teal meets AA)', () => {
    const { container } = render(<SectionBand tone="teal">Teal band</SectionBand>);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-teal');
    expect(section).toHaveClass('text-ink');
  });

  it('renders its children inside the band', () => {
    render(<SectionBand tone="cream">Sponsor program</SectionBand>);
    expect(screen.getByText('Sponsor program')).toBeInTheDocument();
  });

  it('renders a <footer> element when as="footer"', () => {
    const { container } = render(
      <SectionBand tone="red" as="footer">
        Footer band
      </SectionBand>
    );
    expect(container.querySelector('footer')).toBeInTheDocument();
    expect(container.querySelector('section')).not.toBeInTheDocument();
  });

  it('passes labelledBy through to aria-labelledby', () => {
    const { container } = render(
      <SectionBand tone="teal" labelledBy="sponsors-heading">
        <h2 id="sponsors-heading">Sponsors</h2>
      </SectionBand>
    );
    expect(container.querySelector('section')).toHaveAttribute('aria-labelledby', 'sponsors-heading');
  });
});
