import {redirect, useLoaderData} from 'react-router';
import {getCollection, getProducts} from '~/lib/data';
import {getSiteNav} from '~/lib/navData';
import {buildIndex} from '~/lib/nav';
import {CollectionListing} from '~/components/collection/CollectionListing';

export const meta = ({data}) => data ? [
  {title: `${data.collection.title} | Klaussner`},
  {name: 'description', content: data.collection.description},
] : [];

export async function loader({params, request, context}) {
  // Collections that live in the Shopify menu are served at their nested URL (/living-room/sofas).
  const node = buildIndex((await getSiteNav(context)).tree).byHandle[params.handle];
  if (node) return redirect(`${node.path}${new URL(request.url).search}`, 301);
  const sp = new URL(request.url).searchParams;
  const sort = sp.get('sort') || 'featured';
  const available = sp.get('available') === '1';
  const limit = Math.min(Number(sp.get('limit')) || 12, 48);
  const collection = await getCollection(context, params.handle);
  if (!collection) throw new Response('Not found', {status: 404});
  const {products, total} = await getProducts(context, {collection: params.handle, sort, available, limit});
  return {collection, products, total, sort, available, limit};
}

export default function Collection() {
  const {collection, products, total, sort, available, limit} = useLoaderData();
  return (
    <div className="mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] [padding-block:var(--section-y)]">
      <p className="[font-size:.72rem] [letter-spacing:.18em] uppercase [color:var(--green-700)] [font-weight:600] [margin:0_0_var(--space-3)] [.sec--green_&]:[color:var(--green-400)] [.sec--dark_&]:[color:var(--green-400)] [.pdp__eyebrow-row_&]:[margin:0]">Collection</p>
      <h1>{collection.title}</h1>
      <p className="[color:var(--color-muted)] [max-width:60ch]">{collection.description}</p>
      <CollectionListing {...{products, total, sort, available, limit}} />
    </div>
  );
}
