import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ghee, getVariant } from '../content/products';
import { getGiftById, giftBoxes } from '../content/gifts';
import type { ImageId } from '../content/images';

export const MAX_QTY = 20;
const STORAGE_KEY = 'gheeji.cart.v1';

/** Only product references and quantities are stored — never prices or personal data. */
export type CartLine =
  | { kind: 'ghee'; variantId: string; qty: number }
  | { kind: 'gift'; giftId: string; qty: number };

export interface ResolvedLine {
  key: string;
  line: CartLine;
  title: string;
  detail: string;
  unitPaise: number;
  totalPaise: number;
  image: ImageId;
  href: string;
}

export const lineKey = (l: CartLine) => (l.kind === 'ghee' ? `ghee:${l.variantId}` : `gift:${l.giftId}`);

const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(n)));

/** Resolve a line against the live catalogue. Unknown products return null and are dropped. */
export function resolveLine(line: CartLine): ResolvedLine | null {
  if (line.kind === 'ghee') {
    const v = getVariant(line.variantId);
    if (!v || !v.available) return null;
    return {
      key: lineKey(line), line, title: ghee.name, detail: v.label,
      unitPaise: v.pricePaise, totalPaise: v.pricePaise * line.qty,
      image: v.image, href: `/shop/${ghee.slug}?size=${v.id}`,
    };
  }
  const g = getGiftById(line.giftId);
  if (!g || g.pricePaise == null) return null;
  return {
    key: lineKey(line), line, title: g.name, detail: `${g.contents.reduce((n, i) => n + i.quantity, 0)} items`,
    unitPaise: g.pricePaise, totalPaise: g.pricePaise * line.qty,
    image: g.images.closed, href: `/gifts/${g.slug}`,
  };
}

/** Parse untrusted storage data. Anything malformed is discarded. */
export function parseStoredCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const out = new Map<string, CartLine>();
    for (const item of data) {
      if (!item || typeof item !== 'object') continue;
      const r = item as Record<string, unknown>;
      const qty = typeof r.qty === 'number' && Number.isFinite(r.qty) ? clampQty(r.qty) : null;
      if (!qty) continue;
      let line: CartLine | null = null;
      if (r.kind === 'ghee' && typeof r.variantId === 'string' && getVariant(r.variantId)) {
        line = { kind: 'ghee', variantId: r.variantId, qty };
      } else if (r.kind === 'gift' && typeof r.giftId === 'string' && giftBoxes.some((g) => g.id === r.giftId)) {
        line = { kind: 'gift', giftId: r.giftId, qty };
      }
      if (line) out.set(lineKey(line), line);
    }
    return [...out.values()];
  } catch {
    return [];
  }
}

function readStorage(): CartLine[] {
  try {
    return parseStoredCart(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

interface CartContextValue {
  lines: ResolvedLine[];
  count: number;
  subtotalPaise: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: CartLine) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  /** Short message for the polite live region after cart changes. */
  announcement: string;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>(readStorage);
  const [isOpen, setIsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw)); } catch { /* storage unavailable — cart still works in memory */ }
  }, [raw]);

  // Keep tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === STORAGE_KEY) setRaw(parseStoredCart(e.newValue)); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const lines = useMemo(() => raw.map(resolveLine).filter((l): l is ResolvedLine => l !== null), [raw]);

  const add = useCallback((line: CartLine) => {
    setRaw((prev) => {
      const key = lineKey(line);
      const existing = prev.find((l) => lineKey(l) === key);
      if (existing) return prev.map((l) => (lineKey(l) === key ? { ...l, qty: clampQty(l.qty + line.qty) } : l));
      return [...prev, { ...line, qty: clampQty(line.qty) }];
    });
    const r = resolveLine(line);
    if (r) setAnnouncement(`Added ${line.qty} × ${r.title}${line.kind === 'ghee' ? `, ${r.detail}` : ''} to cart.`);
    setIsOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setRaw((prev) => prev.map((l) => (lineKey(l) === key ? { ...l, qty: clampQty(qty) } : l)));
  }, []);

  const remove = useCallback((key: string) => {
    setRaw((prev) => {
      const target = prev.find((l) => lineKey(l) === key);
      const r = target && resolveLine(target);
      if (r) setAnnouncement(`Removed ${r.title}${target!.kind === 'ghee' ? `, ${r.detail}` : ''} from cart.`);
      return prev.filter((l) => lineKey(l) !== key);
    });
  }, []);

  const value: CartContextValue = {
    lines,
    count: lines.reduce((n, l) => n + l.line.qty, 0),
    subtotalPaise: lines.reduce((n, l) => n + l.totalPaise, 0),
    isOpen,
    open: useCallback(() => setIsOpen(true), []),
    close: useCallback(() => setIsOpen(false), []),
    add, setQty, remove,
    clear: useCallback(() => setRaw([]), []),
    announcement,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
