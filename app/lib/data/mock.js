import products from '~/data/mock/products.json';
import collections from '~/data/mock/collections.json';

const num = (p) => parseFloat(p.price.amount);
const sorters = {
  'price-asc': (a, b) => num(a) - num(b),
  'price-desc': (a, b) => num(b) - num(a),
  title: (a, b) => a.title.localeCompare(b.title),
};

export const mock = {
  async products({collection, q, sort = 'featured', available = false, limit = 12} = {}) {
    let list = products;
    if (collection) list = list.filter((p) => p.collections.includes(collection));
    if (q) {
      const t = q.toLowerCase();
      list = list.filter((p) => [p.title, p.description, ...p.tags].join(' ').toLowerCase().includes(t));
    }
    if (available) list = list.filter((p) => p.availableForSale);
    if (sorters[sort]) list = [...list].sort(sorters[sort]);
    return {products: list.slice(0, limit), total: list.length};
  },
  async product(handle) { return products.find((p) => p.handle === handle) ?? null; },
  async collections() { return collections; },
  async collection(handle) { return collections.find((c) => c.handle === handle) ?? null; },
  async search(q) {
    const t = q.toLowerCase();
    const {products: ps} = await this.products({q, limit: 6});
    return {products: ps, collections: collections.filter((c) => c.title.toLowerCase().includes(t)).slice(0, 4)};
  },
};