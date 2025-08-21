"use client";
import Link from 'next/link';
import { useCart } from '../../components/cart/CartContext';

export default function CartPage() {
	const { items, setQty, removeItem, subtotal, clear } = useCart();
	return (
		<div className="container-default py-10">
			<h1 className="text-2xl font-semibold">Your Cart</h1>
			{items.length === 0 ? (
				<div className="mt-6 text-gray-600">Your cart is empty.</div>
			) : (
				<div className="mt-6 grid md:grid-cols-3 gap-8">
					<div className="md:col-span-2 grid gap-4">
						{items.map((i) => (
							<div key={i.id} className="flex items-center gap-4 border rounded p-3">
								{i.imageUrl ? <img src={i.imageUrl} alt={i.name} className="h-16 w-16 object-cover rounded"/> : <div className="h-16 w-16 bg-gray-100 rounded"/>}
								<div className="flex-1">
									<div className="font-medium">{i.name}</div>
									<div className="text-sm text-gray-600">PKR {(i.price / 100).toLocaleString()}</div>
								</div>
								<input type="number" min={1} className="w-20 border rounded px-2 py-1" value={i.qty} onChange={(e) => setQty(i.id, Number(e.target.value))} />
								<button className="text-sm text-red-600" onClick={() => removeItem(i.id)}>Remove</button>
							</div>
						))}
					</div>
					<div className="border rounded p-4">
						<div className="font-semibold">Summary</div>
						<div className="mt-3 flex justify-between">
							<div>Subtotal</div>
							<div>PKR {(subtotal / 100).toLocaleString()}</div>
						</div>
						<div className="mt-4 flex gap-2">
							<Link href="/checkout" className="flex-1 text-center px-4 py-2 bg-brand text-white rounded">Checkout</Link>
							<button className="px-4 py-2 border rounded" onClick={() => clear()}>Clear</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}



