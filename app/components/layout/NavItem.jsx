import {NavLink} from 'react-router';

/** Internal → router link, external (Shopify "HTTP" items) → plain anchor. */
export function NavItem({item, children, ...rest}) {
  const cls = [rest.className, item.handle === 'sale' ? `[.hdr_nav_a&]:[color:var(--green-400)] [.hdr_nav_a&]:[font-weight:600] is-sale` : ''].filter(Boolean).join(' ') || undefined;
  if (item.external) return <a href={item.href} {...rest} className={cls} rel="noopener noreferrer">{children ?? item.title}</a>;
  return <NavLink to={item.href} prefetch="intent" {...rest} className={cls}>{children ?? item.title}</NavLink>;
}
