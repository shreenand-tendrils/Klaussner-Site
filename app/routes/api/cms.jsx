import {API_MODELS, MODELS, fetchList, getEntry, hasCms, isPreview} from '~/lib/sanity';

/**
 * Public CMS endpoint:  GET /api/cms
 *   ?model=page&path=/room-inspiration      → one page by URL
 *   ?model=section&slot=living-room-hero    → one section by slot
 *   ?model=section&limit=20[&slot=…]        → list entries
 * Response: {model, entry} or {model, entries}. Read-only; only published content (drafts need the preview secret).
 */
const cors = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS'};

export async function loader({request, context}) {
  const sp = new URL(request.url).searchParams;
  const model = sp.get('model') ?? MODELS.page;
  const json = (body, status = 200, headers = {}) => Response.json(body, {status, headers: {...cors, ...headers}});

  if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors});
  if (!hasCms(context)) return json({error: 'PUBLIC_SANITY_PROJECT_ID is not set'}, 503);
  if (!API_MODELS.includes(model)) return json({error: `model must be one of: ${API_MODELS.join(', ')}`}, 400);

  const cache = isPreview(context, sp)
    ? {'Cache-Control': 'no-store'}
    : {'Cache-Control': 'public, max-age=30, s-maxage=300, stale-while-revalidate=600'};

  if (sp.has('limit')) {
    const limit = Math.min(Math.max(Number(sp.get('limit')) || 10, 1), 50);
    return json({model, entries: await fetchList(context, {model, slot: sp.get('slot') ?? undefined, limit}, sp)}, 200, cache);
  }
  const entry = await getEntry(context, {model, urlPath: sp.get('path') ?? undefined, slot: sp.get('slot') ?? undefined}, sp);
  return entry ? json({model, entry}, 200, cache) : json({model, entry: null}, 404, cache);
}

export const action = () => new Response('Method not allowed', {status: 405, headers: cors});
