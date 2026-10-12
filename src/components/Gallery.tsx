import { useEffect, useRef, useState } from 'react';
import { images, type ImageId } from '../content/images';
import { useModal } from '../lib/hooks';
import { Img } from './Img';
import { Icon } from './ui';

interface Props {
  items: { id: ImageId; caption: string }[];
  /** Externally selected image (e.g. when the variant changes). */
  activeId?: ImageId;
  label: string;
  /** Aspect ratio of the main image and thumbnails. */
  ratio?: string;
}

export function Gallery({ items, activeId, label, ratio = '4 / 5' }: Props) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    if (!activeId) return;
    const i = items.findIndex((it) => it.id === activeId);
    if (i >= 0) setIndex(i);
  }, [activeId, items]);

  const current = items[index] ?? items[0];

  return (
    <section aria-label={label} className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="group relative block w-full overflow-hidden bg-paper"
          aria-label={`Enlarge image: ${current.caption}`}
        >
          <Img id={current.id} ratio={ratio} priority sizes="(min-width: 1024px) 50vw, 100vw" />
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-soft bg-paper/95 px-3 py-2 text-sm font-semibold text-navy shadow-sm">
            <Icon name="zoom" className="h-4 w-4" /> Enlarge
          </span>
        </button>
        <p className="mt-2 text-sm text-ink-soft">{current.caption}</p>
      </div>
      <ul className="flex gap-2 overflow-x-auto md:w-20 md:flex-col md:overflow-visible" aria-label="Choose image">
        {items.map((it, i) => (
          <li key={it.id + i} className="w-16 shrink-0 md:w-20">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1} of ${items.length}: ${it.caption}`}
              aria-current={i === index ? 'true' : undefined}
              className={`block w-full border-2 transition-colors ${i === index ? 'border-navy' : 'border-transparent hover:border-line'}`}
            >
              <Img id={it.id} ratio={ratio} compact />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox open={zoomOpen} onClose={() => setZoomOpen(false)} items={items} index={index} setIndex={setIndex} />
    </section>
  );
}

function Lightbox({ open, onClose, items, index, setIndex }: { open: boolean; onClose: () => void; items: Props['items']; index: number; setIndex: (n: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useModal(open, ref, onClose);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft') setIndex((index - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, index, items.length, setIndex]);
  if (!open) return null;
  const it = items[index];
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label={`Enlarged image: ${it.caption}`} className="fixed inset-0 z-[55] flex flex-col bg-ink/95 text-ivory">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm" aria-live="polite">{index + 1} / {items.length} · {it.caption}</p>
        <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center" aria-label="Close enlarged view" data-autofocus>
          <Icon name="close" className="h-6 w-6" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center gap-2 px-2 pb-6">
        <button type="button" onClick={() => setIndex((index - 1 + items.length) % items.length)} className="grid h-12 w-12 shrink-0 place-items-center rounded-full hover:bg-ivory/10" aria-label="Previous image">
          <Icon name="arrow-left" className="h-6 w-6" />
        </button>
        <div className="h-full max-h-[85vh] min-w-0 flex-1" style={{ maxWidth: `calc(85vh * ${images[it.id].width / images[it.id].height})` }}>
          <Img id={it.id} ratio={`${images[it.id].width} / ${images[it.id].height}`} />
        </div>
        <button type="button" onClick={() => setIndex((index + 1) % items.length)} className="grid h-12 w-12 shrink-0 place-items-center rounded-full hover:bg-ivory/10" aria-label="Next image">
          <Icon name="arrow-right" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
