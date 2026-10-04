import {searchCatalog} from '~/lib/data';

export async function loader({request, context}) {
  const q = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return Response.json({products: [], collections: []});
  return Response.json(await searchCatalog(context, q), {headers: {'Cache-Control': 'public, max-age=60'}});
}