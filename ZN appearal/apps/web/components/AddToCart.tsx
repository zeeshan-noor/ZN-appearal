"use client";
import { useCart } from './cart/CartContext';
import Link from 'next/link';

type ProductLite = {
  id: string;
  slug: string;
  name: string;
  price: number; // cents
  imageUrl?: string | null;
};

export default function AddToCart({ product }: { product: ProductLite }) {
  const { addItem } = useCart();
  return (
    <div className="mt-6 flex gap-3">
      <button
        className="px-5 py-3 bg-brand hover:bg-brand-light text-white rounded-md transition"
        onClick={() => addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, imageUrl: product.imageUrl })}
      >
        Add to Cart
      </button>
      <Link href="/checkout" className="px-5 py-3 border border-brand text-brand rounded-md hover:bg-brand/10 transition">Buy Now</Link>
    </div>
  );
}


