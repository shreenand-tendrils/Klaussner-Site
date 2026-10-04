import {useMemo, useState} from 'react';
import {useCart} from '~/components/cart/CartProvider';
import {formatMoney} from '~/lib/format';
import {getSwatchColor} from '~/lib/swatches';

const moneyNumber = (value) => Number.parseFloat(value?.amount || '0');
const optionsOf = (variant) => variant?.selectedOptions ?? [];
const hasOption = (variant, name, value) =>
  optionsOf(variant).some((o) => o.name === name && o.value === value);
const matchesSel = (variant, sel) => optionsOf(variant).every((o) => sel[o.name] === o.value);
const toSel = (variant) => Object.fromEntries(optionsOf(variant).map((o) => [o.name, o.value]));

export function ProductForm({product, showPrice = false}) {
  const {add} = useCart();

  const variants = product.variants ?? [];
  // Single-value / "Title" options ko UI me nahi dikhate
  const options = (product.options ?? []).filter(
    (o) => o?.values?.length > 1 && !/^title$/i.test(o.name),
  );

  const startVariant = variants.find((v) => v.availableForSale) ?? variants[0];
  const [sel, setSel] = useState(() => toSel(startVariant));
  const [qty, setQty] = useState(1);

  const variant = useMemo(
    () => variants.find((item) => matchesSel(item, sel)) ?? startVariant ?? product,
    [startVariant, product, sel, variants],
  );

  const price = variant.price ?? product.price;
  const compareAtPrice = variant.compareAtPrice ?? product.compareAtPrice;
  const isOnSale = Boolean(compareAtPrice && moneyNumber(compareAtPrice) > moneyNumber(price));
  const inStock = variant?.availableForSale ?? product.availableForSale;

  /* Is combination me (baaki selections ke saath) ye value available hai? */
  const comboAvailable = (name, value) =>
    !variants.length ||
    variants.some((v) => v.availableForSale && matchesSel(v, {...sel, [name]: value}));

  /* Kisi bhi combination me ye value kabhi available hai? */
  const everAvailable = (name, value) =>
    !variants.length || variants.some((v) => v.availableForSale && hasOption(v, name, value));

  const chooseOption = (name, value) => {
    const next = {...sel, [name]: value};
    if (variants.some((v) => v.availableForSale && matchesSel(v, next))) return setSel(next);

    // Combo sold out hai: sabse nazdeeki available variant par snap karo
    const candidates = variants.filter((v) => v.availableForSale && hasOption(v, name, value));
    if (!candidates.length) return setSel(next);

    const score = (v) => optionsOf(v).filter((o) => sel[o.name] === o.value).length;
    return setSel(toSel([...candidates].sort((a, b) => score(b) - score(a))[0]));
  };

  const addToBag = () => {
    if (!variant?.id || !inStock) return;

    add({
      variantId: variant.id,
      handle: product.handle,
      title: product.title,
      variantTitle: variant.title,
      image: product.images?.[0]?.url,
      price,
      quantity: qty,
    });
  };

  return (
    <div id="product-purchase" className="space-y-8">
      {/* Live price (ProductView me showPrice pass karo) */}
      {showPrice && price && (
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-[1.55rem] font-medium tracking-[-.025em] sm:text-[1.85rem]">
            {formatMoney(price)}
          </span>
          {isOnSale && (
            <>
              <span className="text-[.9rem] text-[var(--color-muted)] line-through sm:text-[1rem]">
                {formatMoney(compareAtPrice)}
              </span>
              <span className="text-[.7rem] font-medium uppercase tracking-[.1em] text-[var(--green-700)]">
                {Math.round((1 - moneyNumber(price) / moneyNumber(compareAtPrice)) * 100)}% off
              </span>
            </>
          )}
        </div>
      )}

      {/* Variant selectors */}
      {options.map((option) => {
        const colors = option.values.map((v) => getSwatchColor(v, product.swatches));
        const isSwatch = colors.every(Boolean);

        return (
          <fieldset key={option.name} className="border-0 p-0">
            <legend className="mb-3.5 flex w-full items-center justify-between gap-4">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)] sm:text-[0.75rem]">
                {option.name}
              </span>
              <span className="text-[0.8rem] font-medium text-[var(--color-muted)]">
                {sel[option.name] || 'Select'}
              </span>
            </legend>

            {isSwatch ? (
              <div className="flex flex-wrap gap-3.5">
                {option.values.map((value, i) => {
                  const active = sel[option.name] === value;
                  const ever = everAvailable(option.name, value);
                  const here = comboAvailable(option.name, value);

                  return (
                    <button
                      key={value}
                      type="button"
                      title={ever ? value : `${value} (sold out)`}
                      aria-label={value}
                      aria-pressed={active}
                      disabled={!ever}
                      onClick={() => chooseOption(option.name, value)}
                      style={{backgroundColor: colors[i]}}
                      className={`
                        relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-black/15 transition duration-200
                        ${
                          active
                            ? 'ring-2 ring-[var(--color-ink)] ring-offset-2 ring-offset-[var(--color-surface)]'
                            : 'hover:scale-110'
                        }
                        ${
                          !here
                            ? "opacity-40 after:absolute after:inset-0 after:m-auto after:h-px after:w-full after:-rotate-45 after:bg-[var(--color-ink)] after:content-['']"
                            : ''
                        }
                        ${!ever ? 'cursor-not-allowed hover:scale-100' : ''}
                      `}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {option.values.map((value) => {
                  const active = sel[option.name] === value;
                  const ever = everAvailable(option.name, value);
                  const here = comboAvailable(option.name, value);

                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      disabled={!ever}
                      onClick={() => chooseOption(option.name, value)}
                      className={`
                        relative min-h-[46px] rounded-sm border px-5 py-2.5 text-[0.75rem] font-medium tracking-[0.06em] transition-all duration-200
                        sm:min-h-[50px] sm:px-6 sm:text-[0.78rem]
                        ${
                          active
                            ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white shadow-sm'
                            : 'border-[var(--color-line)] bg-transparent text-[var(--color-ink)] hover:border-[var(--color-ink)]/60 hover:bg-[var(--color-surface)]'
                        }
                        ${!here && !active ? 'border-dashed opacity-40 line-through' : ''}
                        ${!ever ? 'cursor-not-allowed hover:border-[var(--color-line)] hover:bg-transparent' : ''}
                      `}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>
        );
      })}

      {/* Live Stock Indicator */}
      <div className="flex w-fit items-center gap-2.5 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-2">
        <span
          className={`h-2 w-2 rounded-full transition-colors ${
            inStock ? 'animate-pulse bg-emerald-500' : 'bg-stone-400'
          }`}
        />
        <span
          className={`text-[0.7rem] font-semibold uppercase tracking-[0.1em] ${
            inStock ? 'text-emerald-800' : 'text-[var(--color-muted)]'
          }`}
        >
          {inStock ? 'In Stock & Ready to Craft' : 'Currently Unavailable'}
        </span>
      </div>

      {/* Quantity & Purchase Button Controls */}
      <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-3">
        <div className="grid grid-cols-[38px_1fr_38px] items-center rounded-sm border border-[var(--color-line)] bg-[var(--color-surface)] text-center">
          <button
            type="button"
            onClick={() => setQty((v) => Math.max(1, v - 1))}
            aria-label="Decrease quantity"
            className="flex h-full items-center justify-center text-base font-light transition hover:bg-[var(--color-line)]/30"
          >
            −
          </button>
          <span className="text-[0.82rem] font-medium text-[var(--color-ink)]">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((v) => v + 1)}
            aria-label="Increase quantity"
            className="flex h-full items-center justify-center text-base font-light transition hover:bg-[var(--color-line)]/30"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={!inStock}
          onClick={addToBag}
          className="
            group flex min-h-[50px] items-center justify-between rounded-sm border border-[var(--color-ink)]
            bg-[var(--color-ink)] px-6 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white
            transition-all duration-300 hover:border-emerald-900 hover:bg-emerald-900
            disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-[54px] sm:text-[0.76rem]
          "
        >
          <span>{inStock ? 'Add to Bag' : 'Sold Out'}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </button>
      </div>

      {product.purchaseNotes && (
        <div className="border-t border-[var(--color-line)] pt-4">
          {[].concat(product.purchaseNotes).map((note) => (
            <p key={note} className="m-0 text-[0.84rem] leading-relaxed text-[var(--color-muted)]">
              {note}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}