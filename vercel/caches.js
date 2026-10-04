// Minimal in-memory Cache API for Node (Hydrogen expects Oxygen's `caches`).
// Per function instance only; good enough to avoid refetching Shopify on every request.
const MAX_ENTRIES = 500;
const DEFAULT_TTL_SECONDS = 60;

const keyOf = (request) => (typeof request === 'string' ? request : request.url);

function ttlSeconds(headers) {
  const match = (headers.get('cache-control') || '').match(/max-age=(\d+)/i);
  return match ? Number(match[1]) : DEFAULT_TTL_SECONDS;
}

function createCache() {
  const store = new Map();

  return {
    async match(request) {
      const key = keyOf(request);
      const hit = store.get(key);
      if (!hit) return undefined;
      if (hit.expires < Date.now()) {
        store.delete(key);
        return undefined;
      }
      return new Response(hit.body, {status: hit.status, headers: hit.headers});
    },
    async put(request, response) {
      if (store.size >= MAX_ENTRIES) store.delete(store.keys().next().value);
      store.set(keyOf(request), {
        body: await response.clone().arrayBuffer(),
        status: response.status,
        headers: [...response.headers.entries()],
        expires: Date.now() + ttlSeconds(response.headers) * 1000,
      });
    },
    async delete(request) {
      return store.delete(keyOf(request));
    },
  };
}

if (!globalThis.caches) {
  const named = new Map();
  globalThis.caches = {
    async open(name) {
      if (!named.has(name)) named.set(name, createCache());
      return named.get(name);
    },
  };
}