import {useLoaderData} from 'react-router';
import {getCollections} from '~/lib/data';
import {CollectionGrid} from '~/components/collection/CollectionGrid';

export const meta = () => [{title: 'All collections | Klaussner'}];

export async function loader({context}) {
  return Response.json(
    {collections: await getCollections(context)},
    {headers: {'Cache-Control': 'public, max-age=300, s-maxage=3600'}}
  );
}

export default function Collections() {
  const {collections} = useLoaderData();
  return (
    <div className="mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] [padding-block:var(--section-y)]">
      <p className="[font-size:.72rem] [letter-spacing:.18em] uppercase [color:var(--green-700)] [font-weight:600] [margin:0_0_var(--space-3)] [.sec--green_&]:[color:var(--green-400)] [.sec--dark_&]:[color:var(--green-400)] [.pdp__eyebrow-row_&]:[margin:0]">Directory</p>
      <h1>All collections</h1>
      <div className="[margin-top:2rem]">
        <CollectionGrid collections={collections} />
      </div>
    </div>
  );
}