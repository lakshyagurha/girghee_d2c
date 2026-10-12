import { useId, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Provenance } from '../content/products';
import { MAX_QTY } from '../lib/cart';

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function SectionHeading({ eyebrow, title, intro, id, align = 'left' }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; id?: string; align?: 'left' | 'center' }) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center [&_.eyebrow]:justify-center' : ''}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="mt-4 text-h2 font-normal">{title}</h2>
      {intro && <p className="mt-4 text-lg text-ink-soft">{intro}</p>}
    </div>
  );
}

/** Accessible disclosure / accordion item. */
export function Disclosure({ title, children, defaultOpen = false, headingLevel = 3 }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean; headingLevel?: 2 | 3 | 4 }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const H = `h${headingLevel}` as 'h3';
  return (
    <div className="border-b border-line">
      <H className="font-sans text-base font-semibold">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-[56px] w-full items-center justify-between gap-4 py-4 text-left text-ink hover:text-navy"
        >
          <span>{title}</span>
          <span aria-hidden="true" className={`relative h-4 w-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
            <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-navy" />
            <span className="absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-navy" />
          </span>
        </button>
      </H>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} hidden={!open} className="pb-6 pr-8 text-ink-soft">
        {children}
      </div>
    </div>
  );
}

export function QtyStepper({ value, onChange, label, size = 'md' }: { value: number; onChange: (n: number) => void; label: string; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 'h-11' : 'h-12';
  const btn = `${h} w-11 grid place-items-center text-lg text-navy hover:bg-sand/60 disabled:text-ink/30 disabled:hover:bg-transparent`;
  return (
    <div role="group" aria-label={label} className="inline-flex items-stretch rounded-soft border border-ink/25 bg-paper">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <span aria-hidden="true">−</span>
      </button>
      <output aria-live="polite" aria-label="Quantity" className={`${h} tabular grid w-10 place-items-center border-x border-ink/15 font-semibold`}>{value}</output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity">
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}

const provenanceLabel: Record<Provenance, string> = {
  approved: 'Approved',
  sample: 'Sample copy',
  general: 'General information',
  pending: 'Awaiting information',
};

export function ProvenanceTag({ status }: { status: Provenance }) {
  if (status === 'approved') return null;
  const tone = status === 'pending' ? 'border-ink/25 text-ink-soft' : 'border-gold/60 text-brass';
  return <span className={`inline-block rounded-sm border px-1.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] ${tone}`}>{provenanceLabel[status]}</span>;
}

export function DraftNote({ children }: { children: ReactNode }) {
  return (
    <p className="flex gap-2 text-sm text-ink-soft">
      <span aria-hidden="true" className="mt-[0.55rem] block h-px w-4 shrink-0 bg-gold" />
      <span>{children}</span>
    </p>
  );
}

export function ArrowLink({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={`link inline-flex min-h-[44px] items-center gap-2 ${className}`}>
      {children}
      <span aria-hidden="true" className="inline-block">→</span>
    </Link>
  );
}

export function Icon({ name, className = 'h-5 w-5' }: { name: 'bag' | 'menu' | 'close' | 'zoom' | 'check' | 'arrow-left' | 'arrow-right'; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths: Record<string, ReactNode> = {
    bag: <><path {...common} d="M5 8h14l-1 12H6L5 8Z" /><path {...common} d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    menu: <path {...common} d="M4 7h16M4 12h16M4 17h16" />,
    close: <path {...common} d="M6 6l12 12M18 6 6 18" />,
    zoom: <><circle {...common} cx="11" cy="11" r="6" /><path {...common} d="m20 20-4.5-4.5M11 8v6M8 11h6" /></>,
    check: <path {...common} d="m5 12 4.5 4.5L19 7" />,
    'arrow-left': <path {...common} d="M15 5 8 12l7 7" />,
    'arrow-right': <path {...common} d="m9 5 7 7-7 7" />,
  };
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">{paths[name]}</svg>;
}
