import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';

// Optimized fetch function with proper caching
async function fetchProducts() {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
	
	try {
		const res = await fetch(`${base}/products`, { 
			next: { revalidate: 1800 } // Revalidate every 30 minutes
		});
		
		if (!res.ok) {
			throw new Error(`Failed to fetch products: ${res.status}`);
		}
		
		return res.json();
	} catch (error) {
		console.error('Error fetching products:', error);
		return [];
	}
}

// Loading component for the catalog content
function CatalogLoading() {
	return (
		<div className="container-default py-10">
			<div className="mb-6">
				<div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
			</div>
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="border rounded-lg p-4">
						<div className="aspect-video rounded mb-3 bg-gray-200 animate-pulse"></div>
						<div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
						<div className="h-3 bg-gray-200 rounded animate-pulse w-2/3 mb-2"></div>
						<div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
					</div>
				))}
			</div>
		</div>
	);
}

// Main catalog content component
async function CatalogContent({ searchParams }: { searchParams: { q?: string } }) {
	const products = await fetchProducts();
	
	if (products.length === 0) {
		return (
			<div className="container-default py-10">
				<div className="text-center">
					<div className="text-6xl mb-4">📦</div>
					<h1 className="text-2xl font-bold mb-4">No Products Found</h1>
					<p className="text-gray-600">We're currently updating our catalog. Please check back soon!</p>
				</div>
			</div>
		);
	}

	// Filter products if search query is provided
	const filteredProducts = searchParams.q 
		? products.filter((p: any) => 
			p.name.toLowerCase().includes(searchParams.q!.toLowerCase()) ||
			p.category?.name?.toLowerCase().includes(searchParams.q!.toLowerCase())
		)
		: products;

	return (
		<div className="container-default py-10">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">Products</h1>
				{searchParams.q && (
					<div className="text-sm text-gray-600">
						{filteredProducts.length} of {products.length} products
					</div>
				)}
			</div>
			
			{filteredProducts.length === 0 && searchParams.q ? (
				<div className="text-center py-10">
					<div className="text-4xl mb-4">🔍</div>
					<h2 className="text-xl font-semibold mb-2">No results found</h2>
					<p className="text-gray-600">Try adjusting your search terms</p>
				</div>
			) : (
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredProducts.map((p: any) => (
						<Link 
							key={p.id} 
							href={`/product/${p.slug}`} 
							className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 group"
						>
							<div className="aspect-video rounded mb-3 overflow-hidden bg-gray-100">
								{p.imageUrl ? (
									<Image 
										src={p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:4000${p.imageUrl}`} 
										alt={p.name} 
										width={640} 
										height={360} 
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										placeholder="blur"
										blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-400">
										<svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
										</svg>
									</div>
								)}
							</div>
							<div className="font-medium text-gray-900 group-hover:text-brand transition-colors">
								{p.name}
							</div>
							{p.category?.name && (
								<div className="text-sm text-gray-600 mt-1">{p.category.name}</div>
							)}
							<div className="mt-2 font-semibold text-brand">
								PKR {(p.price / 100).toLocaleString()}
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}

// Main page component with Suspense
export default function CatalogPage({ searchParams }: { searchParams: { q?: string } }) {
	return (
		<Suspense fallback={<CatalogLoading />}>
			<CatalogContent searchParams={searchParams} />
		</Suspense>
	);
}



