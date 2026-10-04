import {useEffect, useState} from 'react';

function Icon({name}) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (name === 'zoom') {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
        <path d="M11 8v6M8 11h6" />
      </svg>
    );
  }

  if (name === 'share') {
    return (
      <svg {...common}>
        <path d="M12 16V3" />
        <path d="m7 8 5-5 5 5" />
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
      </svg>
    );
  }

  if (name === 'heart') {
    return (
      <svg {...common}>
        <path d="M20.8 8.7c0 5.1-8.8 10.3-8.8 10.3S3.2 13.8 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
      </svg>
    );
  }

  return null;
}

export function ProductGallery({images = [], title = 'Product'}) {
  const usableImages = images.filter((image) => image?.url);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setActive(0);
  }, [images]);

  useEffect(() => {
    if (!zoomed) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setZoomed(false);
      if (event.key === 'ArrowRight') {
        setActive((v) => (v + 1) % usableImages.length);
      }
      if (event.key === 'ArrowLeft') {
        setActive((v) => (v - 1 + usableImages.length) % usableImages.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [zoomed, usableImages.length]);

  if (!usableImages.length) {
    return (
      <div className="grid min-h-[560px] place-items-center rounded-sm bg-[var(--color-sand)] text-sm text-[var(--color-muted)]">
        No image available
      </div>
    );
  }

  const current = usableImages[active] || usableImages[0];

  return (
    <div className="min-w-0">
      {/* Gallery Header Actions */}
      <div className="mb-4 flex items-center justify-end gap-3 sm:mb-5">
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`inline-flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.1em] transition-colors ${
            saved ? 'text-rose-600 bg-rose-50/50' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
          }`}
        >
          <Icon name="heart" />
          <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
        </button>

        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label="Open product image viewer"
          className="inline-flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
        >
          <Icon name="zoom" />
          <span className="hidden sm:inline">Zoom</span>
        </button>

        <button
          type="button"
          onClick={async () => {
            try {
              if (navigator.share) {
                await navigator.share({title, text: `View ${title}`});
              } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(window.location.href);
              }
            } catch {}
          }}
          aria-label="Share product"
          className="inline-flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
        >
          <Icon name="share" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Main Layout: Thumbnails + Main View */}
      <div
        className={
          usableImages.length > 1
            ? 'grid min-w-0 grid-cols-[72px_minmax(0,1fr)] gap-3.5 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-5'
            : 'block'
        }
      >
        {/* Thumbnail rail */}
        {usableImages.length > 1 && (
          <div className="flex max-h-[min(78vh,720px)] min-w-0 flex-col gap-2.5 overflow-y-auto pr-1">
            {usableImages.map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                aria-current={index === active ? 'true' : undefined}
                aria-label={`Show image ${index + 1}`}
                className={`
                  relative h-[80px] w-[72px] shrink-0 overflow-hidden rounded-sm border bg-[var(--color-sand)] p-0 transition-all duration-200
                  sm:h-[102px] sm:w-[92px]
                  ${
                    index === active
                      ? 'border-[var(--color-ink)] ring-1 ring-[var(--color-ink)] opacity-100 shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }
                `}
              >
                <img
                  src={image.url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main active image */}
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label={`View ${title} image larger`}
          className="group relative block min-w-0 overflow-hidden rounded-sm border-0 bg-[var(--color-sand)] p-0 text-left shadow-sm"
        >
          <img
            src={current.url}
            alt={current.alt || title}
            width={current.width || 1600}
            height={current.height || 1600}
            fetchPriority="high"
            className="aspect-[4/3] h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] sm:aspect-[1/1.04]"
          />

          {usableImages.length > 1 && (
            <span className="absolute bottom-3.5 right-3.5 rounded-sm bg-black/60 px-3 py-1 text-[0.65rem] font-medium tracking-[0.12em] text-white backdrop-blur-md">
              {active + 1} / {usableImages.length}
            </span>
          )}
        </button>
      </div>

      <p className="mt-3 text-[0.68rem] leading-relaxed text-[var(--color-muted)]">
        Photographs display the item accurately. Variations in color tone may occur depending on screen displays.
      </p>

      {/* Modern Lightbox Modal */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/90 p-4 backdrop-blur-lg sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image viewer`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setZoomed(false);
          }}
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Close image viewer"
            className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/5 text-2xl font-light text-white backdrop-blur-md transition hover:bg-white/10"
          >
            ×
          </button>

          <img
            src={current.url}
            alt={current.alt || title}
            className="max-h-[85vh] max-w-[94vw] rounded-sm object-contain shadow-2xl"
          />

          {usableImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs tracking-widest text-white backdrop-blur-md">
              <button
                type="button"
                onClick={() =>
                  setActive((v) => (v - 1 + usableImages.length) % usableImages.length)
                }
                className="transition hover:scale-110"
                aria-label="Previous image"
              >
                ← Prev
              </button>
              <span className="font-semibold">
                {active + 1} of {usableImages.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setActive((v) => (v + 1) % usableImages.length)
                }
                className="transition hover:scale-110"
                aria-label="Next image"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}