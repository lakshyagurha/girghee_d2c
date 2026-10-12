import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '../App';
import { CartProvider } from '../lib/cart';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<CartProvider><RouterProvider router={router} /></CartProvider>);
  return router;
}

beforeEach(() => {
  localStorage.clear();
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  Element.prototype.scrollIntoView = vi.fn();
});

describe('Journey A: home → size → quantity → cart → edit → checkout', () => {
  it('works end to end', async () => {
    const user = userEvent.setup();
    const router = renderAt('/');

    // Choose the 1 litre jar from "Choose your jar"
    await user.click(screen.getByRole('link', { name: /details for the 1 litre jar/i }));
    expect(router.state.location.pathname).toBe('/shop/gheeji-a2-ghee');
    expect(router.state.location.search).toBe('?size=1l');
    expect(screen.getByRole('radio', { name: /1 litre/i })).toBeChecked();

    // Switch to 500 ml: price updates
    await user.click(screen.getByRole('radio', { name: /500 ml/i }));
    expect(router.state.location.search).toBe('?size=500ml');
    expect(screen.getByRole('button', { name: /add to cart · ₹1,299/i })).toBeInTheDocument();

    // Quantity 2 → total updates
    await user.click(screen.getAllByRole('button', { name: /increase quantity/i })[0]);
    const addBtn = screen.getByRole('button', { name: /add to cart · ₹2,598/i });
    await user.click(addBtn);

    // Drawer opens with correct line
    const drawer = screen.getByRole('dialog', { name: /your cart/i });
    expect(within(drawer).getByText(/500 ml · ₹1,299 each/)).toBeInTheDocument();
    expect(within(drawer).getAllByText('₹2,598').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /cart, 2 items/i })).toBeInTheDocument();

    // Edit: increase to 3, subtotal follows
    await user.click(within(drawer).getByRole('button', { name: /increase quantity/i }));
    expect(within(drawer).getAllByText('₹3,897').length).toBe(2); // line total + subtotal

    // Persisted without prices
    const stored = JSON.parse(localStorage.getItem('gheeji.cart.v1')!);
    expect(stored).toEqual([{ kind: 'ghee', variantId: '500ml', qty: 3 }]);

    // Escape closes and returns focus to the add button
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: /your cart/i })).not.toBeInTheDocument();
    expect(addBtn).toHaveFocus();

    // Reopen, go to checkout (Razorpay test mode)
    await user.click(screen.getByRole('button', { name: /cart, 3 items/i }));
    await user.click(screen.getByRole('button', { name: /^checkout$/i }));
    expect(router.state.location.pathname).toBe('/checkout');
    expect(screen.getByText(/razorpay test mode/i, { selector: 'p.font-semibold' })).toBeInTheDocument();

    // Paying with empty delivery details shows errors and never calls the server
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await user.click(screen.getByRole('button', { name: /^pay /i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/please check 7 fields/i);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();

    // Remove → empty state
    await user.click(screen.getByRole('button', { name: /remove gheeji a2 ghee 500 ml/i }));
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});

describe('Journey B: corporate → brief → prefilled form → validate → demo outcome', () => {
  it('prefills from a box chosen on a gift page', async () => {
    const user = userEvent.setup();
    const router = renderAt('/gifts/appreciation-box');
    await user.click(screen.getByRole('link', { name: /request a bulk quote/i }));
    expect(router.state.location.pathname).toBe('/corporate-gifting');
    expect(screen.getByLabelText(/preferred box/i)).toHaveValue('appreciation');
  });

  it('carries brief choices into the form, validates, and shows demo-only result', async () => {
    const user = userEvent.setup();
    renderAt('/corporate-gifting');

    await user.click(screen.getByRole('button', { name: /start a brief with the gheeji signature gift box/i }));
    const builder = screen.getByRole('group', { name: /^occasion$/i });
    await user.click(within(builder).getByRole('radio', { name: /client thank-yous/i }));
    await user.click(within(screen.getByRole('group', { name: /approximate quantity/i })).getByRole('radio', { name: '51–100' }));
    await user.click(within(screen.getByRole('group', { name: /^budget per box$/i })).getByRole('radio', { name: '₹2,500 – ₹3,500' }));
    expect(screen.getByText(/within this budget/i)).toHaveTextContent(/Signature Gift Box/);

    await user.click(screen.getByRole('button', { name: /continue to quote form/i }));
    expect(screen.getByLabelText(/full name/i)).toHaveFocus();
    expect(screen.getByLabelText(/approximate quantity/i)).toHaveValue('51–100');
    expect(screen.getByLabelText(/^budget per box/i)).toHaveValue('₹2,500 – ₹3,500');
    expect(screen.getByLabelText(/preferred box/i)).toHaveValue('signature');
    expect(screen.getByLabelText(/^occasion/i)).toHaveValue('client-thank-you');

    // Submit incomplete → accessible errors
    await user.type(screen.getByLabelText(/work email/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /^request a quote$/i }));
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/please check 4 fields/i);
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/work email/i)).toHaveAccessibleDescription(/name@company.com/);

    // Fix and submit
    await user.type(screen.getByLabelText(/full name/i), 'Priya Sharma');
    await user.type(screen.getByLabelText(/^company/i), 'Example Pvt Ltd');
    await user.clear(screen.getByLabelText(/work email/i));
    await user.type(screen.getByLabelText(/work email/i), 'priya@example.com');
    await user.click(screen.getByRole('checkbox', { name: /may use these details/i }));
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await user.click(screen.getByRole('button', { name: /^request a quote$/i }));

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent(/demo only: your request has not been sent/i);
    expect(status).toHaveTextContent('Example Pvt Ltd');
    expect(status).toHaveTextContent(/Signature Gift Box/);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(localStorage.length).toBe(0);
  });
});

describe('navigation', () => {
  it('renders every route with an h1', () => {
    for (const p of ['/', '/shop', '/shop/gheeji-a2-ghee', '/gifts', '/gifts/signature-gift-box', '/corporate-gifting', '/learn', '/about', '/contact', '/checkout', '/policies/privacy', '/nope', '/gifts/nope', '/shop/nope']) {
      const { unmount } = (() => { const r = createMemoryRouter(routes, { initialEntries: [p] }); return render(<CartProvider><RouterProvider router={r} /></CartProvider>); })();
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
      unmount();
    }
  });
});
