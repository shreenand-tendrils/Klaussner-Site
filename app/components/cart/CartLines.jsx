import {useCart} from '~/components/cart/CartProvider';
import {formatMoney} from '~/lib/format';

export function CartLines() {
  const {lines, setQty, remove, subtotal, currency} = useCart();
  if (!lines.length) return <p className="[color:var(--color-muted)]">Your bag is empty.</p>;
  return (
    <>
      <div className="flex-1 overflow-auto [margin-block:1rem]">
        {lines.map((l) => (
          <div key={l.variantId} className="grid [grid-template-columns:80px_1fr] [gap:1rem] [padding-block:1rem] [border-bottom:1px_solid_var(--color-line)] [&_img]:[width:80px] [&_img]:[aspect-ratio:1] [&_img]:[object-fit:cover] [&_img]:[border-radius:var(--radius-md)]">
            {l.image && <img src={l.image} alt="" />}
            <div>
              <strong>{l.title}</strong><div className="[color:var(--color-muted)]">{l.variantTitle}</div>
              <div className="[accent-color:var(--green-800)] inline-flex [border:1px_solid_var(--color-line)] [border-radius:var(--radius-btn)] [margin-right:1rem] [background:#fff] [&_button]:[width:2.5rem] [&_button]:[background:none] [&_button]:[border:0] [&_button]:cursor-pointer [&_button]:[font-size:1.1rem] [&_span]:[min-width:2rem] [&_span]:text-center [&_span]:[align-self:center] [.product-form_&]:flex [.product-form_&]:items-center [.product-form_&]:justify-between [.product-form_&]:[min-width:118px] [.product-form_&]:[margin:0] [.product-form_&]:[border:1px_solid_var(--color-ink)] [.product-form_&]:[border-radius:0] [.product-form_&]:[background:transparent] [.product-form_&_button]:[width:2.5rem] [.product-form_&_button]:[height:100%] [.product-form_&_button]:[border:0] [.product-form_&_button]:[background:transparent] [.product-form_&_button]:[color:var(--color-ink)] [.product-form_&_button]:cursor-pointer [.product-form_&_span]:[font-size:.82rem] max-[640px]:[.product-form_&]:[min-height:3rem] mt-2">
                <button type="button" onClick={() => setQty(l.variantId, l.quantity - 1)} aria-label={`Decrease ${l.title}`}>−</button>
                <span>{l.quantity}</span>
                <button type="button" onClick={() => setQty(l.variantId, l.quantity + 1)} aria-label={`Increase ${l.title}`}>+</button>
              </div>
              <button type="button" className="[background:none] [border:0] [padding:0] [font:inherit] cursor-pointer [color:inherit] [&:hover]:underline [&:hover]:[text-underline-offset:5px] [color:var(--color-muted)]" onClick={() => remove(l.variantId)}>Remove</button>
              <div>{formatMoney({amount: String(l.quantity * parseFloat(l.price.amount)), currencyCode: l.price.currencyCode})}</div>
            </div>
          </div>
        ))}
      </div>
      <p><strong>Subtotal: {formatMoney({amount: String(subtotal), currencyCode: currency})}</strong></p>
      <button type="button" className="inline-flex items-center justify-center [padding:.9rem_1.8rem] [border:1px_solid_var(--green-800)] [border-radius:var(--radius-btn)] [background:var(--green-800)] [color:#fff] [font:inherit] [font-size:.78rem] [letter-spacing:.12em] uppercase cursor-pointer [transition:var(--transition)] [&:hover]:[background:var(--green-700)] [&:hover]:[border-color:var(--green-700)] [&[disabled]]:[opacity:.4] [&[disabled]]:pointer-events-none [.hero__cta_&]:[padding:.9rem_2.2rem] [.sec--green_&:not(.btn--ghost)]:[background:#fff] [.sec--green_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--green_&:not(.btn--ghost)]:[border-color:#fff] [.sec--dark_&:not(.btn--ghost)]:[background:#fff] [.sec--dark_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--dark_&:not(.btn--ghost)]:[border-color:#fff] [.ibanner_&:not(.btn--ghost)]:[background:#fff] [.ibanner_&:not(.btn--ghost)]:[color:var(--green-900)] [.ibanner_&:not(.btn--ghost)]:[border-color:#fff]" disabled title="Checkout connects when Shopify is live">Checkout</button>
      <p className="[color:var(--color-muted)] text-[.8rem]">Checkout is enabled once Shopify is connected.</p>
    </>
  );
}