"use client";
import { useState } from 'react';

export default function CheckoutPage() {
	const [submitting, setSubmitting] = useState(false);

	return (
		<div className="container-default py-10">
			<h1 className="text-2xl font-semibold">Checkout</h1>
			<form
				className="mt-6 grid sm:grid-cols-2 gap-6"
				onSubmit={async (e) => {
					e.preventDefault();
					setSubmitting(true);
					try {
						await fetch((process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000') + '/orders', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ userId: 'guest', items: [], shipping: {} }),
						});
						alert('Order placed!');
					} finally {
						setSubmitting(false);
					}
				}}
			>
				<div>
					<label className="block text-sm font-medium">Full Name</label>
					<input className="mt-2 w-full border rounded px-3 py-2" required />
				</div>
				<div>
					<label className="block text-sm font-medium">Email</label>
					<input type="email" className="mt-2 w-full border rounded px-3 py-2" required />
				</div>
				<div className="sm:col-span-2">
					<label className="block text-sm font-medium">Address</label>
					<input className="mt-2 w-full border rounded px-3 py-2" required />
				</div>
				<div className="sm:col-span-2">
					<button disabled={submitting} className="px-5 py-3 bg-brand text-white rounded-md">
						{submitting ? 'Placing...' : 'Place Order'}
					</button>
				</div>
			</form>
		</div>
	);
}



