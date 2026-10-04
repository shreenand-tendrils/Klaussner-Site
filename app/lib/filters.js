import {getSwatchColor} from '~/lib/swatches';

const amount = (money) => Number.parseFloat(money?.amount ?? 'NaN');

export const SORTS = [
  {id: 'featured', label: 'Featured'},
  {id: 'price-asc', label: 'Price: Low to High'},
  {id: 'price-desc', label: 'Price: High to Low'},
  {id: 'title-asc', label: 'Name: A–Z'},
];

export function buildFilterGroups(products) {
  const groups = {};

  const add = (id, label, value, color) => {
    if (!value) return;
    groups[id] ??= {id, label, values: new Map(), colors: new Map()};
    groups[id].values.set(value, (groups[id].values.get(value) || 0) + 1);
    if (color && !groups[id].colors.has(value)) groups[id].colors.set(value, color);
  };

  products.forEach((p) => {
    add('vendor', 'Brand', p.vendor);
    add('type', 'Type', p.productType);
    new Set((p.tags ?? []).filter(Boolean)).forEach((t) => add('tag', 'Tags', t));
    (p.options ?? []).forEach((o) => {
      if (!o?.name || /^title$/i.test(o.name)) return;
      new Set(o.values ?? []).forEach((v) =>
        add(`opt:${o.name}`, o.name, v, getSwatchColor(v, p.swatches)),
      );
    });
  });

  return Object.values(groups)
    .map((g) => {
      const all = [...g.values]
        .map(([value, count]) => ({value, count}))
        .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));

      // Group tabhi swatch-group hai jab har value ka rang mile
      const swatch = g.colors.size > 0 && all.every((v) => g.colors.get(v.value));
      const values = (swatch ? all.slice(0, 30) : all.slice(0, 14)).map((v) => ({
        ...v,
        color: g.colors.get(v.value) ?? null,
      }));

      return {id: g.id, label: g.label, swatch, values};
    })
    .filter((g) => g.values.length > 1);
}

export function priceBounds(products) {
  const prices = products.map((p) => amount(p.price)).filter(Number.isFinite);
  if (!prices.length) return null;
  return {min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices))};
}

export function readFilters(sp, groups) {
  const picked = {};
  groups.forEach((g) => {
    const vals = sp.getAll(g.id);
    if (vals.length) picked[g.id] = vals;
  });
  return {
    picked,
    stock: sp.get('stock') === '1',
    sale: sp.get('sale') === '1',
    min: sp.get('min') ? Number(sp.get('min')) : null,
    max: sp.get('max') ? Number(sp.get('max')) : null,
    sort: sp.get('sort') || 'featured',
  };
}

export function countActive(f) {
  return (
    Object.values(f.picked).reduce((n, v) => n + v.length, 0) +
    (f.stock ? 1 : 0) +
    (f.sale ? 1 : 0) +
    (f.min != null ? 1 : 0) +
    (f.max != null ? 1 : 0)
  );
}

function matchesGroup(p, id, values) {
  if (id === 'vendor') return values.includes(p.vendor);
  if (id === 'type') return values.includes(p.productType);
  if (id === 'tag') return (p.tags ?? []).some((t) => values.includes(t));
  if (id.startsWith('opt:')) {
    const name = id.slice(4);
    const opt = (p.options ?? []).find((o) => o.name === name);
    return (opt?.values ?? []).some((v) => values.includes(v));
  }
  return true;
}

export function applyFilters(products, f) {
  const out = products.filter((p) => {
    const price = amount(p.price);
    if (f.stock && !p.availableForSale) return false;
    if (f.sale && !(amount(p.compareAtPrice) > price)) return false;
    if (f.min != null && price < f.min) return false;
    if (f.max != null && price > f.max) return false;
    return Object.entries(f.picked).every(([id, vals]) => matchesGroup(p, id, vals));
  });

  const byPrice = (p) => amount(p.price) || 0;
  if (f.sort === 'price-asc') out.sort((a, b) => byPrice(a) - byPrice(b));
  if (f.sort === 'price-desc') out.sort((a, b) => byPrice(b) - byPrice(a));
  if (f.sort === 'title-asc') out.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  return out;
}