import {ProductGallery} from '~/components/product/ProductGallery';
import {ProductForm} from '~/components/product/ProductForm';
import {ProductGrid} from '~/components/product/ProductGrid';
import {ProductMore} from '~/components/product/ProductMore';
import {ProductReviews, RatingSummary, summarizeReviews} from '~/components/product/ProductReviews';
import {ProductSpecs} from '~/components/product/ProductSpecs';
import {formatMoney} from '~/lib/format';
import {useCompactHeader} from '~/components/layout/NavContext';

function DynamicList({items}) {
  if (!items?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={`${item.title}-${index}`}
          className="group flex flex-col border border-[var(--color-line)] bg-[var(--color-surface)] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-600 hover:shadow-[0_18px_40px_rgba(15,36,23,.08)] sm:p-7"
        >
          {item.number && (
            <span className="mb-5 block font-display text-[2.2rem] font-medium leading-none tracking-[-.03em] text-emerald-600">
              {item.number}
            </span>
          )}

          {item.title && (
            <h3 className="text-[.9rem] font-bold uppercase tracking-[.14em] text-[var(--color-ink)]">
              {item.title}
            </h3>
          )}

          {item.text && (
            <p className="mt-3 text-[.92rem] leading-7 text-[var(--color-muted)]">
              {item.text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function ProductPrice({product}) {
  const price = product.price;
  const compareAtPrice = product.compareAtPrice;

  if (!price) return null;

  const current = Number(price.amount);
  const compare = Number(compareAtPrice?.amount);
  const onSale = Number.isFinite(compare) && compare > current;

  return (
    <div className="flex flex-wrap items-baseline gap-3">
      <span className="text-[1.55rem] font-medium tracking-[-.025em] sm:text-[1.85rem]">
        {formatMoney(price)}
      </span>

      {onSale && (
        <>
          <span className="text-[.9rem] text-[var(--color-muted)] line-through sm:text-[1rem]">
            {formatMoney(compareAtPrice)}
          </span>

          <span className="text-[.7rem] font-medium uppercase tracking-[.1em] text-[var(--green-700)]">
            {Math.round((1 - current / compare) * 100)}% off
          </span>
        </>
      )}
    </div>
  );
}

function ProductMeta({product}) {
  const items = [];

  if (product.vendor) {
    items.push({label: 'Brand', value: product.vendor});
  }

  if (product.availableForSale !== undefined) {
    items.push({
      label: 'Availability',
      value: product.availableForSale ? 'Available' : 'Unavailable',
    });
  }

  if (product.productType) {
    items.push({label: 'Type', value: product.productType});
  }

  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-y border-[var(--color-line)] py-5 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label}>
          <span className="block text-[.64rem] font-semibold uppercase tracking-[.13em] text-[var(--color-ink)]/60">
            {item.label}
          </span>
          <span className="mt-1.5 block text-[.92rem] font-medium text-[var(--color-ink)]">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function ProductTags({product}) {
  const tags = product.tags?.filter(Boolean);

  if (!tags?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="border border-[var(--color-ink)]/20 px-3 py-2 text-[.66rem] font-medium uppercase tracking-[.1em] text-[var(--color-ink)]/80"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function ProductContent({product}) {
  const content = product.content ?? {};
  const story = content.story ?? product.story;
  const highlights = content.highlights ?? product.highlights;
  const sections = content.sections ?? product.sections;
  const highlightsText = content.highlightsText ?? content.highlightsSubtitle;

  const dynamicSections = Array.isArray(sections)
    ? sections.filter((section) => section && (section.title || section.text || section.body))
    : [];

  return (
    <>
      {/* Product highlights */}
      {Array.isArray(highlights) && highlights.length > 0 && (
        <section className="mx-auto w-[calc(100%-2*var(--gutter))] max-w-[var(--container-wide)] py-12 sm:py-16 lg:py-20">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              {content.highlightsEyebrow && (
                <span className="block text-[.78rem] font-semibold uppercase tracking-[.2em] text-emerald-600">
                  {content.highlightsEyebrow}
                </span>
              )}

              {content.highlightsTitle && (
                <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-.03em]">
                  {content.highlightsTitle}
                </h2>
              )}
            </div>

            {highlightsText && (
              <p className="max-w-[44ch] text-[1rem] leading-7 text-[var(--color-muted)]">
                {highlightsText}
              </p>
            )}
          </div>

          <DynamicList items={highlights} />
        </section>
      )}

      {/* Editorial story */}
      {story && (story.title || story.text || story.image) && (
        <section className="bg-[var(--color-sand)]">
          <div
            className={`mx-auto grid w-[calc(100%-2*var(--gutter))] max-w-[var(--container-wide)] grid-cols-1 gap-8 py-12 sm:gap-10 sm:py-16 lg:py-20 ${
              story.image ? 'lg:grid-cols-2 lg:items-center' : 'text-center'
            }`}
          >
            <div className={story.image ? 'order-2 lg:order-1' : ''}>
              {story.eyebrow && (
                <span className="block text-[.78rem] font-semibold uppercase tracking-[.2em] text-emerald-600">
                  {story.eyebrow}
                </span>
              )}

              {story.title && (
                <h2 className={`mt-4 max-w-[20ch] font-display text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-.03em] ${story.image ? '' : 'mx-auto'}`}>
                  {story.title}
                </h2>
              )}

              {story.image && story.text && (
                <div className="mt-5 max-w-[56ch] text-[.98rem] leading-8 text-[var(--color-muted)] sm:text-[1.02rem]">
                  {story.text}
                </div>
              )}
            </div>

            {!story.image && story.text && (
              <div className="mx-auto max-w-[62ch] text-[1rem] leading-8 text-[var(--color-muted)] sm:text-[1.05rem]">
                {story.text}
              </div>
            )}

            {story.image && (
              <div className="order-1 overflow-hidden bg-[var(--color-bg)] lg:order-2">
                <img
                  src={story.image.url}
                  alt={story.image.alt || product.title}
                  width={1400}
                  height={1100}
                  loading="lazy"
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Dynamic custom sections */}
      {dynamicSections.map((section, index) => {
        const isEven = index % 2 === 0;
        const hasImage = Boolean(section.image?.url);
        const body = section.text || section.body;

        return (
          <section
            key={`${section.title}-${index}`}
            className={`border-t border-[var(--color-line)] ${isEven ? '' : 'bg-[var(--color-surface)]'}`}
          >
            <div className="mx-auto w-[calc(100%-2*var(--gutter))] max-w-[var(--container-wide)] py-12 sm:py-16 lg:py-20">
              {hasImage ? (
                <div className={`grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-14 ${isEven ? '' : 'lg:grid-flow-dense'}`}>
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    {section.eyebrow && (
                      <span className="block text-[.78rem] font-semibold uppercase tracking-[.2em] text-emerald-600">
                        {section.eyebrow}
                      </span>
                    )}
                    {section.title && (
                      <h2 className="mt-3 max-w-[20ch] font-display text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-.03em]">
                        {section.title}
                      </h2>
                    )}
                    {body && (
                      <div className="mt-4 max-w-[60ch] text-[.98rem] leading-8 text-[var(--color-muted)] sm:text-[1.02rem]">
                        {body}
                      </div>
                    )}
                  </div>

                  <div className={`overflow-hidden rounded-sm bg-[var(--color-sand)] shadow-sm ${isEven ? '' : 'lg:col-start-1'}`}>
                    <img
                      src={section.image.url}
                      alt={section.image.alt || ''}
                      width={1400}
                      height={1100}
                      loading="lazy"
                      className="aspect-[4/3] h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="mx-auto max-w-3xl text-center">
                  <span className="block font-mono text-[.85rem] tracking-[.2em] text-emerald-600">
                    {String(index + 1).padStart(2, '0')}
                    {section.eyebrow ? ` — ${section.eyebrow}` : ''}
                  </span>
                  {section.title && (
                    <h2 className="mx-auto mt-4 max-w-[22ch] font-display text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-.03em]">
                      {section.title}
                    </h2>
                  )}
                  {body && (
                    <div className="mx-auto mt-6 max-w-[62ch] border-t border-[var(--color-line)] pt-6 text-[1rem] leading-8 text-[var(--color-muted)] sm:text-[1.05rem]">
                      {body}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

export function ProductView({product, related = [], more = [], onSubmitReview}) {
  useCompactHeader(); // header opens as the floating pill on product pages
  const content = product.content ?? {};
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const ratings = summarizeReviews(reviews);
  const relatedTitle = content.relatedTitle;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || '',
    image: product.images?.map((image) => image.url).filter(Boolean) ?? [],
    brand: product.vendor ? {'@type': 'Brand', name: product.vendor} : undefined,
    offers: product.price
      ? {
          '@type': 'Offer',
          price: product.price.amount,
          priceCurrency: product.price.currencyCode,
          availability: product.availableForSale
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        }
      : undefined,
    aggregateRating: ratings.count
      ? {
          '@type': 'AggregateRating',
          ratingValue: ratings.average.toFixed(1),
          reviewCount: ratings.count,
        }
      : undefined,
    review: ratings.count
      ? reviews.slice(0, 5).map((r) => ({
          '@type': 'Review',
          author: {'@type': 'Person', name: r.author},
          datePublished: r.date,
          reviewBody: r.body,
          reviewRating: {'@type': 'Rating', ratingValue: r.rating, bestRating: 5},
        }))
      : undefined,
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pb-20 text-[var(--color-ink)] sm:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />

      {/* Breadcrumb */}
      <div className="mx-auto w-[calc(100%-2*var(--gutter))] max-w-[var(--container-wide)] py-3 sm:py-4">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-[.67rem] uppercase tracking-[.1em] text-[var(--color-muted)] sm:text-[.72rem]">
          <a href="/" className="shrink-0 transition hover:text-[var(--color-ink)]">Home</a>
          <span>/</span>
          {product.vendor && (
            <>
              <span className="shrink-0">{product.vendor}</span>
              <span>/</span>
            </>
          )}
          <span className="overflow-hidden text-ellipsis">{product.title}</span>
        </nav>
      </div>

      {/* Main commerce area */}
      <section className="mx-auto grid w-[calc(100%-2*var(--gutter))] max-w-[var(--container-wide)] grid-cols-1 items-start gap-6 pb-12 sm:gap-8 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-[clamp(2rem,4vw,4rem)] lg:pb-20">
        <div className="min-w-0">
          <ProductGallery images={product.images} title={product.title} />

          {/* Extra info under the image */}
          <div className="mt-5 space-y-6 border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-6 lg:p-7">
            {product.description && (
              <div>
                <h2 className="m-0 flex items-center gap-3 text-[.74rem] font-bold uppercase tracking-[.18em] text-[var(--color-ink)]">
                  <span aria-hidden="true" className="h-px w-8 bg-emerald-600" />
                  About this piece
                </h2>
                <p className="mt-3 text-[.95rem] leading-7 text-[var(--color-ink)]/85">
                  {product.description}
                </p>
              </div>
            )}

            {Array.isArray(content.highlights) && content.highlights.some((h) => h?.title) && (
              <ul className="m-0 grid list-none grid-cols-1 gap-x-6 gap-y-2 p-0 sm:grid-cols-2">
                {content.highlights.filter((h) => h?.title).slice(0, 4).map((h, i) => (
                  <li key={`${h.title}-${i}`} className="flex items-start gap-2.5 text-[.88rem] font-medium text-[var(--color-ink)]">
                    <span aria-hidden="true" className="mt-[.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-700" />
                    {h.title}
                  </li>
                ))}
              </ul>
            )}

            <ProductMeta product={product} />
            <ProductTags product={product} />
          </div>
        </div>

        <aside className="min-w-0 lg:[@media(min-height:800px)]:sticky lg:[@media(min-height:800px)]:top-[6.5rem]">
          <div className="border border-[var(--color-line)] bg-[var(--color-surface)] p-5 sm:p-6 lg:p-7">
            {product.vendor && (
              <p className="m-0 text-[.68rem] font-semibold uppercase tracking-[.2em] text-[var(--green-700)] sm:text-[.72rem]">
                {product.vendor}
              </p>
            )}

            <h1 className="mt-3 max-w-[20ch] font-display text-[clamp(2rem,3vw,3rem)] font-medium leading-[1.05] tracking-[-.03em]">
              {product.title}
            </h1>

            <div className="mt-3">
              <RatingSummary reviews={reviews} />
            </div>

            <div className="my-5 border-t border-[var(--color-line)]" />

            <div className="mt-5">
              <ProductForm key={product.id} product={product} showPrice />
            </div>

          </div>
        </aside>
      </section>

      {/* Specifications: right after the product */}
      <ProductSpecs details={product.details} content={content} />

      {/* Product Content sections (Highlights, Stories, etc.) */}
      <ProductContent product={product} />

      {/* Reviews & ratings */}
      <ProductReviews
        reviews={reviews}
        productTitle={product.title}
        content={content}
        onSubmitReview={onSubmitReview}
      />

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-[var(--color-line)] bg-[var(--color-sand)] py-16 sm:py-24 lg:py-28">
          <div className="mx-auto w-[calc(100%-2*var(--gutter))] max-w-[var(--container-wide)]">
            {relatedTitle && (
              <div className="mb-10 sm:mb-14">
                <h2 className="max-w-[13ch] font-display text-[clamp(2.8rem,5vw,5rem)] font-medium leading-[.92] tracking-[-.04em]">
                  {relatedTitle}
                </h2>
              </div>
            )}
            <ProductGrid products={related} filterable={false} />
          </div>
        </section>
      )}

      {/* More products */}
      <ProductMore
        products={more}
        eyebrow={content.moreEyebrow}
        title={content.moreTitle || 'More to explore'}
        href="/collections/all"
      />

      {/* Mobile purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-[70] flex items-center justify-between gap-4 border-t border-[var(--color-line)] bg-[rgba(247,245,239,.96)] px-4 py-3 shadow-[0_-8px_30px_rgba(15,36,23,.08)] backdrop-blur-xl sm:hidden">
        <div className="min-w-0">
          <span className="block max-w-[55vw] truncate text-[.68rem] text-[var(--color-muted)]">
            {product.title}
          </span>
          {product.price && (
            <strong className="mt-1 block text-[.9rem] font-medium">
              {formatMoney(product.price)}
            </strong>
          )}
        </div>

        <a
          href="#product-purchase"
          className="shrink-0 bg-[var(--color-ink)] px-5 py-3.5 text-[.66rem] font-medium uppercase tracking-[.12em] text-white"
        >
          {product.options?.length ? 'Choose options' : 'Add to bag'}
        </a>
      </div>
    </main>
  );
}

export const productMeta = (product, canonical) => [
  {title: `${product.title} | ${product.vendor || 'Klaussner'}`},
  {name: 'description', content: (product.description || '').slice(0, 155)},
  {property: 'og:title', content: product.title},
  ...(product.images?.[0]?.url ? [{property: 'og:image', content: product.images[0].url}] : []),
  {tagName: 'link', rel: 'canonical', href: canonical},
];