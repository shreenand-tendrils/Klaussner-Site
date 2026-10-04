// Pure nav helpers (server + client). The tree comes from a Shopify Navigation menu — nothing is hardcoded.
// URL rule: a collection nested in the menu gets the nested path  /living-room/sofas/1-seater-sofa
//           a product gets the deepest nested path of its collections  /living-room/sofas/1-seater-sofa/<product>

export const FALLBACK_EXPLORE = [
  ['Room Inspiration', '/room-inspiration'], ['Buying Guides', '/buying-guides'], ['Material Stories', '/material-stories'],
  ['Campaigns', '/campaigns'], ['Offers', '/offers'], ["What's New", '/whats-new'], ['Design Your Room', '/design-your-room', 'pill'],
].map(([label, to, style = 'link']) => ({label, to, style, placement: 'both'}));

const pathOf = (url = '') => {
  try { return new URL(url, 'https://x.local').pathname.replace(/\/+$/, '') || '/'; } catch { return '/'; }
};

/** Shopify menu items → plain serialisable tree. */
export function normalizeMenu(items = [], parent = '', depth = 0) {
  return (items ?? []).map((it) => {
    const r = it.resource;
    let kind = 'link', handle = null, path;
    if (it.type === 'COLLECTION' && r?.handle) { kind = 'collection'; handle = r.handle; path = `${parent}/${handle}`; }
    else if (it.type === 'PAGE' && r?.handle) path = `/${r.handle}`;
    else if (it.type === 'PRODUCT' && r?.handle) path = `/products/${r.handle}`;
    else if (it.type === 'CATALOG') path = '/collections';
    else if (it.type === 'FRONTPAGE') path = '/';
    else path = pathOf(it.url);
    const external = it.type === 'HTTP' && /^https?:/.test(it.url ?? '');
    return {
      id: it.id, title: it.title, kind, handle, path, depth, external,
      href: external ? it.url : path, image: r?.image?.url ?? null,
      children: normalizeMenu(it.items, kind === 'collection' ? path : parent, depth + 1),
    };
  });
}

export function buildIndex(tree = []) {
  const byPath = {}, byHandle = {};
  const walk = (nodes) => nodes.forEach((n) => {
    if (n.kind === 'collection') { byPath[n.path] ??= n; byHandle[n.handle] ??= n; }
    walk(n.children);
  });
  walk(tree);
  return {byPath, byHandle};
}

export const collectionHref = (idx, handle) => idx.byHandle[handle]?.path ?? `/collections/${handle}`;

export function productHref(idx, product) {
  let best = null;
  for (const h of product.collections ?? []) {
    const n = idx.byHandle[h];
    if (n && (!best || n.depth > best.depth)) best = n;
  }
  return best ? `${best.path}/${product.handle}` : `/products/${product.handle}`;
}

/** Maps a URL path to {type:'collection'|'product'} using the menu tree, or null. */
export function resolveNavPath(idx, pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (idx.byPath[path]) return {type: 'collection', node: idx.byPath[path]};
  const i = path.lastIndexOf('/');
  const parent = i > 0 ? idx.byPath[path.slice(0, i)] : null;
  return parent ? {type: 'product', parent, handle: path.slice(i + 1)} : null;
}
