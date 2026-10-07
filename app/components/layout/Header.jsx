import {useCallback, useEffect, useState} from 'react';
import {Link, NavLink} from 'react-router';
import {useCart} from '~/components/cart/CartProvider';
import {useNav} from '~/components/layout/NavContext';
import {MegaNav} from '~/components/layout/MegaNav';
import {MobileMenu} from '~/components/layout/MobileMenu';
import {BagIcon, MenuIcon, SearchIcon} from '~/components/ui/Icons';
import {uiStore, useUIStore} from '~/state/store';

const FLOAT_AFTER = 80; // px scrolled before the bar detaches and floats

/**
 * Navbar.
 *  • at the top  → full-width bar (transparent over heroes, solid elsewhere): logo · CMS links · icons, shop mega nav below
 *  • compact (product pages) → starts directly in the floating pill state, no animation
 *  • after FLOAT_AFTER px → detaches into a floating rounded bar (not stuck to the edge): logo · shop mega nav · icons
 */
export function Header({overHero = false, compact = false}) {
  const {count, setOpen} = useCart();
  const {tree, pages} = useNav();
  const [scrolled, setScrolled] = useState(compact);
  const [floating, setFloating] = useState(compact);
  const {mobileMenuOpen: menu} = useUIStore();
  const closeMenu = useCallback(() => uiStore.closeMobileMenu(), []);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(compact || window.scrollY > 24);
      setFloating(compact || window.scrollY > FLOAT_AFTER);
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [compact]);

  const solid = !overHero || scrolled;
  const links = pages.filter((p) => p.placement !== 'footer');

  return (
    <>
      <header className={[['fixed [top:0] [left:0] [right:0] [color:#fff] [background:linear-gradient(to_bottom,rgba(10,26,16,.72),rgba(10,26,16,.28)_70%,transparent)] [transition:background_.35s_ease,box-shadow_.35s_ease,top_.35s_ease,left_.35s_ease,right_.35s_ease,border-radius_.35s_ease] [&_a]:[transition:color_.2s,background_.2s,border-color_.2s] [&_nav_a:hover]:[color:var(--green-200)] [&_nav_a[aria-current=page]]:[color:var(--green-200)] hdr', solid && '[background:color-mix(in_srgb,var(--green-900)_94%,transparent)]! [-webkit-backdrop-filter:blur(14px)] [backdrop-filter:blur(14px)] [box-shadow:0_6px_24px_rgba(10,26,16,.25)]', floating && '[top:.6rem]! [left:max(.6rem,calc(var(--gutter)_/_2))]! [right:max(.6rem,calc(var(--gutter)_/_2))]! [border-radius:var(--radius-lg)] [background:color-mix(in_srgb,var(--green-900)_88%,transparent)]! [box-shadow:0_14px_40px_rgba(10,26,16,.35),0_0_0_1px_rgba(255,255,255,.08)] hdr--float', floating && !compact && '[animation:hdr-float_.45s_cubic-bezier(.2,.8,.2,1)_both]'].filter(Boolean).join(' '), 'z-[70] font-[var(--font-body)]'].join(' ')}>
        <div className={`grid [grid-template-columns:1fr_auto_1fr] [grid-template-areas:'burger_logo_actions'] items-center [gap:.5rem_1.5rem] [padding:.8rem_var(--gutter)] [transition:padding_.35s_ease] [.hdr--float_&]:[padding:.55rem_1.1rem] min-[1100px]:[grid-template-columns:auto_1fr_auto] min-[1100px]:[grid-template-areas:'logo_content_actions'_'shop_shop_shop'] min-[1100px]:[.hdr--float_&]:[grid-template-areas:'logo_shop_actions']`}>
          <button type="button" className="[grid-area:burger] [justify-self:start] min-[1100px]:hidden relative inline-grid place-items-center [width:2.6rem] [height:2.6rem] [border:0] [border-radius:50%] [background:none] [color:inherit] cursor-pointer [transition:background_.2s,transform_.2s] [&:hover]:[background:rgba(255,255,255,.14)] [&:active]:[transform:scale(.94)] [.search__bar_&]:[color:var(--color-muted)] [.search__bar_&:hover]:[background:var(--green-50)]" onClick={() => uiStore.openMobileMenu()} aria-label="Open menu" aria-expanded={menu}><MenuIcon /></button>
          <Link to="/" className="[grid-area:logo] [font-family:var(--font-display)] [font-size:1.7rem] [letter-spacing:.22em] uppercase whitespace-nowrap min-[1100px]:[.hdr--float_&]:[font-size:1.4rem] [.footer_&]:[color:#fff]">Klaussner</Link>
          <nav className="hidden min-[1100px]:[grid-area:content] min-[1100px]:flex min-[1100px]:items-center min-[1100px]:[gap:1.25rem] min-[1100px]:[font-size:.76rem] min-[1100px]:[letter-spacing:.04em] min-[1100px]:mx-auto min-[1100px]:[.hdr--float_&]:hidden" aria-label="Explore">
            {links.map((p) => <NavLink key={p.to} to={p.to} prefetch="intent" className={p.style === 'pill' ? '[.hdr_nav_a&]:[border:1px_solid_rgba(255,255,255,.5)] [.hdr_nav_a&]:[border-radius:999px] [.hdr_nav_a&]:[padding:.25rem_.85rem] [.hdr_nav_a&:hover]:[background:#fff] [.hdr_nav_a&:hover]:[color:var(--green-900)] [.hdr_nav_a&:hover]:[border-color:#fff]' : undefined}>{p.label}</NavLink>)}
          </nav>
          <div className="hidden min-[1100px]:[grid-area:shop] min-[1100px]:block min-[1100px]:[border-top:1px_solid_rgba(255,255,255,.12)] min-[1100px]:[.hdr--float_&]:[border:0]"><MegaNav items={tree} /></div>
          <div className="[grid-area:actions] [justify-self:end] flex items-center [gap:.35rem]">
            <button type="button" className="relative inline-grid place-items-center [width:2.6rem] [height:2.6rem] [border:0] [border-radius:50%] [background:none] [color:inherit] cursor-pointer [transition:background_.2s,transform_.2s] [&:hover]:[background:rgba(255,255,255,.14)] [&:active]:[transform:scale(.94)] [.search__bar_&]:[color:var(--color-muted)] [.search__bar_&:hover]:[background:var(--green-50)]" onClick={() => uiStore.openSearch()} aria-label="Search"><SearchIcon /></button>
            <button type="button" className="relative inline-grid place-items-center [width:2.6rem] [height:2.6rem] [border:0] [border-radius:50%] [background:none] [color:inherit] cursor-pointer [transition:background_.2s,transform_.2s] [&:hover]:[background:rgba(255,255,255,.14)] [&:active]:[transform:scale(.94)] [.search__bar_&]:[color:var(--color-muted)] [.search__bar_&:hover]:[background:var(--green-50)]" onClick={() => setOpen(true)} aria-label={`Bag${count > 0 ? `, ${count} items` : ''}`}>
              <BagIcon />{count > 0 && <span className="absolute [top:.15rem] [right:.1rem] [min-width:1.1rem] [height:1.1rem] grid place-items-center [background:var(--green-500)] [color:#fff] [border-radius:999px] [font-size:.66rem] [line-height:1] [padding:0_.25rem]">{count}</span>}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menu} onClose={closeMenu} onSearch={() => uiStore.openSearch()} />
    </>
  );
}