import {useEffect, useRef, useState} from 'react';

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

/* Accepts plain images ({url}) and videos:
 *  - file video:     {type:'video', sources:[{url}], previewImage:{url}}  (or {type:'video', url, poster})
 *  - YouTube/Vimeo:  {type:'external_video', embedUrl, previewImage:{url}}
 */
function normalize(m) {
  if (!m) return null;
  const type = String(m.type || m.mediaContentType || '').toLowerCase();
  const poster = m.poster || m.previewImage?.url;
  if (type === 'video' || m.sources) {
    const src = m.sources?.[0]?.url || m.url;
    return src ? {...m, kind: 'video', src, poster} : null;
  }
  if (type === 'external_video' || m.embedUrl) {
    return m.embedUrl ? {...m, kind: 'embed', src: m.embedUrl, poster} : null;
  }
  return m.url ? {...m, kind: 'image', poster: m.url} : null;
}

function Player({item, title}) {
  if (item.kind === 'embed') {
    return (
      <iframe
        key={item.src}
        src={item.src}
        title={`${title} video`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    );
  }
  return (
    <video
      key={item.src}
      src={item.src}
      poster={item.poster}
      controls
      playsInline
      preload="metadata"
      className="h-full w-full bg-black object-contain"
    />
  );
}

/* hotspots: [{image: 0, x: 42, y: 30, title: 'Power recline', text: '...'}]  (x/y = % of the photo; image = index in images, default 0)
 * An image object can also carry its own `hotspots` array. */
export function ProductGallery({images = [], title = 'Product', hotspots = []}) {
  const usableImages = images.map(normalize).filter(Boolean);
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openSpot, setOpenSpot] = useState(null);
  const [frameEl, setFrameEl] = useState(null);
  const [frame, setFrame] = useState({w: 0, h: 0});
  const [nat, setNat] = useState(null);

  const railRef = useRef(null);

  useEffect(() => setOpenSpot(null), [active]);

  // keep the active thumbnail visible inside the (horizontally) scrolling strip
  useEffect(() => {
    railRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({block: 'nearest', inline: 'nearest', behavior: 'smooth'});
  }, [active]);

  // Track the photo frame size so dots stay glued to the right spot even when object-cover crops the image.
  useEffect(() => {
    if (!frameEl) return undefined;
    const ro = new ResizeObserver(([e]) => setFrame({w: e.contentRect.width, h: e.contentRect.height}));
    ro.observe(frameEl);
    return () => ro.disconnect();
  }, [frameEl]);

  const onImg = (el) => {
    if (el?.complete && el.naturalWidth) {
      setNat((p) => (p && p.w === el.naturalWidth && p.h === el.naturalHeight ? p : {w: el.naturalWidth, h: el.naturalHeight}));
    }
  };

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

  const spots =
    current.kind === 'image'
      ? (Array.isArray(current.hotspots)
          ? current.hotspots
          : (Array.isArray(hotspots) ? hotspots : []).filter((h) => (h.image ?? 0) === active)
        ).filter((h) => Number.isFinite(h?.x) && Number.isFinite(h?.y) && h.title)
      : [];

  const place = (s) => {
    if (!frame.w || !frame.h || !nat) return null;
    const k = Math.max(frame.w / nat.w, frame.h / nat.h); // object-cover scale
    const dw = nat.w * k;
    const dh = nat.h * k;
    const left = (frame.w - dw) / 2 + (s.x / 100) * dw;
    const top = (frame.h - dh) / 2 + (s.y / 100) * dh;
    if (left < 0 || top < 0 || left > frame.w || top > frame.h) return null; // cropped out at this size
    return {left: (left / frame.w) * 100, top: (top / frame.h) * 100};
  };

  return (
    <div className="min-w-0">
      {/* Main Layout: Thumbnails + Main View */}
      <div
        className={
          usableImages.length > 1
            ? 'grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-4'
            : 'block'
        }
      >
        {/* Thumbnail rail */}
        {usableImages.length > 1 && (
          <div
            ref={railRef}
            className="order-2 flex min-w-0 snap-x flex-row gap-2.5 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:order-1 sm:max-h-[420px] sm:snap-none sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:pb-0 sm:pr-1 lg:max-h-[min(calc(100vh-14rem),540px)]"
          >
            {usableImages.map((image, index) => (
              <button
                key={`${image.url ?? image.src}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(index)}
                aria-current={index === active ? 'true' : undefined}
                aria-label={`Show image ${index + 1}`}
                className={`
                  relative h-[64px] w-[76px] shrink-0 snap-start overflow-hidden rounded-sm border bg-[var(--color-sand)] p-0 transition-all duration-200
                  sm:h-[84px] sm:w-[76px]
                  ${
                    index === active
                      ? 'border-[var(--color-ink)] ring-1 ring-[var(--color-ink)] opacity-100 shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }
                `}
              >
                {image.poster && (
                  <img
                    src={image.poster}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
                {image.kind !== 'image' && (
                  <span className="absolute inset-0 grid place-items-center bg-black/25 text-white">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-black/60 text-[.6rem]">▶</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Main active image: actions float on top, height capped to viewport */}
        <div ref={setFrameEl} className="relative order-1 min-w-0 sm:order-2">
          {current.kind === 'image' ? (
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={`View ${title} image larger`}
            className="group relative block w-full min-w-0 cursor-zoom-in overflow-hidden rounded-sm border-0 bg-[var(--color-sand)] p-0 text-left shadow-sm"
          >
            <img
              src={current.url}
              alt={current.alt || title}
              width={current.width || 1600}
              height={current.height || 1200}
              fetchPriority="high"
              ref={onImg}
              onLoad={(e) => onImg(e.currentTarget)}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] lg:aspect-auto lg:h-[min(calc(100vh-14rem),540px)] lg:min-h-[380px]"
            />

            {usableImages.length > 1 && (
              <span className="absolute bottom-3 left-3 rounded-sm bg-black/60 px-3 py-1 text-[0.65rem] font-medium tracking-[0.12em] text-white backdrop-blur-md">
                {active + 1} / {usableImages.length}
              </span>
            )}
          </button>
          ) : (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-black shadow-sm lg:aspect-auto lg:h-[min(calc(100vh-14rem),540px)] lg:min-h-[380px]">
              <Player item={current} title={title} />
              {usableImages.length > 1 && (
              <span className="pointer-events-none absolute left-3 top-3 rounded-sm bg-black/60 px-3 py-1 text-[0.65rem] font-medium tracking-[0.12em] text-white backdrop-blur-md">
                {active + 1} / {usableImages.length}
              </span>
              )}
            </div>
          )}

          {/* Hotspots: pulsing dots, details on hover / tap */}
          {spots.length > 0 && (
            <div className="pointer-events-none absolute inset-0 z-[3]">
              {spots.map((s, i) => {
                const p = place(s);
                if (!p) return null;
                const open = openSpot === i;
                const side = p.left > 55 ? 'right-full mr-3' : 'left-full ml-3';
                const vert = p.top < 25 ? 'top-0' : p.top > 75 ? 'bottom-0' : 'top-1/2 -translate-y-1/2';
                return (
                  <div
                    key={`${s.title}-${i}`}
                    style={{left: `${p.left}%`, top: `${p.top}%`}}
                    className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 ${open ? 'z-10' : ''}`}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setOpenSpot(i)}
                    onPointerLeave={(e) => e.pointerType === 'mouse' && setOpenSpot(null)}
                  >
                    <button
                      type="button"
                      aria-label={s.title}
                      aria-expanded={open}
                      onClick={(e) =>
                        setOpenSpot((o) => (o === i && e.nativeEvent.pointerType !== 'mouse' ? null : i))
                      }
                      onBlur={() => setOpenSpot((o) => (o === i ? null : o))}
                      className="relative grid h-7 w-7 place-items-center rounded-full bg-white/95 shadow-md ring-1 ring-black/10 transition hover:scale-110"
                    >
                      {!open && <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-white/70" />}
                      <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    </button>
                    {open && (
                      <div
                        role="tooltip"
                        className={`absolute w-56 rounded-sm bg-[var(--color-surface)] p-3.5 text-left shadow-xl ring-1 ring-black/10 ${side} ${vert}`}
                      >
                        <p className="m-0 text-[.72rem] font-bold uppercase tracking-[.14em] text-[var(--color-ink)]">{s.title}</p>
                        {s.text && (
                          <p className="mb-0 mt-1.5 text-[.82rem] leading-6 text-[var(--color-ink)]/80">{s.text}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="absolute right-3 top-3 z-[2] flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setSaved((v) => !v)}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[var(--color-ink)] shadow-sm backdrop-blur transition hover:bg-white [&_svg]:h-[18px] [&_svg]:w-[18px] ${saved ? '!bg-rose-50 !text-rose-600' : ''}`}
            >
              <Icon name="heart" />
            </button>
            <button type="button" onClick={() => setZoomed(true)} aria-label="Open product image viewer" className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[var(--color-ink)] shadow-sm backdrop-blur transition hover:bg-white [&_svg]:h-[18px] [&_svg]:w-[18px]">
              <Icon name="zoom" />
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
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[var(--color-ink)] shadow-sm backdrop-blur transition hover:bg-white [&_svg]:h-[18px] [&_svg]:w-[18px]"
            >
              <Icon name="share" />
            </button>
          </div>
        </div>
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

          {current.kind === 'image' ? (
            <img
              src={current.url}
              alt={current.alt || title}
              className="max-h-[85vh] max-w-[94vw] rounded-sm object-contain shadow-2xl"
            />
          ) : (
            <div className="aspect-video max-h-[85vh] w-[min(94vw,1100px)] overflow-hidden rounded-sm shadow-2xl">
              <Player item={current} title={title} />
            </div>
          )}

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