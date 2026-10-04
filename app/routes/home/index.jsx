import {Link, useLoaderData} from 'react-router';
import {getCollections, getProducts} from '~/lib/data';
import {getPage, getSlot} from '~/lib/sanity';
import content from '~/data/mock/content.json';
import {CmsContent, CmsSection} from '~/components/cms/CmsContent';
import {Hero} from '~/components/sections/Hero';
import {ImageTextSection} from '~/components/sections/ImageTextSection';
import {DesignYourRoomCTA} from '~/components/sections/DesignYourRoomCTA';
import {Newsletter} from '~/components/sections/Newsletter';
import {ProductGrid} from '~/components/product/ProductGrid';
import {CollectionGrid} from '~/components/collection/CollectionGrid';

export const meta = ({data}) => [
  {title: data?.page?.data?.title ? `${data.page.data.title} | Klaussner` : 'Klaussner | Premium Furniture'},
  {name: 'description', content: data?.page?.data?.description ?? 'Considered furniture for living, dining and bedroom.'},
];

export async function loader({context, request}) {
  const sp = new URL(request.url).searchParams;
  const [collections, {products}, page, hero] = await Promise.all([
    getCollections(context),
    getProducts(context, {limit: 8}),
    getPage(context, '/', sp),
    getSlot(context, 'home-hero', sp),
  ]);
  return {collections, products, page, hero};
}

const REPLACEABLE = new Set([
  'Hero',
  'CollectionShelf',
  'ProductShelf',
  'DesignYourRoomCTA',
  'Newsletter',
  // ImageTextSection ko yahan se hata diya hai taaki yeh kabhi override na ho!
]);

function splitSanity(sections = []) {
  const overrides = new Map();
  const additions = [];

  for (const section of sections) {
    if (!section?._type) continue;
    if (REPLACEABLE.has(section._type) && !overrides.has(section._type)) {
      overrides.set(section._type, section);
    } else {
      additions.push(section);
    }
  }

  return {overrides, additions};
}

export default function Home() {
  const {collections, products, page, hero} = useLoaderData();
  const commerce = {collections, products};
  const {overrides, additions} = splitSanity(page?.sections);

  const pageHero = overrides.get('Hero');
  const localHero = (
    <Hero
      {...content['home-hero']}
      videoUrl="/videos/klaussner-hero-01.mp4"
      ctaLabel={content['home-hero'].ctaLabel}
      secondaryCtaLabel="Design Your Room"
      secondaryCtaUrl="/design-your-room"
    />
  );

  const baseSections = [
    pageHero ? (
      <CmsSection key="home-hero-page" section={pageHero} commerce={commerce} />
    ) : (
      <CmsContent
        key="home-hero"
        entry={hero}
        commerce={commerce}
        fallback={localHero}
      />
    ),

    overrides.get('CollectionShelf') ? (
      <CmsSection key="home-collections" section={overrides.get('CollectionShelf')} commerce={commerce} />
    ) : (
      <section key="home-collections" className="[padding-block:var(--section-y)] mx-auto w-[min(100%_-_2*var(--gutter),var(--container))]">
        <div className="flex justify-between items-end [margin-bottom:var(--space-8)] [gap:1rem] [&>a]:[font-size:.85rem] [&>a]:underline [&>a]:[text-underline-offset:5px] [&>a]:[color:var(--green-700)] section-head">
          <h2>Shop by room</h2>
          <Link to="/collections">All collections</Link>
        </div>
        <CollectionGrid collections={collections.slice(0, 4)} />
      </section>
    ),

    overrides.get('ProductShelf') ? (
      <CmsSection key="home-products" section={overrides.get('ProductShelf')} commerce={commerce} />
    ) : (
      <section key="home-products" className="[padding-block:var(--section-y)] mx-auto w-[min(100%_-_2*var(--gutter),var(--container))]">
        <div className="flex justify-between items-end [margin-bottom:var(--space-8)] [gap:1rem] [&>a]:[font-size:.85rem] [&>a]:underline [&>a]:[text-underline-offset:5px] [&>a]:[color:var(--green-700)] section-head"><h2>Featured</h2></div>
        <ProductGrid products={products.slice(0, 4)} />
      </section>
    ),

    // Hamesha default video wala ImageTextSection render hoga, Sanity override nahi karega!
    <ImageTextSection key="home-editorial-default" />,

    overrides.get('DesignYourRoomCTA') ? (
      <CmsSection key="home-design" section={overrides.get('DesignYourRoomCTA')} commerce={commerce} />
    ) : <DesignYourRoomCTA key="home-design-local" />,

    overrides.get('Newsletter') ? (
      <CmsSection key="home-newsletter" section={overrides.get('Newsletter')} commerce={commerce} />
    ) : <Newsletter key="home-newsletter-local" />,
  ];

  return (
    <>
      {baseSections}
      {additions.map((section) => (
        <CmsSection key={section._key} section={section} commerce={commerce} />
      ))}
    </>
  );
}