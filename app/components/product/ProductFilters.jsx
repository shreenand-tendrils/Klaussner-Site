import {SORTS} from '~/lib/filters';

function Check({checked, label, count, onChange}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-2 text-[.95rem] text-[var(--color-ink)] transition hover:text-emerald-700">
      <span className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 cursor-pointer accent-emerald-600"
        />
        {label}
      </span>
      {count != null && <span className="text-[.75rem] text-[var(--color-muted)]">{count}</span>}
    </label>
  );
}

function SwatchGrid({values, picked, onToggle}) {
  return (
    <div className="flex flex-wrap gap-3 py-1">
      {values.map(({value, count, color}) => {
        const active = picked.includes(value);
        return (
          <button
            key={value}
            type="button"
            title={`${value} (${count})`}
            aria-label={value}
            aria-pressed={active}
            onClick={() => onToggle(value)}
            style={{backgroundColor: color}}
            className={`h-9 w-9 shrink-0 rounded-full border border-black/15 transition duration-200 ${
              active
                ? 'ring-2 ring-emerald-600 ring-offset-2 ring-offset-[var(--color-bg)]'
                : 'hover:scale-110'
            }`}
          />
        );
      })}
    </div>
  );
}

function Group({title, children, defaultOpen = true}) {
  return (
    <details open={defaultOpen} className="group border-b border-[var(--color-line)] py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[.78rem] font-bold uppercase tracking-[.16em] marker:hidden [&::-webkit-details-marker]:hidden">
        {title}
        <span className="text-lg font-light transition-transform duration-300 group-open:rotate-45">+</span>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

export function FilterPanel({groups, bounds, filters, update, toggleValue}) {
  return (
    <div>
      <Group title="Availability">
        <Check
          checked={filters.stock}
          label="In stock only"
          onChange={() => update('stock', filters.stock ? null : '1')}
        />
        <Check
          checked={filters.sale}
          label="On sale"
          onChange={() => update('sale', filters.sale ? null : '1')}
        />
      </Group>

      {bounds && bounds.max > bounds.min && (
        <Group title="Price">
          <div className="grid grid-cols-2 gap-3">
            {['min', 'max'].map((key) => (
              <label key={key} className="block">
                <span className="mb-1.5 block text-[.65rem] uppercase tracking-[.14em] text-[var(--color-muted)]">
                  {key === 'min' ? 'From' : 'To'}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={bounds.min}
                  max={bounds.max}
                  placeholder={String(key === 'min' ? bounds.min : bounds.max)}
                  defaultValue={filters[key] ?? ''}
                  key={`${key}-${filters[key] ?? ''}`}
                  onBlur={(e) => update(key, e.target.value || null)}
                  onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                  className="w-full rounded-sm border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2.5 text-[.95rem] outline-none transition focus:border-emerald-600"
                />
              </label>
            ))}
          </div>
        </Group>
      )}

      {groups.map((group) => {
        const picked = filters.picked[group.id] ?? [];

        return (
          <Group key={group.id} title={group.label} defaultOpen={group.id !== 'tag'}>
            {group.swatch ? (
              <SwatchGrid
                values={group.values}
                picked={picked}
                onToggle={(value) => toggleValue(group.id, value)}
              />
            ) : (
              group.values.map(({value, count}) => (
                <Check
                  key={value}
                  label={value}
                  count={count}
                  checked={picked.includes(value)}
                  onChange={() => toggleValue(group.id, value)}
                />
              ))
            )}
          </Group>
        );
      })}
    </div>
  );
}

export function SortSelect({value, onChange}) {
  return (
    <label className="flex items-center gap-3 text-[.72rem] uppercase tracking-[.14em] text-[var(--color-muted)]">
      <span className="hidden sm:inline">Sort</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer rounded-sm border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2.5 text-[.8rem] normal-case tracking-normal text-[var(--color-ink)] outline-none transition focus:border-emerald-600"
      >
        {SORTS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </label>
  );
}