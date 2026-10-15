import { Link } from 'react-router-dom';
import { brand, contact, social } from '../content/brand';
import { policyPages } from '../content/navigation';
import { Logo } from './Logo';

const cols = [
  { title: 'Shop', links: [{ label: 'A2 Ghee', to: '/shop' }, { label: 'Gift Boxes', to: '/gifts' }] },
  { title: 'Learn', links: [{ label: 'About ghee', to: '/learn' }, { label: 'Reading a ghee label', to: '/learn#label' }, { label: 'About Ghee Culture', to: '/about' }] },
  { title: 'Corporate', links: [{ label: 'Corporate gifting', to: '/corporate-gifting' }, { label: 'Request a quote', to: '/corporate-gifting#quote' }] },
];

export function Footer() {
  const socials = social.filter((s) => s.href);
  const channels = [
    contact.email && { label: contact.email, href: `mailto:${contact.email}` },
    contact.phone && { label: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="on-dark bg-navy-dark text-ivory">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.2fr_2fr] lg:py-20">
        <div className="max-w-xs">
          <Logo tone="light" />
          <p className="mt-5 text-sm leading-relaxed text-ivory/80">A2 ghee for everyday meals, and gift boxes for the people you want to thank.</p>
          {channels.length > 0 && (
            <ul className="mt-6 space-y-2 text-sm">
              {channels.map((c) => <li key={c.href}><a className="link" href={c.href}>{c.label}</a></li>)}
            </ul>
          )}
          {contact.address && <p className="mt-4 whitespace-pre-line text-sm text-ivory/80">{contact.address}</p>}
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-4 text-sm">
              {socials.map((s) => <li key={s.label}><a className="link" href={s.href!} rel="noopener noreferrer" target="_blank">{s.label}</a></li>)}
            </ul>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-gold">{c.title}</h2>
              <ul className="mt-4 space-y-1">
                {c.links.map((l) => (
                  <li key={l.to}><Link to={l.to} className="inline-flex min-h-[40px] items-center text-sm text-ivory/90 hover:text-ivory hover:underline">{l.label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label="Help">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-gold">Help</h2>
            <ul className="mt-4 space-y-1">
              <li><Link to="/contact" className="inline-flex min-h-[40px] items-center text-sm text-ivory/90 hover:text-ivory hover:underline">Contact</Link></li>
              {policyPages.map((p) => (
                <li key={p.slug}>
                  <Link to={`/policies/${p.slug}`} className="inline-flex min-h-[40px] items-center text-sm text-ivory/90 hover:text-ivory hover:underline">
                    {p.label} <span className="ml-1.5 text-[0.7rem] uppercase tracking-wider text-sand">(draft)</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="border-t border-ivory/15">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-ivory/70 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <p className="flex flex-wrap gap-x-4">
            {brand.prototype && <span>Prototype website. Products, prices and policies are drafts for review.</span>}
            <Link to="/image-credits" className="underline underline-offset-2 hover:text-ivory">Image credits</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
