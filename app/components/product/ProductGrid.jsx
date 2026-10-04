import {useMemo, useState} from 'react';
import {useSearchParams} from 'react-router';
import {ProductCard} from '~/components/product/ProductCard';
import {FilterPanel, SortSelect} from '~/components/product/ProductFilters';
import {
  applyFilters,
  buildFilterGroups,
  countActive,
  priceBounds,
  readFilters,
} from '~/lib/filters';

function Cards({products, wide}) {
  return (
    <div
      className={`grid [gap:var(--space-6)_var(--space-4)] [grid-template-columns:repeat(2,1fr)] min-[768px]:[grid-template-columns:repeat(3,1fr)] ${
        wide ? 'min-[1280px]:[grid-template-columns:repeat(4,1fr)]' : 'min-[1280px]:[grid-template-columns:repeat(3,1fr)]'
      }`}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

function FilterableGrid({products}) {
  const [sp, setSp] = useSearchParams();
  const [drawer, setDrawer] = useState(false);

  const groups = useMemo(() => buildFilterGroups(products), [products]);
  const bounds = useMemo(() => priceBounds(products), [products]);
  const filters = readFilters(sp, groups);
  const active = countActive(filters);
  const shown = useMemo(() => applyFilters(products, filters), [products, sp]);

  const commit = (next) => setSp(next, {replace: true, preventScrollReset: true});

  const update = (key, value) => {
    const next = new URLSearchParams(sp);
    if (value == null || value === '' || value === 'featured') next.delete(key);
    else next.set(key, value);
    commit(next);
  };

  const toggleValue = (id, value) => {
    const next = new URLSearchParams(sp);
    const current = next.getAll(id);
    next.delete(id);
    (current.includes(value) ? current.filter((v) => v !== value) : [...current, value]).forEach(
      (v) => next.append(id, v),
    );
    commit(next);
  };

  const clearAll = () => {
    const next = new URLSearchParams(sp);
    [...groups.map((g) => g.id), 'stock', 'sale', 'min', 'max'].forEach((k) => next.delete(k));
    commit(next);
  };

  const chips = [
    ...Object.entries(filters.picked).flatMap(([id, vals]) =>
      vals.map((v) => ({key: `${id}-${v}`, label: v, remove: () => toggleValue(id, v)})),
    ),
    filters.stock && {key: 'stock', label: 'In stock', remove: () => update('stock', null)},
    filters.sale && {key: 'sale', label: 'On sale', remove: () => update('sale', null)},
    filters.min != null && {key: 'min', label: `From ${filters.min}`, remove: () => update('min', null)},
    filters.max != null && {key: 'max', label: `Up to ${filters.max}`, remove: () => update('max', null)},
  ].filter(Boolean);

  const panel = (
    <FilterPanel
      groups={groups}
      bounds={bounds}
      filters={filters}
      update={update}
      toggleValue={toggleValue}
    />
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-[var(--color-line)] pb-5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="rounded-sm border border-[var(--color-ink)] px-5 py-2.5 text-[.72rem] font-semibold uppercase tracking-[.14em] transition hover:bg-[var(--color-ink)] hover:text-white lg:hidden"
          >
            Filters{active ? ` (${active})` : ''}
          </button>
          <span className="text-[.85rem] text-[var(--color-muted)]">
            {shown.length} {shown.length === 1 ? 'product' : 'products'}
          </span>
        </div>
        <SortSelect value={filters.sort} onChange={(v) => update('sort', v)} />
      </div>

      {/* Active chips */}
      {chips.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={c.remove}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-[.78rem] text-emerald-800 transition hover:border-emerald-600"
            >
              {c.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="ml-1 text-[.75rem] uppercase tracking-[.12em] text-[var(--color-muted)] underline underline-offset-4 transition hover:text-[var(--color-ink)]"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
        {/* Desktop sidebar */}
        <aside className="hidden lg:sticky lg:top-[6.5rem] lg:block lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
          {panel}
        </aside>

        <div className="min-w-0">
          {shown.length ? (
            <Cards products={shown} />
          ) : (
            <div className="border border-dashed border-[var(--color-line)] px-6 py-20 text-center">
              <p className="m-0 text-[1.15rem] text-[var(--color-ink)]">No products match these filters.</p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 rounded-sm border border-[var(--color-ink)] px-6 py-3 text-[.72rem] font-semibold uppercase tracking-[.14em] transition hover:bg-[var(--color-ink)] hover:text-white"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(92vw,380px)] flex-col bg-[var(--color-bg)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-5">
              <span className="text-[.85rem] font-bold uppercase tracking-[.16em]">Filters</span>
              <button type="button" onClick={() => setDrawer(false)} aria-label="Close" className="text-2xl font-light">
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6">{panel}</div>
            <div className="flex gap-3 border-t border-[var(--color-line)] p-5">
              <button
                type="button"
                onClick={clearAll}
                className="flex-1 rounded-sm border border-[var(--color-line)] py-3.5 text-[.72rem] font-semibold uppercase tracking-[.14em]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="flex-[2] rounded-sm bg-[var(--color-ink)] py-3.5 text-[.72rem] font-semibold uppercase tracking-[.14em] text-white"
              >
                Show {shown.length} products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductGrid({products, filterable = true}) {
  if (!products?.length) return <p className="[color:var(--color-muted)]">No products found.</p>;
  if (!filterable) return <Cards products={products} wide />;
  return <FilterableGrid products={products} />;
}