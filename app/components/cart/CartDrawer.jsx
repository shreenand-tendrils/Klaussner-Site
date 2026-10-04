import {useEffect, useRef, useState} from 'react';
import {useCart} from '~/components/cart/CartProvider';
import {CartLines} from '~/components/cart/CartLines';

export function CartDrawer() {
  const {open, setOpen} = useCart();
  const ref = useRef(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      ref.current?.focus();
      document.body.style.overflow = 'hidden';
      setClosing(false);
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 200);
  };

  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] overflow-hidden">
      {/* Backdrop with Blur */}
      <div
        className={`absolute inset-0 bg-stone-950/65 backdrop-blur-sm transition-opacity duration-300 ${
          closing ? 'opacity-0' : 'opacity-100 animate-fadeIn'
        }`}
        onClick={handleClose}
      />

      {/* Slide-over Drawer Panel */}
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-[var(--color-surface)] shadow-2xl transition-transform duration-300 ease-out ${
          closing ? 'translate-x-full' : 'translate-x-0 animate-slideLeft'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-medium tracking-tight text-[var(--color-ink)]">
              Your Shopping Bag
            </h2>
          </div>

          <button
            ref={ref}
            type="button"
            onClick={handleClose}
            aria-label="Close cart"
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] bg-transparent text-[var(--color-ink)] transition hover:border-[var(--color-ink)] hover:bg-[var(--color-bg)]"
          >
            <span className="text-lg font-light leading-none transition-transform group-hover:rotate-90">
              ×
            </span>
          </button>
        </div>

        {/* Drawer Content / Line Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 [scrollbar-width:thin]">
          <CartLines />
        </div>
      </aside>
    </div>
  );
}