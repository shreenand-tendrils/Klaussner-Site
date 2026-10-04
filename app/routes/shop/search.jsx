import {Form, useLoaderData} from 'react-router';
import {getProducts} from '~/lib/data';
import {ProductGrid} from '~/components/product/ProductGrid';

export const meta = () => [{title: 'Search | Klaussner'}, {name: 'robots', content: 'noindex'}];

export async function loader({request, context}) {
  const q = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  const {products, total} = q ? await getProducts(context, {q, limit: 48}) : {products: [], total: 0};
  return {q, products, total};
}

export default function Search() {
  const {q, products, total} = useLoaderData();
  return (
    <div className="mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] [padding-block:var(--section-y)]">
      <h1>Search</h1>
      <Form method="get" role="search" className="flex [gap:1rem] justify-between items-center [margin-block:var(--space-6)] flex-wrap [&_select]:[padding:.5rem] [&_select]:[font:inherit] [&_select]:[background:#fff] [&_select]:[border:1px_solid_var(--color-line)] [&_input[type=checkbox]]:[accent-color:var(--green-800)]">
        <input name="q" defaultValue={q} placeholder="Search furniture" aria-label="Search" className="flex-1 p-[.8rem] [font:inherit]" />
        <button type="submit" className="inline-flex items-center justify-center [padding:.9rem_1.8rem] [border:1px_solid_var(--green-800)] [border-radius:var(--radius-btn)] [background:var(--green-800)] [color:#fff] [font:inherit] [font-size:.78rem] [letter-spacing:.12em] uppercase cursor-pointer [transition:var(--transition)] [&:hover]:[background:var(--green-700)] [&:hover]:[border-color:var(--green-700)] [&[disabled]]:[opacity:.4] [&[disabled]]:pointer-events-none [.hero__cta_&]:[padding:.9rem_2.2rem] [.sec--green_&:not(.btn--ghost)]:[background:#fff] [.sec--green_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--green_&:not(.btn--ghost)]:[border-color:#fff] [.sec--dark_&:not(.btn--ghost)]:[background:#fff] [.sec--dark_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--dark_&:not(.btn--ghost)]:[border-color:#fff] [.ibanner_&:not(.btn--ghost)]:[background:#fff] [.ibanner_&:not(.btn--ghost)]:[color:var(--green-900)] [.ibanner_&:not(.btn--ghost)]:[border-color:#fff]">Search</button>
      </Form>
      {q && <p className="[color:var(--color-muted)]" aria-live="polite">{total} results for “{q}”</p>}
      <ProductGrid products={products} />
    </div>
  );
}