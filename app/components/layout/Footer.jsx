import {Link} from 'react-router';
import {useNav} from '~/components/layout/NavContext';
import {NavItem} from '~/components/layout/NavItem';

export function Footer() {
  const {tree, pages} = useNav();
  const explore = pages.filter((p) => p.placement !== 'header');
  return (
    <footer className="[background:var(--green-950)] [color:#f2f8ee] [padding-top:4rem] [font-size:.9rem] overflow-hidden [&_h2]:[font-size:1.1rem] [&_h2]:[color:#fff] [&_a:hover]:[color:var(--green-400)] [&_ul]:[list-style:none] [&_ul]:[padding:0] [&_ul]:grid [&_ul]:[gap:.4rem] footer">
      <div className="mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] [.footer_&]:grid [.footer_&]:[gap:2rem] [.footer_&]:[grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
        <div><div className="[grid-area:logo] [font-family:var(--font-display)] [font-size:1.7rem] [letter-spacing:.22em] uppercase whitespace-nowrap min-[1100px]:[.hdr--float_&]:[font-size:1.4rem] [.footer_&]:[color:#fff]">Klaussner</div><p>Furniture made to be lived in.</p></div>
        <nav aria-label="Shop footer"><h2>Shop</h2>
          <ul>{tree.map((n) => <li key={n.id}><NavItem item={n} /></li>)}</ul></nav>
        {explore.length > 0 && (
          <nav aria-label="Explore footer"><h2>Explore</h2>
            <ul>{explore.map((p) => <li key={p.to}><Link to={p.to}>{p.label}</Link></li>)}</ul></nav>
        )}
      </div>
      <div className="mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] [margin-top:2.5rem] [padding-top:1.25rem] [border-top:1px_solid_rgba(255,255,255,.12)] [font-size:.8rem] [color:#e3efdc]"><span>© {new Date().getFullYear()} Klaussner Home Furnishings</span></div>
      <svg className="block [width:100%] [height:auto] [margin-top:1.5rem] [padding-inline:var(--gutter)] [box-sizing:border-box] [font-family:var(--font-display)] [font-weight:500] [user-select:none] [opacity:.22]" viewBox="0 0 1200 190" role="img" aria-label="Klaussner" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="fm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#d3e8c8" stopOpacity=".6" />
          </linearGradient>
        </defs>
        <text x="0" y="172" textLength="1200" lengthAdjust="spacingAndGlyphs" fontSize="205" fill="url(#fm)">KLAUSSNER</text>
      </svg>
    </footer>
  );
}
