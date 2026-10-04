import {useRef} from 'react';
import {Link} from 'react-router';
import {ProductCard} from '~/components/product/ProductCard';

export function ProductMore({products = [], eyebrow, title = 'More to explore', href}) {
  const rail = useRef(null);

  if (!products.length) return null;

  const scroll = (dir) =>
    rail.current?.scrollBy({left: dir * rail.current.clientWidth * 0.8, behavior: 'smooth'});

  const arrow =
    'grid h-12 w-12 place-items-center rounded-full border border-[var(--color-line)] text-lg transition hover:border-emerald-600 hover:bg-emerald-600 hover:text-white';

  return (
    <section className="mx-auto w-[calc(100%-2*var(--gutter))] max-w-[var(--container-wide)] border-t border-[var(--color-line)] py-20 sm:py-28">
      <div className="mb-10 flex items-end justify-between gap-6 sm:mb-14">
        <div>
          {eyebrow && (
            <span className="block text-[.78rem] font-semibold uppercase tracking-[.2em] text-emerald-600">
              {eyebrow}
            </span>
          )}
          <h2 className="mt-3 max-w-[14ch] font-display text-[clamp(2.8rem,5vw,5rem)] font-medium leading-[.92] tracking-[-.04em]">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {href && (
            <Link
              to={href}
              className="mr-2 hidden text-[.75rem] font-semibold uppercase tracking-[.14em] underline underline-offset-8 transition hover:text-emerald-700 sm:block"
            >
              Shop all
            </Link>
          )}
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous products" className={arrow}>
            ←
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Next products" className={arrow}>
            →
          </button>
        </div>
      </div>

      <div
        ref={rail}
        className="-mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <div key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[24%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {href && (
        <Link
          to={href}
          className="mt-8 block text-center text-[.75rem] font-semibold uppercase tracking-[.14em] underline underline-offset-8 sm:hidden"
        >
          Shop all
        </Link>
      )}
    </section>
  );
}