import {useEffect} from 'react';
import {Link, useFetcher} from 'react-router';
import {ProductGrid} from '~/components/product/ProductGrid';
import {useHrefs} from '~/components/layout/NavContext';
import {useCommerce} from '~/components/cms/CommerceContext';
import {SectionShell, SectionHeading} from '~/components/ui/SectionShell';

/** Blank collectionHandle = featured products from the page loader; otherwise fetched from /api/products. */
export function ProductShelf({eyebrow, heading = 'Featured', collectionHandle, limit = 4, linkLabel, theme = 'light', products: passed}) {
  const ctx = useCommerce();
  const f = useFetcher();
  const {collectionHref} = useHrefs();
  const n = Number(limit) || 4;
  useEffect(() => {
    if (collectionHandle && !passed) f.load(`/api/products?collection=${encodeURIComponent(collectionHandle)}&limit=${n}`);
  }, [collectionHandle, n]); // eslint-disable-line react-hooks/exhaustive-deps
  const list = passed ?? (collectionHandle ? f.data?.products : ctx.products?.slice(0, n)) ?? [];
  return (
    <SectionShell theme={theme}>
      <div className="flex justify-between items-end [margin-bottom:var(--space-8)] [gap:1rem] [&>a]:[font-size:.85rem] [&>a]:underline [&>a]:[text-underline-offset:5px] [&>a]:[color:var(--green-700)] section-head">
        <SectionHeading eyebrow={eyebrow} heading={heading} />
        {linkLabel && collectionHandle && <Link to={collectionHref(collectionHandle)}>{linkLabel}</Link>}
      </div>
      <ProductGrid products={list} />
    </SectionShell>
  );
}
