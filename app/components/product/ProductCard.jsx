import {Link} from 'react-router';
import {formatMoney} from '~/lib/format';
import {useHrefs} from '~/components/layout/NavContext';

export function ProductCard({product}) {
  const {productHref} = useHrefs();
  const img = product.images?.[0];
  const isOnSale = Boolean(product.compareAtPrice && parseFloat(product.compareAtPrice.amount) > parseFloat(product.price.amount));

  return (
    <Link to={productHref(product)} className="[&_h3]:[font-size:1.15rem] [&_h3]:[margin:.8rem_0_.2rem] card relative" prefetch="intent">
      <div className="relative overflow-hidden [background:var(--color-line)] [border-radius:var(--radius-md)]">
        {isOnSale && (
          <span className="absolute left-2.5 top-2.5 z-[2] rounded-[var(--radius-sm)] bg-[var(--green-800)] px-[.65rem] py-[.3rem] text-[.7rem] uppercase tracking-[.1em] text-white">
            Sale
          </span>
        )}
        {img && <img className="[aspect-ratio:4/3] [width:100%] [object-fit:cover] [transition:transform_.6s_ease] [.card:hover_&]:[transform:scale(1.03)]" src={img.url} alt={img.alt || product.title} width={img.width || 1200} height={img.height || 900} loading="lazy" />}
      </div>
      <h3>{product.title}</h3>
      <div className="flex items-center gap-[.6rem]">
        <span className="[color:var(--color-muted)]">{product.availableForSale ? formatMoney(product.price) : 'Sold out'}</span>
        {isOnSale && (
          <span className="[color:var(--color-muted)] text-[.9rem] line-through">
            {formatMoney(product.compareAtPrice)}
          </span>
        )}
      </div>
    </Link>
  );
}