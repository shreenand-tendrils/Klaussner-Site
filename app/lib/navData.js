import {getEnv} from '~/lib/env';
import menuMock from '~/data/mock/menu.json';
import {hasCms, getNavPages} from '~/lib/sanity';
import {FALLBACK_EXPLORE, normalizeMenu} from '~/lib/nav';

const ITEM = `id title url type resource { __typename ... on Collection { handle image { url } } ... on Page { handle } ... on Product { handle } }`;
// 3 levels = Shopify's maximum menu depth (Room → Category → Sub-category).
const MENU_QUERY = `query SiteMenu($handle: String!) { menu(handle: $handle) { items { ${ITEM} items { ${ITEM} items { ${ITEM} } } } } }`;

async function shopMenu(ctx) {
  if (getEnv(ctx, 'USE_MOCK_DATA') !== 'false') return menuMock;
  try {
    const handle = getEnv(ctx, 'SHOPIFY_MENU_HANDLE') ?? 'main-menu';
    const {menu} = await ctx.storefront.query(MENU_QUERY, {variables: {handle}, cache: ctx.storefront.CacheShort()});
    return menu?.items ?? [];
  } catch (e) {
    console.error('[nav] Shopify menu failed', e);
    return [];
  }
}

// CMS pages flagged "Show in navbar" in Sanity → header/footer links.
async function cmsPages(ctx) {
  if (!hasCms(ctx)) return FALLBACK_EXPLORE;
  const list = await getNavPages(ctx);
  return list
    .filter((d) => d.url)
    .sort((a, b) => (a.navOrder ?? 100) - (b.navOrder ?? 100))
    .map((d) => ({label: d.navLabel || d.title, to: d.url, style: d.navStyle || 'link', placement: d.navPlacement || 'header'}));
}

const memo = new WeakMap(); // one fetch per request
export function getSiteNav(ctx) {
  const key = ctx ?? memo;
  if (!memo.has(key)) {
    memo.set(key, Promise.all([shopMenu(ctx), cmsPages(ctx)]).then(([items, pages]) => ({tree: normalizeMenu(items), pages})));
  }
  return memo.get(key);
}
