import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders as a <button> by default with brand-red styling', () => {
    render(<Button>Register</Button>);
    const button = screen.getByRole('button', { name: 'Register' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-brand-red');
  });

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Enter a Race</Button>);

    await user.click(screen.getByRole('button', { name: 'Enter a Race' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a router Link with the correct href when as="link"', () => {
    render(
      <MemoryRouter>
        <Button as="link" to="/contact">
          Contact
        </Button>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: 'Contact' });
    expect(link).toHaveAttribute('href', '/contact');
  });

  it('renders an anchor with the given href when as="a"', () => {
    render(
      <Button as="a" href="tel:8328572826">
        Call
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Call' });
    expect(link).toHaveAttribute('href', 'tel:8328572826');
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Register
      </Button>
    );

    await user.click(screen.getByRole('button', { name: 'Register' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
