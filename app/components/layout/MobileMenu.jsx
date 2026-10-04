import {useEffect} from 'react';
import {Link} from 'react-router';
import {useNav} from '~/components/layout/NavContext';
import {NavItem} from '~/components/layout/NavItem';
import {ChevronIcon, CloseIcon, SearchIcon} from '~/components/ui/Icons';

// Recursive accordion: any depth the Shopify menu has.
function Branch({item, onClose, level = 0}) {
  if (!item.children.length) return <NavItem item={item} onClick={onClose} className="block [padding:.45rem_0] [.menu__sub_&]:[font-size:1.1rem] [.menu__sub_&]:[font-family:var(--font-body)]">{item.title}</NavItem>;
  return (
    <details className={`[&>summary]:flex [&>summary]:justify-between [&>summary]:items-center [&>summary]:[list-style:none] [&>summary]:cursor-pointer [&>summary]:[padding:.45rem_0] [&>summary::-webkit-details-marker]:hidden [&>summary_svg]:[transition:transform_.25s] [&[open]>summary_svg]:[transform:rotate(180deg)] menu__group--${level} ${({1:'[font-size:1.1rem] [font-family:var(--font-body)]',2:'[font-size:1.1rem] [font-family:var(--font-body)]'})[level]??''}`}>
      <summary>{item.title}<ChevronIcon /></summary>
      <div className="grid [padding-left:1rem] [border-left:1px_solid_rgba(255,255,255,.18)] [margin-bottom:.4rem] [font-size:1.2rem] menu__sub">
        {item.kind === 'collection' && <Link to={item.href} onClick={onClose} className="block [padding:.45rem_0] [.menu__sub_&]:[font-size:1.1rem] [.menu__sub_&]:[font-family:var(--font-body)] [color:var(--green-400)]">All {item.title}</Link>}
        {item.children.map((c) => <Branch key={c.id} item={c} onClose={onClose} level={level + 1} />)}
      </div>
    </details>
  );
}

export function MobileMenu({open, onClose, onSearch}) {
  const {tree, pages} = useNav();
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed [inset:0] [z-index:80] [background:var(--green-900)] [color:#fff] [padding:1.25rem_var(--gutter)] overflow-auto [animation:fade_.25s_ease_both] [&_nav]:grid [&_nav]:[gap:.2rem] [&_nav]:[margin-top:1.5rem] [&_nav]:[font-family:var(--font-display)] [&_nav]:[font-size:1.7rem] menu" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="flex justify-between items-center">
        <span className="[grid-area:logo] [font-family:var(--font-display)] [font-size:1.7rem] [letter-spacing:.22em] uppercase whitespace-nowrap min-[1100px]:[.hdr--float_&]:[font-size:1.4rem] [.footer_&]:[color:#fff]">Klaussner</span>
        <button type="button" className="relative inline-grid place-items-center [width:2.6rem] [height:2.6rem] [border:0] [border-radius:50%] [background:none] [color:inherit] cursor-pointer [transition:background_.2s,transform_.2s] [&:hover]:[background:rgba(255,255,255,.14)] [&:active]:[transform:scale(.94)] [.search__bar_&]:[color:var(--color-muted)] [.search__bar_&:hover]:[background:var(--green-50)]" onClick={onClose} aria-label="Close menu"><CloseIcon /></button>
      </div>
      <button type="button" className="flex items-center [gap:.6rem] [width:100%] [margin-top:1.25rem] [padding:.85rem_1rem] [border-radius:var(--radius-md)] [border:1px_solid_rgba(255,255,255,.25)] [background:rgba(255,255,255,.06)] [color:#fff] [font:inherit] text-left cursor-pointer" onClick={() => { onClose(); onSearch(); }}><SearchIcon /> Search the store</button>
      <nav aria-label="Shop">
        <h2 className="[font-family:var(--font-body)] [font-size:.72rem] [letter-spacing:.18em] uppercase [color:var(--green-400)] [margin:0_0_.5rem]">Shop</h2>
        {tree.map((it) => <Branch key={it.id} item={it} onClose={onClose} />)}
      </nav>
      {pages.length > 0 && (
        <nav aria-label="Explore" className="[.menu_nav&]:[font-family:var(--font-body)] [.menu_nav&]:[font-size:1rem] [.menu_nav&]:[color:var(--green-200)] [.menu_nav&]:[gap:.8rem]">
          <h2 className="[font-family:var(--font-body)] [font-size:.72rem] [letter-spacing:.18em] uppercase [color:var(--green-400)] [margin:0_0_.5rem]">Explore</h2>
          {pages.filter((p) => p.placement !== 'footer').map((p) => <Link key={p.to} to={p.to} onClick={onClose}>{p.label}</Link>)}
        </nav>
      )}
    </div>
  );
}
