import { Link } from 'react-router-dom';
import { brand } from '../content/brand';

/**
 * The brand mark at a fixed size. Width and height are set explicitly so the
 * mark never squashes, crops or shifts the layout while it loads.
 * On dark backgrounds it sits on an ivory tile, since the maroon mark loses contrast on navy.
 */
export function LogoMark({ tone = 'dark', className = '' }: { tone?: 'dark' | 'light'; className?: string }) {
  const { src, srcSet, width, height } = brand.logo;
  const img = (
    <img
      src={src}
      srcSet={srcSet}
      width={width}
      height={height}
      alt=""
      decoding="async"
      // 56×36 on small phones so the longer wordmark and the cart fit at 360px; full size from 400px.
      className="block h-9 w-14 shrink-0 object-contain min-[400px]:h-11 min-[400px]:w-[69px]"
    />
  );
  if (tone === 'light') {
    return <span className={`inline-flex shrink-0 rounded-soft bg-ivory p-1.5 ${className}`}>{img}</span>;
  }
  return <span className={`inline-flex shrink-0 ${className}`}>{img}</span>;
}

/** Mark + wordmark lockup, without a link (e.g. inside the mobile menu). */
export function LogoLockup({ tone = 'dark', withDescriptor = true }: { tone?: 'dark' | 'light'; withDescriptor?: boolean }) {
  const color = tone === 'dark' ? 'text-navy' : 'text-ivory';
  return (
    <span className={`inline-flex items-center gap-2 min-[400px]:gap-3 ${color}`}>
      <LogoMark tone={tone} />
      <span className="flex flex-col justify-center whitespace-nowrap">
        <span className="font-serif text-[1.2rem] font-medium min-[400px]:text-[1.3rem] sm:text-[1.625rem] leading-none tracking-[0.02em]">{brand.name}</span>
        {withDescriptor && (
          <span className={`mt-1.5 hidden text-[0.6rem] font-semibold uppercase leading-none tracking-[0.18em] sm:block ${tone === 'dark' ? 'text-ink-soft' : 'text-sand'}`}>
            {brand.descriptor}
          </span>
        )}
      </span>
    </span>
  );
}

export function Logo({ tone = 'dark', withDescriptor = true }: { tone?: 'dark' | 'light'; withDescriptor?: boolean }) {
  return (
    <Link to="/" className="inline-flex min-h-[44px] shrink-0 items-center" aria-label={`${brand.name}, home`}>
      <LogoLockup tone={tone} withDescriptor={withDescriptor} />
    </Link>
  );
}
