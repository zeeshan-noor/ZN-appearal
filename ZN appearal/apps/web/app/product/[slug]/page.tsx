import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import AddToCart from '../../../components/AddToCart';
import LoadingSpinner from '../../../components/LoadingSpinner';

// Optimized fetch function with proper caching
async function fetchProduct(slug: string) {
	const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
	
	try {
		const res = await fetch(`${base}/products/${slug}`, { 
			next: { revalidate: 3600 } // Revalidate every hour
		});
		
		if (!res.ok) {
			throw new Error(`Failed to fetch product: ${res.status}`);
		}
		
		return res.json();
	} catch (error) {
		console.error('Error fetching product:', error);
		return null;
	}
}

// Loading component for the product content
function ProductLoading() {
	return <LoadingSpinner />;
}

// Error component
function ProductError() {
	return (
		<div className="container-default py-10">
			<div className="text-center">
				<div className="text-6xl mb-4">😕</div>
				<h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
				<p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
				<Link 
					href="/catalog" 
					className="inline-flex items-center px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
				>
					Browse Our Catalog
				</Link>
			</div>
		</div>
	);
}

// Main product content component
async function ProductContent({ slug }: { slug: string }) {
	const product = await fetchProduct(slug);
	
	if (!product) {
		return <ProductError />;
	}

	return (
		<div className="container-default py-10">
			<div className="grid md:grid-cols-2 gap-10">
				{/* Product Image */}
				<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-lg">
					{product.imageUrl ? (
						<Image 
							src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:4000${product.imageUrl}`} 
							alt={product.name} 
							width={800} 
							height={450} 
							className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
							priority // Load image with high priority
							placeholder="blur"
							blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-gray-400">
							<svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
							</svg>
						</div>
					)}
				</div>
				
				{/* Product Details */}
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
						{product.category?.name && (
							<div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
								{product.category.name}
							</div>
						)}
					</div>
					
					{product.description && (
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
							<p className="text-gray-700 leading-relaxed">{product.description}</p>
						</div>
					)}
					
					<div className="border-t pt-6">
						<div className="flex items-baseline gap-2 mb-6">
							<span className="text-3xl font-bold text-gray-900">
								PKR {(product.price / 100).toLocaleString()}
							</span>
							{product.originalPrice && product.originalPrice > product.price && (
								<span className="text-lg text-gray-500 line-through">
									PKR {(product.originalPrice / 100).toLocaleString()}
								</span>
							)}
						</div>
						
						<AddToCart product={product} />
					</div>
				</div>
			</div>
		</div>
	);
}

// Main page component with Suspense
export default function ProductPage({ params }: { params: { slug: string } }) {
	return (
		<Suspense fallback={<ProductLoading />}>
			<ProductContent slug={params.slug} />
		</Suspense>
	);
}

