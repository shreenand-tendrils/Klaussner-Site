import {useMemo, useState} from 'react';

/* Footer/navbar wala same bg yahan daalo */
const SPECS_BG = 'bg-[var(--green-900)]';

function humanizeKey(key = '') {
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const isPlain = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/* Any single value -> readable string (never "[object Object]") */
function cell(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.map(cell).filter(Boolean).join(', ');
  if (isPlain(value)) return Object.values(value).map(cell).filter(Boolean).join(' · ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

/*
 * Detects table-shaped data and returns {columns, rows}, otherwise null.
 * Supported shapes:
 *  1. [{package, dimensions, weight}, ...]            (array of objects)
 *  2. {columns: [...], rows: [[...], ...]}            (columns + rows)
 *  3. {rows: [{cells: [...]}, ...]} or {rows: [[...]]} (first row = header)
 */
function toTable(value) {
  if (Array.isArray(value) && value.length && value.every(isPlain)) {
    const keys = [...new Set(value.flatMap((row) => Object.keys(row)))];
    return {
      columns: keys.map(humanizeKey),
      rows: value.map((row) => keys.map((k) => cell(row[k]))),
    };
  }

  if (isPlain(value) && Array.isArray(value.rows) && value.rows.length) {
    const rows = value.rows.map((r) => {
      if (Array.isArray(r)) return r;
      if (isPlain(r) && Array.isArray(r.cells)) return r.cells;
      if (isPlain(r)) return Object.values(r);
      return [r];
    });

    let columns = Array.isArray(value.columns) ? value.columns : null;
    let body = rows;
    if (!columns && rows.length > 1) [columns, ...body] = rows;

    return {
      columns: (columns ?? []).map(cell),
      rows: body.map((r) => r.map(cell)),
    };
  }

  return null;
}

function formatValue(value) {
  return cell(value);
}

const DIMENSION_RE = /(width|depth|height|length|diameter|weight|size|dimension|seat|arm|clearance|volume|capacity)/i;
const MATERIAL_RE = /(material|fabric|leather|wood|frame|finish|color|colour|cushion|fill|foam|upholstery|metal|leg|base|top|stone|glass|texture|pattern)/i;
const CARE_RE = /(care|clean|warranty|assembly|delivery|shipping|return|origin|made|certif|maintenance|instruction)/i;

const GROUPS = [
  {id: 'dimensions', title: 'Dimensions', re: DIMENSION_RE},
  {id: 'materials', title: 'Materials & Finish', re: MATERIAL_RE},
  {id: 'care', title: 'Care & Delivery', re: CARE_RE},
  {id: 'other', title: 'More Details', re: /.*/},
];

function groupEntries(entries) {
  const buckets = Object.fromEntries(GROUPS.map((g) => [g.id, []]));

  entries.forEach(([key, value]) => {
    const group = GROUPS.find((g) => g.re.test(key));
    // value is a table object ({columns, rows}) or a plain string
    buckets[group.id].push([key, toTable(value) ?? formatValue(value)]);
  });

  return GROUPS.map((g) => ({...g, items: buckets[g.id]})).filter(
    (g) => g.items.length,
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-6 w-6 shrink-0 transition-transform duration-300 group-open:rotate-180"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SpecTable({table}) {
  return (
    <div className="overflow-x-auto rounded-sm border border-white/15 print:border-black/20">
      <table className="w-full min-w-[420px] border-collapse text-left">
        {table.columns.length > 0 && (
          <thead>
            <tr className="bg-white/5">
              {table.columns.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className="whitespace-nowrap px-5 py-3.5 text-[.72rem] font-semibold uppercase tracking-[.14em] text-emerald-300 print:text-black"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {table.rows.map((row, r) => (
            <tr
              key={r}
              className="border-t border-white/15 transition-colors hover:bg-white/5 print:border-black/20"
            >
              {row.map((value, c) =>
                c === 0 ? (
                  <th
                    key={c}
                    scope="row"
                    className="px-5 py-4 text-left text-[1rem] font-semibold leading-snug sm:text-[1.05rem]"
                  >
                    {value}
                  </th>
                ) : (
                  <td key={c} className="px-5 py-4 text-[1rem] leading-snug text-white/80 print:text-black sm:text-[1.05rem]">
                    {value}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductSpecs({details, content = {}}) {
  const [expandAll, setExpandAll] = useState(false);

  const entries = useMemo(
    () =>
      details && typeof details === 'object'
        ? Object.entries(details).filter(
            ([, v]) => v !== undefined && v !== null && v !== '',
          )
        : [],
    [details],
  );

  const groups = useMemo(() => groupEntries(entries), [entries]);

  /* Quick-glance cards: simple values only (never tables/objects/lists) */
  const highlights = useMemo(
    () =>
      entries
        .filter(([key, value]) => DIMENSION_RE.test(key) && typeof value !== 'object')
        .slice(0, 4)
        .map(([key, value]) => ({label: humanizeKey(key), value: formatValue(value)})),
    [entries],
  );

  if (!entries.length) return null;

  return (
    <section
      id="product-specifications"
      className={`${SPECS_BG} text-white print:bg-white print:text-black`}
    >
      <div className="mx-auto grid w-[calc(100%-2*var(--gutter))] max-w-[var(--container-wide)] grid-cols-1 gap-12 py-20 sm:py-28 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.6fr)] lg:gap-20 lg:py-32 print:py-6">
        {/* Left: heading + actions */}
        <div className="lg:sticky lg:top-[6.5rem] lg:self-start">
          {content.detailsEyebrow && (
            <span className="block text-[.78rem] font-semibold uppercase tracking-[.2em] text-emerald-300">
              {content.detailsEyebrow}
            </span>
          )}

          <h2 className="mt-3 max-w-[10ch] font-display text-[clamp(3rem,5.5vw,5.6rem)] font-medium leading-[.9] tracking-[-.04em]">
            {content.detailsTitle || 'The Details'}
          </h2>

          <p className="mt-7 max-w-[36ch] text-[1.08rem] leading-relaxed text-white/70">
            {content.detailsText ||
              'Every measurement, material and finish, laid out clearly before you decide.'}
          </p>

          <div className="mt-9 flex flex-wrap gap-3 print:hidden">
            <button
              type="button"
              onClick={() => setExpandAll((v) => !v)}
              className="rounded-sm border border-white px-6 py-3.5 text-[.76rem] font-semibold uppercase tracking-[.14em] text-white transition hover:bg-white hover:text-[var(--color-ink)]"
            >
              {expandAll ? 'Collapse all' : 'Expand all'}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-sm border border-white/25 px-6 py-3.5 text-[.76rem] font-semibold uppercase tracking-[.14em] text-white/70 transition hover:border-white hover:text-white"
            >
              Print specs
            </button>
          </div>
        </div>

        {/* Right: quick glance + grouped specs */}
        <div className="min-w-0">
          {highlights.length > 0 && (
            <div className="mb-12 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/15 bg-white/15 sm:grid-cols-4">
              {highlights.map((item) => (
                <div key={item.label} className={`${SPECS_BG} p-6 sm:p-7`}>
                  <span className="block text-[.72rem] font-semibold uppercase tracking-[.16em] text-emerald-300">
                    {item.label}
                  </span>
                  <span className="mt-4 block font-display text-[1.9rem] font-medium leading-none tracking-[-.02em] sm:text-[2.2rem]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-white/60">
            {groups.map((group, index) => (
              <details
                key={`${group.id}-${expandAll}`}
                open={expandAll || index === 0}
                className="group border-b border-white/15"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 marker:hidden [&::-webkit-details-marker]:hidden">
                  <span className="flex items-baseline gap-5">
                    <span className="font-mono text-[.82rem] tracking-[.2em] text-emerald-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[1rem] font-bold uppercase tracking-[.16em] sm:text-[1.1rem]">
                      {group.title}
                    </span>
                  </span>
                  <span className="flex items-center gap-4 text-white/60">
                    <span className="hidden text-[.74rem] uppercase tracking-[.12em] sm:inline">
                      {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                    </span>
                    <Chevron />
                  </span>
                </summary>

                <dl className="pb-7">
                  {group.items.map(([key, value]) => {
                    const isTable = typeof value !== 'string';

                    return (
                      <div
                        key={key}
                        className={`grid grid-cols-1 border-t border-dashed border-white/15 py-5 sm:px-4 ${
                          isTable
                            ? 'gap-4'
                            : 'gap-1.5 transition-colors hover:bg-white/5 sm:grid-cols-[minmax(0,.9fr)_minmax(0,1.4fr)] sm:gap-8'
                        }`}
                      >
                        <dt className="text-[.8rem] font-semibold uppercase tracking-[.16em] text-white/60">
                          {humanizeKey(key)}
                        </dt>
                        <dd className="m-0 min-w-0 text-[1.15rem] leading-snug sm:text-[1.25rem]">
                          {isTable ? <SpecTable table={value} /> : value}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}