import {index, route} from '@react-router/dev/routes';
import {hydrogenRoutes} from '@shopify/hydrogen';

// Routes are grouped by area under app/routes/:
//   home/ · shop/ (catalog, PDP, cart, search) · api/ · system/ · content/ (nested collection/product URLs + CMS pages)
export default hydrogenRoutes([
  index('routes/home/index.jsx'),

  route('collections', 'routes/shop/collections-index.jsx'),
  route('collections/:handle', 'routes/shop/collection.jsx'),
  route('products/:handle', 'routes/shop/product.jsx'),
  route('cart', 'routes/shop/cart.jsx'),
  route('search', 'routes/shop/search.jsx'),

  route('api/search', 'routes/api/search.jsx'),
  route('api/products', 'routes/api/products.jsx'),
  route('api/cms', 'routes/api/cms.jsx'),

  route('studio/*', 'routes/studio/studio.jsx'), // Sanity Studio

  route('robots.txt', 'routes/system/robots.jsx'),
  route('sitemap.xml', 'routes/system/sitemap.jsx'),

  // Anything else → /room/child/product URLs from the Shopify menu, else Sanity "page" (404 if none)
  route('*', 'routes/content/resolve.jsx'),
]);

/** @typedef {import('@react-router/dev/routes').RouteConfig} RouteConfig */
