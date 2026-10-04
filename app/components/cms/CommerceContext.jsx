import {createContext, useContext} from 'react';

// Shopify data the loader hands to CMS blocks (CollectionShelf / ProductShelf).
const Ctx = createContext({collections: [], products: []});
export const CommerceProvider = Ctx.Provider;
export const useCommerce = () => useContext(Ctx);
