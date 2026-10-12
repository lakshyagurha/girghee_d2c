import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CartProvider } from './lib/cart';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import GheeDetail from './pages/GheeDetail';
import Gifts from './pages/Gifts';
import GiftDetail from './pages/GiftDetail';
import Corporate from './pages/Corporate';
import Learn from './pages/Learn';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Policy from './pages/Policy';
import Credits from './pages/Credits';
import NotFound from './pages/NotFound';

export const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <Shop /> },
      { path: '/shop/:slug', element: <GheeDetail /> },
      { path: '/gifts', element: <Gifts /> },
      { path: '/gifts/:slug', element: <GiftDetail /> },
      { path: '/corporate-gifting', element: <Corporate /> },
      { path: '/learn', element: <Learn /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/policies/:slug', element: <Policy /> },
      { path: '/image-credits', element: <Credits /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const routerFuture = {
  v7_relativeSplatPath: true, v7_fetcherPersist: true, v7_normalizeFormMethod: true,
  v7_partialHydration: true, v7_skipActionErrorRevalidation: true,
} as const;

const router = createBrowserRouter(routes, { future: routerFuture });

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </CartProvider>
  );
}
