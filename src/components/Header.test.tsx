import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Header } from './Header';
import { nav } from '../data/nav';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('renders a banner with a logo link to / and a Register link to /register', () => {
    renderAt('/');
    expect(screen.getByRole('banner')).toBeInTheDocument();

    const logoLink = screen.getByRole('link', { name: "Smokin' Guns Productions" });
    expect(logoLink).toHaveAttribute('href', '/');

    const register = screen.getByRole('link', { name: 'Register' });
    expect(register).toHaveAttribute('href', '/register');
  });

  it('renders all six nav labels from nav.ts in order', () => {
    renderAt('/');
    const primaryNav = screen.getAllByRole('navigation', { name: 'Primary' })[0];
    for (const item of nav) {
      expect(within(primaryNav).getByRole('link', { name: item.label })).toBeInTheDocument();
    }
    expect(nav).toHaveLength(6);
  });

  it('marks the active route NavLink with aria-current="page" and not others', () => {
    renderAt('/events');
    const primaryNav = screen.getAllByRole('navigation', { name: 'Primary' })[0];
    const eventsLink = within(primaryNav).getByRole('link', { name: 'Events' });
    const homeLink = within(primaryNav).getByRole('link', { name: 'Home' });
    expect(eventsLink).toHaveAttribute('aria-current', 'page');
    expect(homeLink).not.toHaveAttribute('aria-current');
    expect(eventsLink).toHaveClass('text-brand-red');
  });

  it('opens the drawer dialog from the hamburger and closes it from the close control', async () => {
    const user = userEvent.setup();
    renderAt('/');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const dialog = screen.getByRole('dialog', { name: 'Site navigation' });
    expect(dialog).toBeInTheDocument();
    // Drawer contains the nav links and a Register CTA routing to /register.
    const drawerNav = within(dialog).getByRole('navigation', { name: 'Primary' });
    expect(within(drawerNav).getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(within(drawerNav).getByRole('link', { name: 'Register' })).toHaveAttribute(
      'href',
      '/register'
    );

    // The drawer panel's X control closes it (there is also a backdrop close button).
    await user.click(within(drawerNav).getByRole('button', { name: 'Close menu' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
