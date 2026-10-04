import {Link} from 'react-router';
import {useHrefs} from '~/components/layout/NavContext';

export function CollectionGrid({collections}) {
  const {collectionHref} = useHrefs();
  if (!collections?.length) return null;

  return (
    <div className="grid grid-cols-2 gap-x-[var(--space-4)] gap-y-[var(--space-6)] md:grid-cols-3 xl:grid-cols-4">
      {collections.map((c) => (
        <Link
          key={c.handle}
          to={collectionHref(c.handle)}
          prefetch="intent"
          className="group block"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-line)]">
            {c.image && (
              <img
                src={c.image}
                alt=""
                width={1200}
                height={900}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <h3 className="m-0 text-[1.05rem] font-medium tracking-[-.01em] sm:text-[1.15rem]">
              {c.title}
            </h3>
            <span
              aria-hidden="true"
              className="text-lg text-[var(--color-muted)] transition duration-300 group-hover:translate-x-1.5 group-hover:text-emerald-700"
            >
              →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}