import {redirect, useLoaderData} from 'react-router';
import {getProduct, getProducts} from '~/lib/data';
import {getSiteNav} from '~/lib/navData';
import {buildIndex, productHref} from '~/lib/nav';
import {ProductView, productMeta} from '~/components/product/ProductView';

export const meta = ({data}) => (data ? productMeta(data.product, data.canonical) : []);

// /products/<handle> is the fallback URL; when the product's collection is in the Shopify menu we 301 to the nested URL.
export async function loader({params, request, context}) {
  const product = await getProduct(context, params.handle);
  if (!product) throw new Response('Not found', {status: 404});
  const nav = await getSiteNav(context);
  const path = productHref(buildIndex(nav.tree), product);
  if (!path.startsWith('/products/')) return redirect(path, 301);
  const {products} = await getProducts(context, {collection: product.collections[0], limit: 5});
  return {product, related: products.filter((p) => p.id !== product.id).slice(0, 4), canonical: new URL(path, request.url).href};
}

export default function Product() {
  const {product, related} = useLoaderData();
  return <ProductView product={product} related={related} />;
}
