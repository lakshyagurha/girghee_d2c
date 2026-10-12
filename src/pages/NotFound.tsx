import { Link } from 'react-router-dom';
import { usePageMeta } from '../lib/hooks';

export default function NotFound() {
  usePageMeta('Page not found');
  return (
    <section className="container-x py-24">
      <h1 className="text-h2 font-normal">We could not find that page.</h1>
      <p className="mt-4 text-ink-soft">It may have moved, or the link may be mistyped.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">Go to the homepage</Link>
        <Link to="/shop" className="btn-secondary">Shop A2 Ghee</Link>
      </div>
    </section>
  );
}
