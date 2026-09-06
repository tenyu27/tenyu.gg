import type { Link } from '../links';

type Props = {
  link: Link;
};

export function LinkButton({ link }: Props) {
  return (
    <a
      className="link"
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      /* Falls back to the site accent for any link without a brand colour. */
      style={{ '--link-accent': link.accent ?? 'var(--accent)' } as React.CSSProperties}
    >
      <span className="link__icon" aria-hidden="true">
        {link.icon ? <img src={link.icon} alt="" loading="lazy" /> : null}
      </span>
      <span className="link__label">{link.label}</span>
      <span className="link__chevron" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}
