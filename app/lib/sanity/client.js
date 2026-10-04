import {createClient} from '@sanity/client';
import {toHTML} from '@portabletext/to-html';
import {getEnv} from '~/lib/env';
import {MODELS} from './models';

export const hasCms = (ctx) => !!getEnv(ctx, 'PUBLIC_SANITY_PROJECT_ID');

/** Draft preview: open any page with ?preview=<SANITY_PREVIEW_SECRET> (needs SANITY_API_READ_TOKEN). */
export const isPreview = (ctx, sp) => {
  const secret = getEnv(ctx, 'SANITY_PREVIEW_SECRET');
  return !!secret && !!getEnv(ctx, 'SANITY_API_READ_TOKEN') && sp?.get?.('preview') === secret;
};

function client(ctx, sp) {
  const preview = isPreview(ctx, sp);
  return createClient({
    projectId: getEnv(ctx, 'PUBLIC_SANITY_PROJECT_ID'),
    dataset: getEnv(ctx, 'PUBLIC_SANITY_DATASET') || 'production',
    apiVersion: getEnv(ctx, 'SANITY_API_VERSION') || '2025-02-19',
    useCdn: !preview,
    perspective: preview ? 'previewDrafts' : 'published',
    token: preview ? getEnv(ctx, 'SANITY_API_READ_TOKEN') : undefined,
  });
}

// Flatten Sanity assets to plain URLs so every section component keeps its original props.
const MEDIA = `"image": image.asset->url, "videoUrl": video.asset->url, "poster": poster.asset->url`;
const BLOCKS = `sections[]{..., ${MEDIA}, items[]{..., ${MEDIA}}, left{..., ${MEDIA}}, center{..., ${MEDIA}}, right{..., ${MEDIA}}}`;

const clean = (v) => {
  if (Array.isArray(v)) return v.map(clean);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).filter(([, x]) => x != null).map(([k, x]) => [k, clean(x)]));
  }
  return v;
};

function shape(doc) {
  if (!doc) return null;
  const d = clean(doc);
  d.sections = (d.sections ?? []).map((b) => (b._type === 'RichText' ? {...b, html: toHTML(b.body ?? [])} : b));
  return {data: {title: d.title, description: d.description}, sections: d.sections};
}

async function safe(fn, fallback) {
  try { return await fn(); } catch (e) { console.error('[sanity] fetch failed', e); return fallback; }
}

const norm = (p = '/') => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/';

export const getPage = (ctx, urlPath, sp) => !hasCms(ctx) ? Promise.resolve(null) : safe(async () =>
  shape(await client(ctx, sp).fetch(`*[_type=="page" && url==$u][0]{title,description,${BLOCKS}}`, {u: norm(urlPath)})), null);

export const getSlot = (ctx, slot, sp) => !hasCms(ctx) ? Promise.resolve(null) : safe(async () =>
  shape(await client(ctx, sp).fetch(`*[_type=="section" && slot==$s][0]{title,${BLOCKS}}`, {s: slot})), null);

/** Pages with "Show in navbar" ticked → header/footer links. */
export const getNavPages = (ctx) => !hasCms(ctx) ? Promise.resolve([]) : safe(() =>
  client(ctx).fetch(`*[_type=="page" && showInNav==true && defined(url)][0...30]{title,url,navLabel,navOrder,navPlacement,navStyle}`), []);

/** Public list endpoint helper. */
export const fetchList = (ctx, {model, slot, limit = 10}, sp) => !hasCms(ctx) ? Promise.resolve([]) : safe(async () =>
  (await client(ctx, sp).fetch(
    `*[_type==$m ${slot ? '&& slot==$s' : ''}][0...$l]{_id,title,${model === MODELS.page ? 'url,description,' : 'slot,'}${BLOCKS}}`,
    {m: model, s: slot ?? '', l: limit},
  )).map((d) => ({id: d._id, url: d.url, slot: d.slot, ...shape(d)})), []);

export const getEntry = (ctx, {model, urlPath, slot}, sp) => (model === MODELS.page ? getPage(ctx, urlPath ?? '/', sp) : getSlot(ctx, slot, sp));
