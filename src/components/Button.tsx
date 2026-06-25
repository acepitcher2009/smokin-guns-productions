import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

// The single brand-red CTA primitive. Solid bg-brand-red, hover/focus
// bg-brand-red-dark, white text, rounded-md, ≥44px tap target, visible
// focus-visible ring. There is intentionally NO variant/tone/color prop:
// teal and pink are never buttons (CONVENTIONS.md §A/§E single-CTA rule).
const baseClasses =
  'inline-flex items-center justify-center rounded-md bg-brand-red px-6 py-3 text-base ' +
  'font-sans text-white transition-colors hover:bg-brand-red-dark ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-dark ' +
  'focus-visible:ring-offset-2 motion-reduce:transition-none ' +
  'disabled:opacity-60 disabled:pointer-events-none';

interface ButtonAsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button';
  children: ReactNode;
}

interface ButtonAsLinkProps {
  as: 'link';
  to: string;
  children: ReactNode;
}

interface ButtonAsAnchorProps {
  as: 'a';
  href: string;
  children: ReactNode;
  target?: string;
  rel?: string;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps | ButtonAsAnchorProps;

export function Button(props: ButtonProps) {
  if (props.as === 'link') {
    const { to, children } = props;
    return (
      <Link to={to} className={baseClasses}>
        {children}
      </Link>
    );
  }

  if (props.as === 'a') {
    const { href, children, target, rel } = props;
    return (
      <a href={href} target={target} rel={rel} className={baseClasses}>
        {children}
      </a>
    );
  }

  const { as: _as, children, type = 'button', ...rest } = props;
  return (
    <button type={type} className={baseClasses} {...rest}>
      {children}
    </button>
  );
}
