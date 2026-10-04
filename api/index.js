
Index · JS
// Vercel Node function that runs the Hydrogen server bundle built into dist/server.
// Must be the FIRST import: Hydrogen calls `caches.open()` (Oxygen API), which Node lacks.
import '../vercel/caches.js';
import {waitUntil} from '@vercel/functions';
import server from '../dist/server/index.js';
 
export default {
  fetch(request) {
    return server.fetch(request, process.env, {
      waitUntil,
      passThroughOnException() {},
    });
  },
};
 
