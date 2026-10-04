import {CartLines} from '~/components/cart/CartLines';

export const meta = () => [{title: 'Your bag | Klaussner'}, {name: 'robots', content: 'noindex'}];
export default function CartPage() {
  return (
    <div className="mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] [padding-block:var(--section-y)] [max-width:720px]">
      <h1>Your bag</h1>
      <CartLines />
    </div>
  );
}