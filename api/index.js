// Vercel Node function that serves the Hydrogen server bundle from dist/server.
import '../vercel/caches.js'; // must stay first: Hydrogen calls `caches.open()` (Oxygen API)

let ready;

async function boot() {
  let waitUntil = (promise) => Promise.resolve(promise).catch(() => {});
  try {
    ({waitUntil} = await import('@vercel/functions'));
  } catch {
    // Package not installed: background tasks just run without waitUntil.
  }
  const {default: server} = await import('../dist/server/index.js');
  return {server, waitUntil};
}

export default {
  async fetch(request) {
    try {
      const {server, waitUntil} = await (ready ??= boot());
      return await server.fetch(request, process.env, {
        waitUntil,
        passThroughOnException() {},
      });
    } catch (error) {
      ready = undefined;
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};