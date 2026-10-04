import {useLoaderData} from 'react-router';
import {getCollections, getProduct, getProducts} from '~/lib/data';
import {getPage, isPreview} from '~/lib/sanity';
import {getSiteNav} from '~/lib/navData';
import {buildIndex, productHref, resolveNavPath} from '~/lib/nav';
import {loadCollectionPage} from '~/components/rooms/shared/roomLoader';
import {ROOM_PAGES} from '~/components/rooms/registry';
import {RoomPage} from '~/components/rooms/shared/RoomPage';
import {ProductView, productMeta} from '~/components/product/ProductView';
import {CmsContent} from '~/components/cms/CmsContent';

/**
 * Catch-all. Order:
 *  1. /living-room · /living-room/sofas · /living-room/sofas/1-seater-sofa  → collection (any depth in the Shopify menu)
 *  2. <any of the above>/<product-handle>                                   → product page
 *  3. everything else                                                       → Sanity "page" (e.g. /room-inspiration), else 404
 */
export async function loader({request, context}) {
  const url = new URL(request.url);
  const nav = await getSiteNav(context);
  const idx = buildIndex(nav.tree);
  const hit = resolveNavPath(idx, url.pathname);

  if (hit?.type === 'collection') {
    const data = await loadCollectionPage(context, request, hit.node);
    if (data) return {kind: 'collection', ...data};
  }
  if (hit?.type === 'product') {
    const product = await getProduct(context, hit.handle);
    if (product) {
      const {products} = await getProducts(context, {collection: hit.parent.handle, limit: 5});
      return {
        kind: 'product', product,
        related: products.filter((p) => p.id !== product.id).slice(0, 4),
        canonical: new URL(productHref(idx, product), request.url).href,
      };
    }
  }

  const entry = await getPage(context, url.pathname, url.searchParams);
  if (!entry && !isPreview(context, url.searchParams)) throw new Response('Not found', {status: 404});
  const [collections, {products}] = await Promise.all([getCollections(context), getProducts(context, {limit: 8})]);
  return {kind: 'page', entry, collections, products};
}

export const meta = ({data}) => {
  if (!data) return [];
  if (data.kind === 'product') return productMeta(data.product, data.canonical);
  if (data.kind === 'collection') {
    const cfg = ROOM_PAGES[data.handle]?.config;
    return [{title: `${data.collection.title} | Klaussner`}, {name: 'description', content: data.collection.description || cfg?.intro || ''}];
  }
  return data.entry ? [
    {title: `${data.entry.data?.title ?? 'Klaussner'} | Klaussner`},
    {name: 'description', content: data.entry.data?.description ?? ''},
  ] : [];
};

export default function Resolved() {
  const d = useLoaderData();
  if (d.kind === 'product') return <ProductView product={d.product} related={d.related} />;
  if (d.kind === 'collection') {
    const room = ROOM_PAGES[d.handle];
    if (room) return <room.Page data={d} />;
    const config = {title: d.collection.title, badge: d.collection.title, intro: d.collection.description, heroImage: d.collection.image};
    return <RoomPage config={config} data={d} />;
  }
  return <CmsContent entry={d.entry} commerce={{collections: d.collections, products: d.products}} />;
}
