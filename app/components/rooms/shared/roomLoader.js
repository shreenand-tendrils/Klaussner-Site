import {getCollection, getCollections, getProducts} from '~/lib/data';
import {getSlot} from '~/lib/sanity';
import {ROOM_PAGES} from '~/components/rooms/registry';

/**
 * Loads any collection page that exists in the Shopify menu (room, category or sub-category).
 * CMS slots default to "{collection-handle}-hero" and "{collection-handle}-content".
 */
export async function loadCollectionPage(context, request, node) {
  const sp = new URL(request.url).searchParams;
  const sort = sp.get('sort') || 'featured';
  const available = sp.get('available') === '1';
  const limit = Math.min(Number(sp.get('limit')) || 12, 48);
  const handle = node.handle;
  const cfg = ROOM_PAGES[handle]?.config;
  const collection = await getCollection(context, handle);
  if (!collection) return null;
  const [{products, total}, collections, heroEntry, contentEntry] = await Promise.all([
    getProducts(context, {collection: handle, sort, available, limit}),
    getCollections(context),
    getSlot(context, cfg?.heroSlot ?? `${handle}-hero`, sp),
    getSlot(context, cfg?.contentSlot ?? `${handle}-content`, sp),
  ]);
  const subnav = node.children.map((c) => [c.title, c.href]); // children straight from the Shopify menu
  return {handle, collection, products, total, sort, available, limit, collections, heroEntry, contentEntry, subnav};
}
