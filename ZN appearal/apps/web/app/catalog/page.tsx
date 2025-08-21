import Link from 'next/link';
import Image from 'next/image';

async function fetchProducts() {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
	const res = await fetch(`${base}/products`, { cache: 'no-store' });
	return res.json();
}

export default async function CatalogPage({ searchParams }: { searchParams: { q?: string } }) {
	const products = await fetchProducts();
	return (
		<div className="container-default py-10">
			<h1 className="text-2xl font-semibold">Products</h1>
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{products.map((p: any) => (
					<Link key={p.id} href={`/product/${p.slug}`} className="border rounded-lg p-4 hover:shadow">
						<div className="aspect-video rounded mb-3 overflow-hidden bg-gray-100">
							{p.imageUrl ? (
								<Image src={p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:4000${p.imageUrl}`} alt={p.name} width={640} height={360} className="w-full h-full object-cover" />
							) : null}
						</div>
						<div className="font-medium">{p.name}</div>
						<div className="text-sm text-gray-600 mt-1">{p.category?.name}</div>
						<div className="mt-2 font-semibold">PKR {(p.price / 100).toLocaleString()}</div>
					</Link>
				))}
			</div>
		</div>
	);
}



