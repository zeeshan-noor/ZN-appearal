"use client";
import Link from 'next/link';

export default function AdminHome() {
	return (
		<div className="grid gap-4">
			<Link className="px-4 py-3 border rounded hover:bg-gray-50" href="/admin/products">Manage Products</Link>
		</div>
	);
}


