import {useLocation, useRouteLoaderData} from 'react-router';
import {CartProvider} from '~/components/cart/CartProvider';
import {CartDrawer} from '~/components/cart/CartDrawer';
import {Header} from '~/components/layout/Header';
import {Footer} from '~/components/layout/Footer';
import {SearchOverlay} from '~/components/search/SearchOverlay';
import {NavProvider, useNav} from '~/components/layout/NavContext';
import {useUIStore, uiStore} from '~/state/store';

// Home + every Shopify-menu collection page open with a full-bleed hero: header sits transparent on top of it.
function Shell({children}) {
  const {pathname} = useLocation();
  const nav = useNav();
  const {searchOpen: search} = useUIStore();
  const overHero = pathname === '/' || nav.byPath[pathname.replace(/\/+$/, '')]?.kind === 'collection';
  if (pathname.startsWith('/studio')) return children; // Sanity Studio is full-screen
  return (
    <CartProvider>
      <a className="absolute [left:-999px] [&:focus]:[left:1rem] [&:focus]:[top:1rem] [&:focus]:[z-index:100] [&:focus]:[background:#fff] [&:focus]:[padding:.5rem_1rem] [&:focus]:[border-radius:var(--radius-sm)]" href="#main">Skip to content</a>
      <Header overHero={overHero} />
      <main id="main" className={overHero ? '' : '[padding-top:var(--hdr-h)]'}>{children}</main>
      <Footer />
      <SearchOverlay open={search} onClose={uiStore.closeSearch} />
      <CartDrawer />
    </CartProvider>
  );
}

export function SiteLayout({children}) {
  const root = useRouteLoaderData('root');
  return <NavProvider nav={root?.nav}><Shell>{children}</Shell></NavProvider>;
}
