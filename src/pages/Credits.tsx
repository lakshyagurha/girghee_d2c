import { Link } from 'react-router-dom';
import { images, type Credit } from '../content/images';
import { usePageMeta } from '../lib/hooks';

export default function Credits() {
  usePageMeta('Image credits');
  // One row per source photo, with the pages that use it.
  const bySource = new Map<string, { credit: Credit; usedIn: string[] }>();
  for (const slot of Object.values(images)) {
    for (const c of slot.credits ?? []) {
      const row = bySource.get(c.sourceUrl) ?? { credit: c, usedIn: [] };
      row.usedIn.push(slot.id);
      bySource.set(c.sourceUrl, row);
    }
  }
  const rows = [...bySource.values()];
  return (
    <section className="container-x max-w-4xl py-12 lg:py-20">
      <h1 className="text-h2 font-normal">Image credits</h1>
      <p className="mt-5 text-ink-soft">
        This prototype uses openly licensed photographs from Wikimedia Commons as stand-ins until Ghee Culture’s own photography is ready.
        They are marked “Illustrative” on the site and do not show Ghee Culture products, packaging or operations.
        Images have been cropped, colour-adjusted and, for gift box contents, combined. Adaptations of CC BY-SA images are shared under the same licence.
      </p>
      <div className="relative mt-10 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <caption className="sr-only">Photo credits and licences</caption>
          <thead>
            <tr className="border-b border-line text-ink-soft">
              <th scope="col" className="py-3 pr-4 font-semibold">Subject</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Author</th>
              <th scope="col" className="py-3 pr-4 font-semibold">Licence</th>
              <th scope="col" className="py-3 font-semibold">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ credit }) => (
              <tr key={credit.sourceUrl} className="border-b border-line align-top">
                <th scope="row" className="py-3 pr-4 font-medium">{credit.subject}</th>
                <td className="py-3 pr-4">{credit.author}</td>
                <td className="py-3 pr-4"><a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="link font-normal">{credit.license}</a></td>
                <td className="py-3"><a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="link font-normal">Wikimedia Commons<span className="sr-only"> (opens in a new tab)</span></a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-8 text-sm text-ink-soft">Back to <Link to="/" className="link">the homepage</Link>.</p>
    </section>
  );
}
