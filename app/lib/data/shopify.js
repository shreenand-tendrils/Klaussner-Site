export function shopify() {
  const todo = () => { throw new Error('Live Shopify adapter not implemented yet (Phase 16). Set USE_MOCK_DATA=true.'); };
  return {products: todo, product: todo, collections: todo, collection: todo, search: todo};
}