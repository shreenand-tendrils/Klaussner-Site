import {getProducts} from '~/lib/data';

// GET /api/products?collection=living-room&limit=8 — used by CMS "ProductShelf" blocks
export async function loader({request, context}) {
  const sp = new URL(request.url).searchParams;
  const limit = Math.min(Math.max(Number(sp.get('limit')) || 4, 1), 24);
  const {products} = await getProducts(context, {collection: sp.get('collection') || undefined, limit});
  return Response.json({products}, {headers: {'Cache-Control': 'public, max-age=60, s-maxage=300'}});
}
