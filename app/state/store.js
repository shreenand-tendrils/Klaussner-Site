import {useSyncExternalStore} from 'react';

const initial = Object.freeze({searchOpen: false, mobileMenuOpen: false});
let state = initial;
const listeners = new Set();

const emit = (patch) => {
  state = {...state, ...patch};
  listeners.forEach((listener) => listener());
};

export const uiStore = {
  getSnapshot: () => state,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  openSearch: () => emit({searchOpen: true}),
  closeSearch: () => emit({searchOpen: false}),
  openMobileMenu: () => emit({mobileMenuOpen: true}),
  closeMobileMenu: () => emit({mobileMenuOpen: false}),
};

export function useUIStore() {
  return useSyncExternalStore(uiStore.subscribe, uiStore.getSnapshot, uiStore.getSnapshot);
}
