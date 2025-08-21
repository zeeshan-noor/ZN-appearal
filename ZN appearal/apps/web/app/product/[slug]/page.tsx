import Link from 'next/link';
import Image from 'next/image';
import AddToCart from '../../../components/AddToCart';

async function fetchProduct(slug: string) {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
	const res = await fetch(`${base}/products/${slug}`, { cache: 'no-store' });
	if (!res.ok) return null;
	return res.json();
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
	const product = await fetchProduct(params.slug);
	if (!product) return <div className="container-default py-10">Product not found.</div>;
	return (
		<div className="container-default py-10 grid md:grid-cols-2 gap-10">
			<div className="aspect-video bg-gray-100 rounded overflow-hidden">
				{product.imageUrl ? (
					<Image src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:4000${product.imageUrl}`} alt={product.name} width={800} height={450} className="w-full h-full object-cover" />
				) : null}
			</div>
			<div>
				<h1 className="text-3xl font-bold">{product.name}</h1>
				<div className="mt-2 text-gray-600">{product.category?.name}</div>
				<p className="mt-5 text-gray-700 leading-relaxed">{product.description}</p>
				<div className="mt-6 text-2xl font-semibold">PKR {(product.price / 100).toLocaleString()}</div>
				<AddToCart product={product} />
			</div>
		</div>
	);
}

