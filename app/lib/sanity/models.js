// Sanity document types used by this storefront (defined in app/studio/schema).
export const MODELS = {
  page: 'page', // full pages, matched by `url` (e.g. "/", "/room-inspiration")
  section: 'section', // reusable blocks, matched by `slot` (e.g. "living-room-hero")
};
export const API_MODELS = Object.values(MODELS);
