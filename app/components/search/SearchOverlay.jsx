import {useEffect, useRef, useState} from 'react';
import {useFetcher, useNavigate} from 'react-router';
import {ArrowIcon, CloseIcon, SearchIcon} from '~/components/ui/Icons';
import {useHrefs} from '~/components/layout/NavContext';
import {formatMoney} from '~/lib/format';

const KEY = 'klaussner:recent';

export function SearchOverlay({open, onClose}) {
  const f = useFetcher();
  const navigate = useNavigate();
  const {productHref, collectionHref} = useHrefs();
  const input = useRef(null);
  const [q, setQ] = useState('');
  const [i, setI] = useState(-1);
  const [recent, setRecent] = useState([]);
  const [closing, setClosing] = useState(false);
  const term = q.trim();
  const active = term.length >= 2;

  useEffect(() => {
    if (open) {
      try {
        setRecent(JSON.parse(localStorage.getItem(KEY) || '[]'));
      } catch {}
      setTimeout(() => input.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      setQ('');
      setI(-1);
      document.body.style.overflow = '';
    }
  }, [open]);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => f.load(`/api/search?q=${encodeURIComponent(term)}`), 180);
    return () => clearTimeout(t);
  }, [term]); // eslint-disable-line react-hooks/exhaustive-deps

  const data = active ? f.data : null;
  const loading = active && (f.state !== 'idle' || !data);
  const cats = (data?.collections ?? []).map((c) => ({
    to: collectionHref(c.handle),
    label: c.title,
    kind: 'Category',
  }));
  const prods = (data?.products ?? []).map((p) => ({
    to: productHref(p),
    label: p.title,
    kind: 'Product',
    price: p.price,
    img: p.images?.[0]?.url,
    avail: p.availableForSale,
  }));
  const items = [...cats, ...prods];

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  };

  const go = (to) => {
    onClose();
    navigate(to);
  };

  const submit = (t) => {
    if (!t.trim()) return;
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify([t, ...recent.filter((r) => r !== t)].slice(0, 5)),
      );
    } catch {}
    go(`/search?q=${encodeURIComponent(t)}`);
  };

  const onKey = (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setI((x) => Math.min(x + 1, items.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setI((x) => Math.max(x - 1, -1));
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      items[i] ? go(items[i].to) : submit(q);
    }
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center bg-stone-950/80 p-4 pt-[15vh] backdrop-blur-xl transition-opacity duration-200 sm:p-6 md:pt-[18vh] ${
        closing ? 'opacity-0' : 'opacity-100 animate-fadeIn'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
      onKeyDown={onKey}
    >
      {/* Centered Search Container */}
      <div className="w-full max-w-3xl">
        {/* Premium Floating Search Input Bar */}
        <div className="relative flex items-center gap-3 rounded-full border border-stone-700/60 bg-stone-900/90 px-6 py-4 shadow-2xl backdrop-blur-md transition-all focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-white/10">
          <SearchIcon className="h-5 w-5 shrink-0 text-stone-400" />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setI(-1);
            }}
            placeholder="Search sofas, recliners, dining..."
            aria-label="Search"
            role="combobox"
            aria-expanded={items.length > 0}
            aria-controls="search-results"
            autoComplete="off"
            className="w-full bg-transparent text-lg font-medium text-white placeholder-stone-500 outline-none sm:text-xl"
          />
          {q && (
            <button
              type="button"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-stone-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Clear search"
              onClick={() => {
                setQ('');
                input.current?.focus();
              }}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            className="rounded-md border border-stone-700 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-stone-400 transition hover:border-stone-500 hover:text-white"
            onClick={close}
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        {/* Results Container Area (Only shows when user types 2+ characters) */}
        {active && (
          <div className="mt-6 max-h-[60vh] overflow-y-auto rounded-xl bg-stone-900/90 p-6 text-white shadow-2xl backdrop-blur-md border border-stone-800/80 [scrollbar-width:none]">
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4" aria-busy="true">
                {[0, 1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="aspect-[4/3] rounded-lg bg-stone-800 animate-pulse"
                  />
                ))}
              </div>
            ) : items.length === 0 ? (
              <p className="py-8 text-center text-sm text-stone-400">
                No results found for “{term}”.
              </p>
            ) : (
              <div id="search-results" role="listbox" className="space-y-6">
                {cats.length > 0 && (
                  <div>
                    <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-stone-400">
                      Categories
                    </p>
                    <div className="grid gap-1">
                      {cats.map((c, n) => (
                        <a
                          key={c.to}
                          href={c.to}
                          role="option"
                          aria-selected={n === i}
                          className={`flex items-center justify-between rounded-lg px-4 py-3 font-display text-lg transition hover:bg-stone-800 ${
                            n === i ? 'bg-stone-800' : ''
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            go(c.to);
                          }}
                        >
                          <span>{c.label}</span>
                          <ArrowIcon className="h-4 w-4 text-stone-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {prods.length > 0 && (
                  <div>
                    <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-stone-400">
                      Products
                    </p>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {prods.map((p, n) => {
                        const idx = cats.length + n;
                        return (
                          <a
                            key={p.to}
                            href={p.to}
                            role="option"
                            aria-selected={idx === i}
                            className={`group grid gap-2 rounded-lg bg-stone-800/40 p-3 transition hover:bg-stone-800 hover:shadow-xl ${
                              idx === i ? 'bg-stone-800 ring-1 ring-stone-400' : ''
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              go(p.to);
                            }}
                          >
                            <span className="aspect-[4/3] w-full overflow-hidden rounded-md bg-stone-800">
                              {p.img && (
                                <img
                                  src={p.img}
                                  alt=""
                                  loading="lazy"
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              )}
                            </span>
                            <span className="font-display text-base leading-tight text-stone-100">
                              {p.label}
                            </span>
                            <span className="text-xs font-medium text-stone-400">
                              {p.avail ? formatMoney(p.price) : 'Sold out'}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="w-full rounded-lg bg-white py-3.5 text-center text-xs font-bold uppercase tracking-[0.14em] text-stone-950 transition hover:bg-stone-200"
                  onClick={() => submit(term)}
                >
                  View all results for “{term}” →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}