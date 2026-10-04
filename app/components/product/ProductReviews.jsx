import {useMemo, useState} from 'react';

const STAR_PATH =
  'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8L12 2.5z';
const MIN_CARDS_PER_STRIP = 8;

const byDate = (a, b) => new Date(b.date) - new Date(a.date);

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

export function summarizeReviews(reviews = []) {
  const valid = reviews.filter((r) => r && r.rating >= 1 && r.rating <= 5);
  const dist = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
  valid.forEach((r) => {
    dist[Math.round(r.rating)] += 1;
  });
  const count = valid.length;
  const average = count ? valid.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  return {count, average, dist};
}

function StarRow({size, className}) {
  return (
    <span className={`flex w-max gap-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="shrink-0">
          <path d={STAR_PATH} fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

export function StarRating({value = 0, size = 16, className = ''}) {
  const pct = (Math.max(0, Math.min(5, value)) / 5) * 100;
  return (
    <span
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
      className={`relative inline-block ${className}`}
    >
      <StarRow size={size} className="text-stone-300" />
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{width: `${pct}%`}}>
        <StarRow size={size} className="text-amber-500" />
      </span>
    </span>
  );
}

export function RatingSummary({reviews = []}) {
  const {count, average} = summarizeReviews(reviews);

  return (
    <a
      href="#reviews"
      className="inline-flex items-center gap-2.5 text-[0.8rem] text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
    >
      {count ? (
        <>
          <StarRating value={average} size={15} />
          <span className="font-semibold text-[var(--color-ink)]">{average.toFixed(1)}</span>
          <span className="underline underline-offset-4">
            {count} {count === 1 ? 'review' : 'reviews'}
          </span>
        </>
      ) : (
        <span className="underline underline-offset-4">Be the first to review</span>
      )}
    </a>
  );
}

function RatingPicker({value, onChange}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div role="radiogroup" aria-label="Your rating" className="flex gap-1.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className={`transition-transform duration-200 ${n <= shown ? 'text-amber-500' : 'text-stone-300'} hover:scale-125`}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
            <path d={STAR_PATH} fill="currentColor" />
          </svg>
        </button>
      ))}
    </div>
  );
}

const inputCls =
  'w-full rounded-sm border border-[var(--color-line)] bg-[var(--color-bg)] px-4 py-3.5 text-[0.95rem] text-[var(--color-ink)] outline-none transition focus:border-[var(--color-ink)] focus:ring-1 focus:ring-[var(--color-ink)]';
const labelCls =
  'mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--color-muted)]';

function ReviewForm({onSubmit, onCancel}) {
  const [form, setForm] = useState({rating: 0, author: '', title: '', body: ''});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({...f, [key]: e.target.value}));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.rating) return setError('Please select a star rating.');
    if (!form.author.trim()) return setError('Please enter your name.');
    if (form.body.trim().length < 10) return setError('Please write at least 10 characters.');

    setError('');
    setBusy(true);
    try {
      await onSubmit({
        rating: form.rating,
        author: form.author.trim(),
        title: form.title.trim(),
        body: form.body.trim(),
      });
    } catch {
      setError('Could not submit your review. Please try again.');
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="mb-14 space-y-6 rounded-sm border border-[var(--color-line)] bg-[var(--color-surface)] p-8 shadow-sm sm:p-10"
    >
      <div>
        <span className={labelCls}>Your Rating</span>
        <RatingPicker value={form.rating} onChange={(rating) => setForm((f) => ({...f, rating}))} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>Name</span>
          <input value={form.author} onChange={set('author')} maxLength={60} placeholder="Jane Doe" className={inputCls} />
        </label>
        <label className="block">
          <span className={labelCls}>Review Title (Optional)</span>
          <input value={form.title} onChange={set('title')} maxLength={100} placeholder="Absolute favorite piece" className={inputCls} />
        </label>
      </div>

      <label className="block">
        <span className={labelCls}>Your Review</span>
        <textarea value={form.body} onChange={set('body')} rows={4} maxLength={2000} placeholder="Share how it looks, feels, and fits in your space..." className={inputCls} />
      </label>

      {error && (
        <p role="alert" className="m-0 text-[0.88rem] font-medium text-rose-600">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-4 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-sm border border-[var(--color-ink)] bg-[var(--color-ink)] px-8 py-3.5 text-[0.74rem] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-stone-800 disabled:opacity-50"
        >
          {busy ? 'Submitting…' : 'Submit Review'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-sm border border-[var(--color-line)] px-8 py-3.5 text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] transition hover:border-[var(--color-ink)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/* One card in the marquee. `offset` pushes it down to create the zigzag. */
function ReviewCard({review, voted, onVote, offset}) {
  const helpful = (review.helpful ?? 0) + (voted ? 1 : 0);
  const initials = (review.author || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <article
      className={`relative flex min-h-[270px] w-[300px] shrink-0 flex-col rounded-sm border border-[var(--color-line)] bg-[var(--color-surface)] p-6 shadow-sm transition-shadow duration-300 hover:shadow-[0_18px_40px_rgba(15,36,23,.12)] sm:w-[360px] sm:p-7 ${
        offset ? 'mt-14 sm:mt-20' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-3 font-display text-[4.5rem] leading-none text-emerald-600/15"
      >
        “
      </span>

      <div className="flex items-center justify-between gap-3">
        <StarRating value={review.rating} size={14} />
        {review.verified && (
          <span className="rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-emerald-800">
            Verified
          </span>
        )}
      </div>

      {review.title && (
        <h3 className="mt-4 text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--color-ink)]">
          {review.title}
        </h3>
      )}

      <p className="mt-2.5 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5] overflow-hidden whitespace-pre-line text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
        {review.body}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-ink)] text-[0.7rem] font-semibold tracking-wide text-white"
          >
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[0.82rem] font-semibold text-[var(--color-ink)]">
              {review.author}
            </span>
            <time dateTime={review.date} className="block text-[0.7rem] text-[var(--color-muted)]">
              {formatDate(review.date)}
            </time>
          </span>
        </div>

        <button
          type="button"
          onClick={onVote}
          aria-pressed={voted}
          className={`shrink-0 text-[0.66rem] font-semibold uppercase tracking-[0.12em] transition-colors ${
            voted ? 'text-emerald-700' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
          }`}
        >
          Helpful{helpful > 0 ? ` (${helpful})` : ''}
        </button>
      </div>
    </article>
  );
}

const MARQUEE_CSS = `
@keyframes rv-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.rv-wrap {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 4%, #000 96%, transparent);
}
.rv-wrap:hover .rv-track, .rv-wrap:focus-within .rv-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .rv-wrap { overflow-x: auto; }
  .rv-track { animation: none !important; }
}
`;

export function ProductReviews({reviews = [], productTitle = 'this product', content = {}, onSubmitReview}) {
  const [local, setLocal] = useState([]);
  const [star, setStar] = useState(0);
  const [voted, setVoted] = useState(() => new Set());
  const [showForm, setShowForm] = useState(false);
  const [thanks, setThanks] = useState('');

  const all = useMemo(() => [...local, ...reviews.filter(Boolean)], [local, reviews]);
  const {count, average, dist} = useMemo(() => summarizeReviews(all), [all]);
  const positivePct = count ? Math.round(((dist[5] + dist[4]) / count) * 100) : 0;

  const list = useMemo(
    () => all.filter((r) => !star || Math.round(r.rating) === star).sort(byDate),
    [all, star],
  );

  /* One "strip" = enough cards (even number, for a clean zigzag) to be wider than the screen.
     It is rendered twice and the track slides -50% for a seamless infinite loop. */
  const strip = useMemo(() => {
    if (!list.length) return [];
    const times = Math.max(1, Math.ceil(MIN_CARDS_PER_STRIP / list.length));
    let items = Array.from({length: times}, () => list).flat();
    if (items.length % 2) items = [...items, ...items];
    return items;
  }, [list]);

  const duration = Math.max(40, strip.length * 6);

  const toggleVote = (id) =>
    setVoted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSubmit = async (data) => {
    if (onSubmitReview) {
      await onSubmitReview(data);
      setThanks('Thank you! Your review will appear once it has been approved.');
    } else {
      setLocal((prev) => [
        {...data, id: `local-${Date.now()}`, date: new Date().toISOString(), helpful: 0, verified: true},
        ...prev,
      ]);
      setThanks('Thank you for sharing your experience!');
    }
    setShowForm(false);
  };

  return (
    <section id="reviews" className="scroll-mt-24 overflow-hidden border-t border-[var(--color-line)] bg-[var(--color-sand)]">
      <style>{MARQUEE_CSS}</style>

      <div className="mx-auto w-[calc(100%-2*var(--gutter))] max-w-[var(--container-wide)] pt-20 sm:pt-28 lg:pt-32">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="block text-[0.7rem] font-bold uppercase tracking-[0.2em] text-emerald-800">
              {content.reviewsEyebrow || 'Customer Feedback'}
            </span>
            <h2 className="mt-3 font-display text-[clamp(2.5rem,4.5vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.03em]">
              {content.reviewsTitle || 'Ratings & Reviews'}
            </h2>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={() => {
                setThanks('');
                setShowForm(true);
              }}
              className="self-start rounded-sm border border-[var(--color-ink)] bg-[var(--color-surface)] px-7 py-3.5 text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[var(--color-ink)] shadow-sm transition hover:bg-[var(--color-ink)] hover:text-white sm:self-auto"
            >
              Write a Review
            </button>
          )}
        </div>

        {showForm && <ReviewForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />}

        {thanks && (
          <p
            role="status"
            className="mb-12 rounded-sm border border-emerald-200 bg-emerald-50 px-6 py-4 text-[0.92rem] font-medium text-emerald-900 shadow-sm"
          >
            {thanks}
          </p>
        )}

        {count === 0 ? (
          <div className="mb-20 rounded-sm border border-dashed border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-20 text-center shadow-sm sm:mb-28">
            <p className="m-0 text-[1.15rem] font-medium text-[var(--color-ink)]">No reviews yet for {productTitle}.</p>
            <p className="mx-auto mt-2.5 max-w-[40ch] text-[0.95rem] text-[var(--color-muted)]">
              Be the first to share how this piece feels and looks in your home.
            </p>
          </div>
        ) : (
          /* Wide summary card: score on the left, clickable star breakdown on the right */
          <div className="grid grid-cols-1 items-center gap-8 rounded-sm border border-[var(--color-line)] bg-[var(--color-surface)] p-8 shadow-sm sm:p-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div className="flex flex-col gap-5 border-b border-[var(--color-line)] pb-8 sm:flex-row sm:items-center sm:gap-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-12">
              <span className="font-display text-[5rem] font-medium leading-none tracking-[-0.04em] sm:text-[6rem]">
                {average.toFixed(1)}
              </span>
              <div>
                <StarRating value={average} size={22} />
                <span className="mt-3 block text-[0.85rem] font-medium text-[var(--color-ink)]">
                  Based on {count} {count === 1 ? 'review' : 'reviews'}
                </span>
                <span className="mt-1 block text-[0.78rem] text-[var(--color-muted)]">
                  {positivePct}% rated this 4 stars or higher
                </span>
              </div>
            </div>

            <div>
              <ul className="m-0 list-none space-y-2.5 p-0">
                {[5, 4, 3, 2, 1].map((n) => {
                  const active = star === n;
                  const pct = count ? (dist[n] / count) * 100 : 0;
                  return (
                    <li key={n}>
                      <button
                        type="button"
                        disabled={!dist[n]}
                        aria-pressed={active}
                        aria-label={`Show ${n} star reviews (${dist[n]})`}
                        onClick={() => setStar(active ? 0 : n)}
                        className={`grid w-full grid-cols-[3.2rem_minmax(0,1fr)_2rem] items-center gap-4 rounded-sm px-2 py-1 text-[0.82rem] transition disabled:cursor-default disabled:opacity-40 ${
                          active
                            ? 'bg-emerald-50 font-bold text-emerald-800'
                            : 'text-[var(--color-muted)] enabled:hover:bg-[var(--color-sand)] enabled:hover:text-[var(--color-ink)]'
                        }`}
                      >
                        <span className="text-left">{n} Star</span>
                        <span className="h-2 overflow-hidden rounded-full bg-[var(--color-line)]">
                          <span
                            className="block h-full rounded-full bg-amber-500 transition-all duration-500"
                            style={{width: `${pct}%`}}
                          />
                        </span>
                        <span className="text-right">{dist[n]}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {star > 0 && (
                <button
                  type="button"
                  onClick={() => setStar(0)}
                  className="mt-5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--color-muted)] underline underline-offset-4 transition hover:text-[var(--color-ink)]"
                >
                  Clear {star}-star filter
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Full-width zigzag marquee (edge to edge, outside the container) */}
      {count > 0 && (
        <div className="pb-20 pt-12 sm:pb-28 sm:pt-16 lg:pb-32">
          <div className="rv-wrap w-full overflow-hidden py-4">
            <div
              className="rv-track flex w-max"
              style={{animation: `rv-marquee ${duration}s linear infinite`}}
            >
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  aria-hidden={copy === 1 ? 'true' : undefined}
                  className="flex shrink-0 items-start gap-6 pr-6"
                >
                  {strip.map((review, i) => (
                    <ReviewCard
                      key={`${copy}-${i}-${review.id ?? review.author}`}
                      review={review}
                      voted={voted.has(review.id)}
                      onVote={() => toggleVote(review.id)}
                      offset={i % 2 === 1}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Hover to pause
            {star ? ` · showing ${star}-star reviews` : ''}
          </p>
        </div>
      )}
    </section>
  );
}