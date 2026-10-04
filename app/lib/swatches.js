const FALLBACK = {
  ivory: '#EFE9DC', cream: '#EFE5D2', oatmeal: '#D8CDB9', sand: '#D2BFA0', stone: '#C9C2B6',
  mist: '#CBD2D6', slate: '#6B7580', charcoal: '#3A3A3C', graphite: '#4B4F54', ink: '#1D2430',
  midnight: '#1B2236', navy: '#1F2A44', moss: '#6F7B52', olive: '#77783F', forest: '#2F4A3A',
  sage: '#9AA58A', terracotta: '#B5603E', rust: '#A9532F', blush: '#E3C3BC', cognac: '#9A5B2E',
  espresso: '#3B2A22', walnut: '#5A3E2B', ash: '#C9B79C', oak: '#B58B5A', natural: '#CDAE82',
  smoked: '#5B4636', black: '#1B1B1B', white: '#F7F5EF', tan: '#B58E5E', grey: '#8A8D91', gray: '#8A8D91',
};

/* product.swatches pehle, phir fallback naam-list. Na mile to null */
export function getSwatchColor(value, swatches) {
  if (!value) return null;
  return swatches?.[value] ?? FALLBACK[String(value).trim().toLowerCase()] ?? null;
}