import {createContext, useContext, useEffect, useMemo} from 'react';
import {buildIndex, collectionHref, productHref} from '~/lib/nav';

const EMPTY = {tree: [], pages: [], ...buildIndex([])};
const Ctx = createContext(EMPTY);

export function NavProvider({nav, children}) {
  const value = useMemo(() => ({tree: nav?.tree ?? [], pages: nav?.pages ?? [], ...buildIndex(nav?.tree ?? [])}), [nav]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useNav = () => useContext(Ctx);

/** Pages call useCompactHeader() to open with the header already in its floating pill state (SiteLayout provides the setter). */
const HeaderModeCtx = createContext(() => {});
export const HeaderModeProvider = HeaderModeCtx.Provider;
export function useCompactHeader(on = true) {
  const set = useContext(HeaderModeCtx);
  useEffect(() => {
    if (!on) return undefined;
    set(true);
    return () => set(false);
  }, [on, set]);
}

/** Link builders that follow the Shopify menu: use these instead of hardcoding /collections or /products. */
export function useHrefs() {
  const nav = useNav();
  return useMemo(() => ({
    productHref: (p) => productHref(nav, p),
    collectionHref: (h) => collectionHref(nav, h),
  }), [nav]);
}
