import {createContext, useContext, useMemo} from 'react';
import {buildIndex, collectionHref, productHref} from '~/lib/nav';

const EMPTY = {tree: [], pages: [], ...buildIndex([])};
const Ctx = createContext(EMPTY);

export function NavProvider({nav, children}) {
  const value = useMemo(() => ({tree: nav?.tree ?? [], pages: nav?.pages ?? [], ...buildIndex(nav?.tree ?? [])}), [nav]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useNav = () => useContext(Ctx);

/** Link builders that follow the Shopify menu: use these instead of hardcoding /collections or /products. */
export function useHrefs() {
  const nav = useNav();
  return useMemo(() => ({
    productHref: (p) => productHref(nav, p),
    collectionHref: (h) => collectionHref(nav, h),
  }), [nav]);
}
