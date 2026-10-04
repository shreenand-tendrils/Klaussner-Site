// TEMPORARY debug version: shows the real error in the browser instead of a generic 500.
// Must be the FIRST import: Hydrogen calls `caches.open()` (Oxygen API), which Node lacks.
import '../vercel/caches.js';
import {waitUntil} from '@vercel/functions';

let serverPromise;
const loadServer = () =>
  (serverPromise ??= import('../dist/server/index.js').then((m) => m.default));

export default {
  async fetch(request) {
    try {
      const server = await loadServer();
      return await server.fetch(request, process.env, {
        waitUntil,
        passThroughOnException() {},
      });
    } catch (error) {
      console.error(error);
      return new Response(`Function error:\n\n${error?.stack || error}`, {
        status: 500,
        headers: {'content-type': 'text/plain; charset=utf-8'},
      });
    }
  },
};