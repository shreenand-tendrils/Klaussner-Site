import {getEnv} from '~/lib/env';
import {mock} from './mock';
import {shopify} from './shopify';

const source = (ctx) => (getEnv(ctx, 'USE_MOCK_DATA') === 'false' ? shopify(ctx) : mock);

export const getProducts = (ctx, opts) => source(ctx).products(opts);
export const getProduct = (ctx, handle) => source(ctx).product(handle);
export const getCollections = (ctx) => source(ctx).collections();
export const getCollection = (ctx, handle) => source(ctx).collection(handle);
export const searchCatalog = (ctx, q) => source(ctx).search(q);