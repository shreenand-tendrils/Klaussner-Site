import {createContext, useContext, useEffect, useReducer, useState} from 'react';

const Ctx = createContext(null);
const KEY = 'klaussner:cart';

function reducer(s, a) {
  switch (a.type) {
    case 'load': return a.lines;
    case 'add': {
      const ex = s.find((l) => l.variantId === a.line.variantId);
      return ex ? s.map((l) => (l === ex ? {...l, quantity: l.quantity + a.line.quantity} : l)) : [...s, a.line];
    }
    case 'set': return s.map((l) => (l.variantId === a.variantId ? {...l, quantity: a.quantity} : l)).filter((l) => l.quantity > 0);
    case 'remove': return s.filter((l) => l.variantId !== a.variantId);
    default: return s;
  }
}

export function CartProvider({children}) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { dispatch({type: 'load', lines: JSON.parse(localStorage.getItem(KEY) || '[]')}); } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(lines)); }, [lines, ready]);

  const value = {
    lines, open, setOpen, ready,
    count: lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: lines.reduce((n, l) => n + l.quantity * parseFloat(l.price.amount), 0),
    currency: lines[0]?.price.currencyCode ?? 'USD',
    add: (line) => { dispatch({type: 'add', line}); setOpen(true); },
    setQty: (variantId, quantity) => dispatch({type: 'set', variantId, quantity}),
    remove: (variantId) => dispatch({type: 'remove', variantId}),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => useContext(Ctx);