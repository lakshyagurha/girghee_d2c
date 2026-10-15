import { useState } from 'react';
import { images, type ImageId } from '../content/images';

interface Props {
  id: ImageId;
  className?: string;
  /** CSS aspect ratio override, e.g. '4 / 5'. Defaults to the manifest's intrinsic ratio. */
  ratio?: string;
  priority?: boolean;
  /** Compact placeholder (thumbnails): hides the brief text. */
  compact?: boolean;
  sizes?: string;
}

/**
 * Renders an approved image, or a clearly labelled placeholder frame when no file
 * has been supplied (or the file fails to load). Dimensions are always reserved.
 */
export function Img({ id, className = '', ratio, priority, compact, sizes }: Props) {
  const slot = images[id];
  const [failed, setFailed] = useState(false);
  const aspect = ratio ?? `${slot.width} / ${slot.height}`;

  if (slot.src && !failed) {
    return (
      <div className={`relative overflow-hidden bg-line/40 ${className}`} style={{ aspectRatio: aspect }}>
        <img
          src={slot.src}
          alt={slot.alt}
          width={slot.width}
          height={slot.height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          {...{ fetchpriority: priority ? 'high' : 'auto' }} // lowercase: React 18 doesn't map fetchPriority
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {slot.illustrative && !compact && (
          <span className="absolute bottom-2 right-2 rounded-sm bg-paper/90 px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-soft sm:bottom-3 sm:right-3">
            Illustrative
          </span>
        )}
      </div>
    );
  }

  const label = failed ? 'Image unavailable' : slot.kind === 'concept' ? 'Concept placeholder' : 'Photo to be supplied';
  return (
    <div
      role="img"
      aria-label={`${label}: ${slot.alt}`}
      data-placeholder={slot.id}
      className={`linen relative flex w-full flex-col overflow-hidden ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <div className="pointer-events-none absolute inset-2 border border-gold/40 sm:inset-3" aria-hidden="true" />
      <div aria-hidden="true" className={`relative flex flex-1 flex-col items-center justify-center text-center ${compact ? 'p-1' : 'p-6 sm:p-8'}`}>
        <span className={`font-serif tracking-[0.1em] text-navy/25 ${compact ? 'text-sm' : 'text-2xl sm:text-3xl'}`}>Ghee Culture</span>
        {!compact && (
          <p className="mt-3 max-w-[30ch] text-[0.8rem] leading-snug text-ink-soft">{slot.brief}</p>
        )}
      </div>
      {!compact && (
        <span aria-hidden="true" className="relative m-3 self-start rounded-sm bg-paper/90 px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-soft sm:m-4">
          {label} · {slot.id}
        </span>
      )}
    </div>
  );
}
