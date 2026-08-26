import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

/**
 * The only button and link primitive in the product.
 *
 * Renders a real <button>, <a> or <Link> — never a div with a click handler,
 * so keyboard, voice control and browser agents all work without special
 * cases. Every size clears the 44px touch-target floor.
 *
 * Focus rings come from the global :focus-visible rule in index.css. Nothing
 * here sets `outline: none`.
 */

const BASE =
  'inline-flex items-center justify-center gap-3 font-sans font-semibold text-center ' +
  'rounded-control transition-colors duration-quick ease-out ' +
  'disabled:cursor-not-allowed';

const VARIANTS = {
  primary:
    'bg-indigo text-on-indigo border border-indigo hover:bg-indigo-600 hover:border-indigo-600 ' +
    'disabled:bg-paper-3 disabled:text-ink-faint disabled:border-rule-strong',
  secondary:
    'bg-transparent text-indigo border border-indigo hover:bg-indigo-50 ' +
    'disabled:text-ink-faint disabled:border-rule-strong',
  quiet:
    'bg-transparent text-indigo border border-transparent underline underline-offset-4 ' +
    'decoration-1 hover:decoration-2 hover:bg-indigo-50 disabled:text-ink-faint disabled:no-underline',
  danger:
    'bg-transparent text-danger border border-danger hover:bg-danger-bg ' +
    'disabled:text-ink-faint disabled:border-rule-strong',
};

const SIZES = {
  md: 'min-h-touch px-6 py-3 text-body',
  lg: 'min-h-[3.25rem] px-8 py-4 text-subhead w-full sm:w-auto',
  compact: 'min-h-touch px-4 py-2 text-meta',
};

const Button = forwardRef(function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  disabled = false,
  className = '',
  ...rest
}, ref) {
  const cls = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (to && !disabled) {
    return <Link ref={ref} to={to} className={cls} {...rest}>{children}</Link>;
  }
  if (href && !disabled) {
    return <a ref={ref} href={href} className={cls} {...rest}>{children}</a>;
  }
  return (
    <button ref={ref} type={type} className={cls} disabled={disabled} {...rest}>
      {children}
    </button>
  );
});

export default Button;

/**
 * A link that leaves the prototype. Always says so — visually and to a screen
 * reader — because the whole point of the official handoff is that the person
 * knows they are arriving somewhere real.
 */
export function ExternalLink({ href, children, className = '', ...rest }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-baseline gap-2 text-indigo underline underline-offset-4 decoration-1 hover:decoration-2 ${className}`}
      {...rest}
    >
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
      <span className="sr-only">(opens the official site in a new tab)</span>
    </a>
  );
}
