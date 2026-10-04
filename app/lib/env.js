export function getEnv(context, key) {
  return context?.env?.[key] ?? (typeof process !== 'undefined' ? process.env?.[key] : undefined);
}