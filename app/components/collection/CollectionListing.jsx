import {Form, Link, useNavigation, useSubmit} from 'react-router';
import {ProductGrid} from '~/components/product/ProductGrid';

const SORT_OPTIONS = [
  {value: 'featured', label: 'Featured'},
  {value: 'price-asc', label: 'Price: low to high'},
  {value: 'price-desc', label: 'Price: high to low'},
  {value: 'title', label: 'Name'},
];

const PAGE_STEP = 12;

/** Toolbar (stock filter + sort) + grid + "Load more". Shared by collection and room pages. */
export function CollectionListing({products, total, sort, available, limit}) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const loading = navigation.state === 'loading';

  const more = new URLSearchParams({
    sort,
    limit: String(limit + PAGE_STEP),
    ...(available ? {available: '1'} : {}),
  });

  return (
    <>
      <Form
        method="get"
        onChange={(e) => submit(e.currentTarget, {preventScrollReset: true})}
        className="my-[var(--space-6)] flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-line)] pb-5"
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex cursor-pointer items-center gap-3 text-[.95rem] text-[var(--color-ink)] transition hover:text-emerald-700">
            <input
              type="checkbox"
              name="available"
              value="1"
              defaultChecked={available}
              className="h-4 w-4 cursor-pointer accent-emerald-600"
            />
            In stock only
          </label>

          <span className="text-[.85rem] text-[var(--color-muted)]" aria-live="polite">
            {total} {total === 1 ? 'product' : 'products'}
          </span>
        </div>

        <label className="flex items-center gap-3 text-[.72rem] uppercase tracking-[.14em] text-[var(--color-muted)]">
          <span className="hidden sm:inline">Sort</span>
          <select
            name="sort"
            defaultValue={sort}
            className="cursor-pointer rounded-sm border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2.5 text-[.8rem] normal-case tracking-normal text-[var(--color-ink)] outline-none transition focus:border-emerald-600"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </Form>

      <ProductGrid products={products} />

      {products.length < total && (
        <div className="mt-12 text-center sm:mt-16">
          <p className="mb-4 text-[.8rem] text-[var(--color-muted)]">
            Showing {products.length} of {total}
          </p>
          <Link
            to={`?${more}`}
            preventScrollReset
            aria-busy={loading}
            className="inline-flex items-center justify-center rounded-[var(--radius-btn)] border border-[var(--green-800)] px-9 py-4 text-[.74rem] font-semibold uppercase tracking-[.16em] text-[var(--green-800)] transition duration-300 hover:bg-[var(--green-800)] hover:text-white [&[aria-busy=true]]:pointer-events-none [&[aria-busy=true]]:opacity-60"
          >
            {loading ? 'Loading…' : 'Load more'}
          </Link>
        </div>
      )}
    </>
  );
}