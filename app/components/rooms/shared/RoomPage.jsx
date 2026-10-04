import {Link} from 'react-router';
import {CmsContent} from '~/components/cms/CmsContent';
import {Hero} from '~/components/sections/Hero';
import {CollectionListing} from '~/components/collection/CollectionListing';

/**
 * Generic room layout: Hero (CMS slot or coded fallback) → sub-category chips →
 * room-specific `extras` → product listing → CMS content slot.
 * Each room folder passes its own config + extras.
 */
export function RoomPage({config, data, extras = null}) {
  const {subnav = config.subnav, collection, products, total, sort, available, limit, collections, heroEntry, contentEntry} = data;
  const commerce = {collections, products};
  return (
    <>
      <CmsContent
        entry={heroEntry} commerce={commerce}
        fallback={<Hero size="medium" badge={config.badge} heading={collection.title} subheading={config.intro} image={config.heroImage} videoUrl={config.heroVideo} />}
      />
      {subnav?.length > 0 && (
        <nav className="mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] flex flex-wrap [gap:.5rem] [padding-block:1.25rem_0]" aria-label={`${config.title} categories`}>
          {subnav.map(([label, to]) => <Link key={to} className="[padding:.45rem_1rem] [border:1px_solid_var(--color-line)] [border-radius:999px] [background:#fff] [font:inherit] [font-size:.85rem] cursor-pointer [transition:var(--transition)] [&:hover]:[border-color:var(--green-700)] [&:hover]:[background:var(--green-50)] [&[aria-pressed=true]]:[border-color:var(--green-800)] [&[aria-pressed=true]]:[background:var(--green-100)] [&[disabled]]:[opacity:.4] [&[disabled]]:line-through [.product-form_&]:[min-height:2.6rem] [.product-form_&]:[padding:.55rem_.85rem] [.product-form_&]:[border:1px_solid_var(--color-line)] [.product-form_&]:[background:transparent] [.product-form_&]:[color:var(--color-ink)] [.product-form_&]:[font:inherit] [.product-form_&]:[font-size:.78rem] [.product-form_&]:cursor-pointer [.product-form_&]:[transition:all_.2s_ease] [.product-form_&:hover:not(:disabled)]:[border-color:var(--color-ink)] [.product-form_&[aria-pressed=true]]:[background:var(--color-ink)] [.product-form_&[aria-pressed=true]]:[border-color:var(--color-ink)] [.product-form_&[aria-pressed=true]]:[color:#fff] [.product-form_&:disabled]:[opacity:.32] [.product-form_&:disabled]:line-through [.product-form_&:disabled]:[cursor:not-allowed]" to={to}>{label}</Link>)}
        </nav>
      )}
      {extras}
      <section className="mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] [padding-block:var(--section-y)]" id="products">
        <CollectionListing {...{products, total, sort, available, limit}} />
      </section>
      <CmsContent entry={contentEntry} commerce={commerce} />
    </>
  );
}
