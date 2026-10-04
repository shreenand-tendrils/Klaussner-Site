import {getProducts} from '~/lib/data';
import {getSiteNav} from '~/lib/navData';
import {buildIndex, productHref} from '~/lib/nav';

export async function loader({request, context}) {
  const {origin} = new URL(request.url);
  const [nav, {products}] = await Promise.all([getSiteNav(context), getProducts(context, {limit: 500})]);
  const idx = buildIndex(nav.tree);
  const urls = ['/', ...Object.keys(idx.byPath), ...nav.pages.map((p) => p.to), ...products.map((p) => productHref(idx, p))];
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${origin}${u}</loc></url>`).join('')}</urlset>`;
  return new Response(xml, {headers: {'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600'}});
}