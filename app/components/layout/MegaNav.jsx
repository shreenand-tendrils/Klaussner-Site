import {useEffect, useRef, useState} from 'react';
import {Link, useLocation} from 'react-router';
import {ArrowIcon, ChevronIcon} from '~/components/ui/Icons';
import {NavItem} from '~/components/layout/NavItem';

/**
 * Desktop mega nav. 100% data-driven: level 1 = bar, level 2 = panel columns, level 3 = links in a column.
 * Add/remove/rename items in Shopify → Navigation and this updates with no code change.
 */
export function MegaNav({items}) {
  const [open, setOpen] = useState(null);
  const timer = useRef();
  const {pathname} = useLocation();
  useEffect(() => setOpen(null), [pathname]);
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  const show = (id) => { clearTimeout(timer.current); setOpen(id); };
  const hide = () => { timer.current = setTimeout(() => setOpen(null), 140); };

  return (
    <nav className="mega" aria-label="Shop" onMouseLeave={hide}>
      <ul className="flex justify-center [gap:2.25rem] [list-style:none] [margin:0] [padding:0]">
        {items.map((it) => {
          const has = it.children.length > 0;
          const isOpen = open === it.id;
          return (
            <li key={it.id} onMouseEnter={() => (has ? show(it.id) : setOpen(null))}
              onFocus={() => (has ? show(it.id) : setOpen(null))}
              onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && hide()}>
              <NavItem item={it} className={`inline-flex items-center [gap:.35rem] [padding:.75rem_0] [font-size:.8rem] [letter-spacing:.15em] uppercase [color:#e9efe3] relative [&::after]:[content:''] [&::after]:absolute [&::after]:[left:0] [&::after]:[right:0] [&::after]:[bottom:.45rem] [&::after]:[height:1px] [&::after]:[background:currentColor] [&::after]:[transform:scaleX(0)] [&::after]:[transform-origin:left] [&::after]:[transition:transform_.3s_ease] [&:hover::after]:[transform:scaleX(1)] [&[aria-expanded=true]::after]:[transform:scaleX(1)] [&[aria-current=page]::after]:[transform:scaleX(1)] [.hdr--float_&]:[padding:.55rem_0] mega__top`} aria-haspopup={has || undefined} aria-expanded={has ? isOpen : undefined}>
                {it.title}{has && <ChevronIcon className="[transition:transform_.25s] [.mega__top[aria-expanded=true]_&]:[transform:rotate(180deg)]" />}
              </NavItem>
              {has && isOpen && (
                <div className="absolute [top:100%] [left:0] [right:0] [background:var(--green-950)] [color:#e9efe3] [border-radius:0_0_var(--radius-lg)_var(--radius-lg)] [box-shadow:0_24px_50px_rgba(10,26,16,.4)] [max-height:calc(100vh_-_9rem)] overflow-auto [animation:mega-in_.24s_ease_both] [.hdr--float_&]:[top:calc(100%_+_.5rem)] [.hdr--float_&]:[border-radius:var(--radius-lg)]" onMouseEnter={() => show(it.id)}>
                  <div className="grid [grid-template-columns:1fr_minmax(220px,300px)] [gap:3rem] [padding-block:2rem_2.25rem] mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] w-[min(100%_-_2*var(--gutter),var(--container-wide))]!">
                    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))] [gap:1.75rem_2rem] [align-content:start]">
                      {it.children.map((c) => (
                        <div key={c.id} className="[&_ul]:[list-style:none] [&_ul]:[margin:.6rem_0_0] [&_ul]:[padding:0] [&_ul]:grid [&_ul]:[gap:.45rem] [&_li_a]:[font-size:.9rem] [&_li_a]:[color:#b9c7b3] [&_li_a]:[transition:color_.2s,padding_.2s] [&_li_a:hover]:[color:#fff] [&_li_a:hover]:[padding-left:.3rem]">
                          <NavItem item={c} className="inline-block [font-family:var(--font-display)] [font-size:1.35rem] [color:#fff] [&:hover]:[color:var(--green-200)]" />
                          {c.children.length > 0 && (
                            <ul>{c.children.map((g) => <li key={g.id}><NavItem item={g} /></li>)}</ul>
                          )}
                        </div>
                      ))}
                    </div>
                    <Link to={it.href} className="grid [gap:.75rem] [align-content:start] [font-size:.85rem] [letter-spacing:.08em] uppercase [&_img]:[width:100%] [&_img]:[aspect-ratio:4/3] [&_img]:[object-fit:cover] [&_img]:[border-radius:var(--radius-md)] [&_img]:[transition:transform_.5s_ease] overflow-hidden [&:hover_img]:[transform:scale(1.04)] [&_span]:inline-flex [&_span]:items-center [&_span]:[gap:.5rem]" prefetch="intent">
                      {it.image && <img src={it.image} alt="" loading="lazy" />}
                      <span>Shop all {it.title} <ArrowIcon /></span>
                    </Link>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
