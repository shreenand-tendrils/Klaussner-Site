import {Link} from 'react-router';

/** CMS-entered URL: external/mailto/tel → anchor, internal → router link. */
export function CmsLink({to, children, ...rest}) {
  if (!to) return null;
  if (/^(https?:|mailto:|tel:)/.test(to)) return <a href={to} {...rest} {...(to.startsWith('http') ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>{children}</a>;
  return <Link to={to} {...rest}>{children}</Link>;
}

/** Renders a CMS "buttons" list: [{label, url, style: 'solid'|'outline'}]. */
export function SectionButtons({buttons, align = 'left'}) {
  const list = (buttons ?? []).filter((b) => b?.label && b?.url);
  if (!list.length) return null;
  return (
    <div className={`flex flex-wrap [gap:.75rem] [margin-top:var(--space-8)] [.ibanner_&]:[margin-top:.5rem] [.ibanner--right_&]:justify-end [.ibanner--center_&]:justify-center sec-btns--${align} ${({'center':'[justify-content:center]!'})[align]??''}`}>
      {list.map((b, i) => <CmsLink key={i} to={b.url} className={`inline-flex items-center justify-center [padding:.9rem_1.8rem] [border:1px_solid_var(--green-800)] [border-radius:var(--radius-btn)] [background:var(--green-800)] [color:#fff] [font:inherit] [font-size:.78rem] [letter-spacing:.12em] uppercase cursor-pointer [transition:var(--transition)] [&:hover]:[background:var(--green-700)] [&:hover]:[border-color:var(--green-700)] [&[disabled]]:[opacity:.4] [&[disabled]]:pointer-events-none [.hero__cta_&]:[padding:.9rem_2.2rem] [.sec--green_&:not(.btn--ghost)]:[background:#fff] [.sec--green_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--green_&:not(.btn--ghost)]:[border-color:#fff] [.sec--dark_&:not(.btn--ghost)]:[background:#fff] [.sec--dark_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--dark_&:not(.btn--ghost)]:[border-color:#fff] [.ibanner_&:not(.btn--ghost)]:[background:#fff] [.ibanner_&:not(.btn--ghost)]:[color:var(--green-900)] [.ibanner_&:not(.btn--ghost)]:[border-color:#fff] ${b.style === 'outline' ? '[background:transparent]! [color:var(--green-800)]! [&:hover]:[background:var(--green-800)]! [&:hover]:[color:#fff]! [&:hover]:[border-color:var(--green-800)]! [.sec--green_&]:[color:#fff]! [.sec--green_&]:[border-color:rgba(255,255,255,.5)]! [.sec--dark_&]:[color:#fff]! [.sec--dark_&]:[border-color:rgba(255,255,255,.5)]! [.ibanner_&]:[color:#fff]! [.ibanner_&]:[border-color:rgba(255,255,255,.6)]! btn--ghost' : ''}`}>{b.label}</CmsLink>)}
    </div>
  );
}
