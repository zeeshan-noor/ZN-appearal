"use client";
import { useEffect, useState, useMemo } from 'react';
import { isTokenValid, getToken } from '../../../lib/auth';
import { useRouter } from 'next/navigation';

type Product = {
	id: string;
	name: string;
	slug: string;
	price: number;
	imageUrl?: string | null;
	description?: string | null;
	inStock?: boolean;
	quantity?: number;
	category?: {
		id: string;
		name: string;
	};
	createdAt?: string;
	updatedAt?: string;
};

type Category = {
	id: string;
	name: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function AdminProducts() {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [token, setToken] = useState<string>('');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const router = useRouter();

	// Form states
	const [form, setForm] = useState<any>({ 
		name: '', 
		slug: '', 
		price: 0, 
		imageUrl: '', 
		description: '', 
		categoryId: '',
		inStock: true,
		quantity: 0
	});
	const [uploading, setUploading] = useState(false);

	// Edit states
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editForm, setEditForm] = useState<any>({ 
		name: '', 
		slug: '', 
		price: 0, 
		imageUrl: '', 
		description: '', 
		inStock: true,
		quantity: 0
	});
	const [editUploading, setEditUploading] = useState(false);

	// Search and filter states
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [stockFilter, setStockFilter] = useState<string>('all');
	const [quantityFilter, setQuantityFilter] = useState<string>('all');
	const [sortBy, setSortBy] = useState<string>('name');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [showAddForm, setShowAddForm] = useState(false);

	useEffect(() => {
		const t = getToken();
		if (!isTokenValid(t)) {
			router.replace('/admin/login');
			return;
		}
		setToken(t as string);
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		try {
			const [productsRes, categoriesRes] = await Promise.all([
				fetch(`${API}/products`),
				fetch(`${API}/categories`)
			]);
			
			const productsData = await productsRes.json();
			const categoriesData = await categoriesRes.json();
			
			setProducts(productsData);
			setCategories(categoriesData);
			
			if (categoriesData.length > 0) {
				setForm((f: any) => ({ ...f, categoryId: categoriesData[0].id }));
			}
		} catch (error) {
			console.error('Error loading data:', error);
		} finally {
			setLoading(false);
		}
	};

	// Filtered and sorted products
	const filteredProducts = useMemo(() => {
		let filtered = products.filter(product => {
			// Search filter
			const matchesSearch = searchTerm === '' || 
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

			// Category filter
			const matchesCategory = selectedCategory === 'all' || 
				product.category?.id === selectedCategory;

			// Stock filter
			const matchesStock = stockFilter === 'all' || 
				(stockFilter === 'inStock' && product.inStock) ||
				(stockFilter === 'outOfStock' && !product.inStock);

			// Quantity filter
			const matchesQuantity = quantityFilter === 'all' || 
				(quantityFilter === 'lowStock' && (product.quantity || 0) <= 10 && (product.quantity || 0) > 0) ||
				(quantityFilter === 'outOfStock' && (product.quantity || 0) === 0) ||
				(quantityFilter === 'wellStocked' && (product.quantity || 0) > 10);

			return matchesSearch && matchesCategory && matchesStock && matchesQuantity;
		});

		// Sorting
		filtered.sort((a, b) => {
			let aValue: any, bValue: any;
			
			switch (sortBy) {
				case 'name':
					aValue = a.name.toLowerCase();
					bValue = b.name.toLowerCase();
					break;
				case 'price':
					aValue = a.price;
					bValue = b.price;
					break;
				case 'category':
					aValue = a.category?.name || '';
					bValue = b.category?.name || '';
					break;
				case 'createdAt':
					aValue = new Date(a.createdAt || 0);
					bValue = new Date(b.createdAt || 0);
					break;
				case 'quantity':
					aValue = a.quantity || 0;
					bValue = b.quantity || 0;
					break;
				default:
					aValue = a.name.toLowerCase();
					bValue = b.name.toLowerCase();
			}

			if (sortOrder === 'asc') {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

		return filtered;
	}, [products, searchTerm, selectedCategory, stockFilter, quantityFilter, sortBy, sortOrder]);

	const handleCreateProduct = async () => {
		if (!form.name || !form.slug || !form.price || !form.categoryId || form.quantity < 0) {
			alert('Please fill in all required fields and ensure quantity is not negative');
			return;
		}

		setSaving(true);
		try {
			const res = await fetch(`${API}/products`, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json', 
					Authorization: `Bearer ${token}` 
				},
				body: JSON.stringify({ 
					...form, 
					price: Number(form.price) * 100 
				}),
			});
			
			if (res.ok) {
				setForm({ 
					name: '', 
					slug: '', 
					price: 0, 
					imageUrl: '', 
					description: '', 
					categoryId: categories[0]?.id || '',
					inStock: true,
					quantity: 0
				});
				await loadData();
				setShowAddForm(false);
			} else {
				const error = await res.text();
				alert(`Failed to add product: ${error}`);
			}
		} catch (error) {
			alert('Failed to add product');
		} finally {
			setSaving(false);
		}
	};

	const handleUpdateProduct = async (productId: string) => {
		setSaving(true);
		try {
			const updateData = { 
				...editForm, 
				price: Number(editForm.price) * 100 
			};
			console.log('Sending update data:', updateData); // Debug log
			
			const res = await fetch(`${API}/products/${productId}`, {
				method: 'PUT',
				headers: { 
					'Content-Type': 'application/json', 
					Authorization: `Bearer ${token}` 
				},
				body: JSON.stringify(updateData),
			});
			
			if (res.ok) {
				await loadData();
				setEditingId(null);
			} else {
				const error = await res.text();
				alert(`Failed to update product: ${error}`);
			}
		} catch (error) {
			alert('Failed to update product');
		} finally {
			setSaving(false);
		}
	};

	const handleDeleteProduct = async (productId: string) => {
		if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
			return;
		}

		setDeletingId(productId);
		try {
			const res = await fetch(`${API}/products/${productId}`, { 
				method: 'DELETE', 
				headers: { Authorization: `Bearer ${token}` } 
			});
			
			if (res.ok) {
				setProducts(prev => prev.filter(p => p.id !== productId));
			} else {
				alert('Failed to delete product');
			}
		} catch (error) {
			alert('Failed to delete product');
		} finally {
			setDeletingId(null);
		}
	};

	const handleImageUpload = async (file: File, isEdit: boolean = false) => {
		const formData = new FormData();
		formData.append('file', file);
		
		if (isEdit) {
			setEditUploading(true);
		} else {
			setUploading(true);
		}

		try {
			const res = await fetch(`${API}/products/upload-image`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
				body: formData,
			});
			
			const data = await res.json();
			if (res.ok && data.url) {
				if (isEdit) {
					setEditForm((prev: any) => ({ ...prev, imageUrl: data.url }));
				} else {
					setForm((prev: any) => ({ ...prev, imageUrl: data.url }));
				}
			} else {
				alert('Image upload failed');
			}
		} catch (error) {
			alert('Image upload failed');
		} finally {
			if (isEdit) {
				setEditUploading(false);
			} else {
				setUploading(false);
			}
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
					<p className="text-gray-600">Loading products...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with Add Product Button */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold text-gray-900">Product Management</h2>
					<p className="text-sm text-gray-600 mt-1">
						{filteredProducts.length} of {products.length} products
					</p>
				</div>
				<button
					onClick={() => setShowAddForm(!showAddForm)}
					className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors flex items-center gap-2"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
					{showAddForm ? 'Cancel' : 'Add Product'}
				</button>
			</div>

			{/* Add Product Form */}
			{showAddForm && (
				<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
					<h3 className="text-lg font-semibold mb-4">Add New Product</h3>
					<div className="grid md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
							<input 
								placeholder="Product name" 
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-transparent" 
								value={form.name} 
								onChange={(e) => setForm({ ...form, name: e.target.value })} 
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
							<input 
								placeholder="product-slug" 
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-transparent" 
								value={form.slug} 
								onChange={(e) => setForm({ ...form, slug: e.target.value })} 
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR) *</label>
							<input 
								type="number" 
								placeholder="0" 
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-transparent" 
								value={form.price} 
								onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} 
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
							<select 
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-transparent" 
								value={form.categoryId} 
								onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
							>
								{categories.map((c) => (
									<option key={c.id} value={c.id}>{c.name}</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
							<input 
								type="number" 
								placeholder="0" 
								min="0"
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-transparent" 
								value={form.quantity} 
								onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} 
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
							<textarea 
								placeholder="Product description..." 
								rows={3}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-transparent" 
								value={form.description} 
								onChange={(e) => setForm({ ...form, description: e.target.value })} 
							/>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
							<div className="flex items-center gap-4">
								<input
									type="file"
									accept="image/*"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) handleImageUpload(file);
									}}
									className="flex-1"
								/>
								{form.imageUrl && (
									<img src={form.imageUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg border" />
								)}
								{uploading && (
									<div className="text-sm text-gray-500">Uploading...</div>
								)}
							</div>
						</div>
						<div className="md:col-span-2">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={form.inStock}
									onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
									className="rounded border-gray-300 text-brand focus:ring-brand"
								/>
								<span className="text-sm font-medium text-gray-700">In Stock</span>
							</label>
						</div>
					</div>
					<div className="flex gap-3 mt-6">
						<button
							disabled={saving}
							onClick={handleCreateProduct}
							className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50"
						>
							{saving ? 'Creating...' : 'Create Product'}
						</button>
						<button
							onClick={() => setShowAddForm(false)}
							className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			{/* Search and Filter Controls */}
			<div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
				<div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
						<input
							type="text"
							placeholder="Search products..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-transparent"
						>
							<option value="all">All Categories</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>{category.name}</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
						<select
							value={stockFilter}
							onChange={(e) => setStockFilter(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-transparent"
						>
							<option value="all">All Products</option>
							<option value="inStock">In Stock</option>
							<option value="outOfStock">Out of Stock</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Quantity Level</label>
						<select
							value={quantityFilter}
							onChange={(e) => setQuantityFilter(e.target.value)}
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-transparent"
						>
							<option value="all">All Quantities</option>
							<option value="wellStocked">Well Stocked (&gt;10)</option>
							<option value="lowStock">Low Stock (1-10)</option>
							<option value="outOfStock">Out of Stock (0)</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
						<div className="flex gap-2">
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand focus:border-transparent"
							>
								<option value="name">Name</option>
								<option value="price">Price</option>
								<option value="category">Category</option>
								<option value="quantity">Quantity</option>
								<option value="createdAt">Date Created</option>
							</select>
							<button
								onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
								className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
								title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
							>
								{sortOrder === 'asc' ? '↑' : '↓'}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Products Grid */}
			<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
				{filteredProducts.length === 0 ? (
					<div className="p-8 text-center">
						<div className="text-4xl mb-4">📦</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
						<p className="text-gray-600">
							{searchTerm || selectedCategory !== 'all' || stockFilter !== 'all' || quantityFilter !== 'all'
								? 'Try adjusting your search or filters' 
								: 'Get started by adding your first product'
							}
						</p>
					</div>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
						{filteredProducts.map((product) => (
							<div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
								{/* Product Header */}
								<div className="flex items-start gap-3 mb-3">
									<div className="flex-shrink-0">
										{product.imageUrl ? (
											<img src={product.imageUrl} alt={product.name} className="h-16 w-16 object-cover rounded-lg border" />
										) : (
											<div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
												<svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
												</svg>
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
										<p className="text-sm text-gray-500 truncate">{product.slug}</p>
										{product.category && (
											<span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full mt-1">
												{product.category.name}
											</span>
										)}
									</div>
									<div className="flex-shrink-0">
										<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
											product.inStock 
												? 'bg-green-100 text-green-800' 
												: 'bg-red-100 text-red-800'
										}`}>
											{product.inStock ? 'In Stock' : 'Out of Stock'}
										</span>
									</div>
								</div>

								{/* Product Details */}
								<div className="space-y-2 mb-4">
									<div className="flex items-center justify-between">
										<div className="text-lg font-semibold text-gray-900">
											PKR {(product.price / 100).toLocaleString()}
										</div>
										<div className="flex items-center gap-2">
											<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
												(product.quantity || 0) > 10 
													? 'bg-green-100 text-green-800' 
													: (product.quantity || 0) > 0 
													? 'bg-yellow-100 text-yellow-800'
													: 'bg-red-100 text-red-800'
											}`}>
												{product.quantity || 0} in stock
											</span>
										</div>
									</div>
									{product.description && (
										<p className="text-sm text-gray-600 line-clamp-2">
											{product.description}
										</p>
									)}
								</div>

								{/* Action Buttons */}
								<div className="flex gap-2">
									<button 
										className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
										onClick={() => {
											setEditingId(product.id);
											setEditForm({ 
												name: product.name, 
												slug: product.slug, 
												price: Math.round(product.price / 100), 
												imageUrl: product.imageUrl || '', 
												description: product.description || '', 
												inStock: product.inStock ?? true,
												quantity: product.quantity || 0
											});
										}}
									>
										Edit
									</button>
									<button 
										disabled={deletingId === product.id}
										className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
										onClick={() => handleDeleteProduct(product.id)}
									>
										{deletingId === product.id ? 'Deleting...' : 'Delete'}
									</button>
								</div>

								{/* Edit Form */}
								{editingId === product.id && (
									<div className="mt-4 pt-4 border-t border-gray-200">
										<h5 className="font-medium text-gray-900 mb-3">Edit Product</h5>
										<div className="space-y-3">
											<div className="grid grid-cols-2 gap-3">
												<input 
													placeholder="Name" 
													className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-transparent" 
													value={editForm.name} 
													onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
												/>
												<input 
													placeholder="Slug" 
													className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-transparent" 
													value={editForm.slug} 
													onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} 
												/>
											</div>
											<div className="grid grid-cols-2 gap-3">
												<input 
													type="number" 
													placeholder="Price (PKR)" 
													className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-transparent" 
													value={editForm.price} 
													onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} 
												/>
												<input 
													type="number" 
													placeholder="Quantity" 
													min="0"
													className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-transparent" 
													value={editForm.quantity} 
													onChange={(e) => setEditForm({ ...editForm, quantity: Number(e.target.value) })} 
												/>
											</div>
											<div className="flex items-center gap-3">
												<input
													type="file"
													accept="image/*"
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) handleImageUpload(file, true);
													}}
													className="flex-1 text-sm"
												/>
												{editForm.imageUrl && (
													<img src={editForm.imageUrl} alt="Preview" className="h-12 w-12 object-cover rounded border" />
												)}
												{editUploading && (
													<div className="text-xs text-gray-500">Uploading...</div>
												)}
											</div>
											<textarea 
												placeholder="Description" 
												rows={2}
												className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-transparent" 
												value={editForm.description} 
												onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} 
											/>
											<label className="flex items-center gap-2">
												<input
													type="checkbox"
													checked={editForm.inStock}
													onChange={(e) => setEditForm({ ...editForm, inStock: e.target.checked })}
													className="rounded border-gray-300 text-brand focus:ring-brand"
												/>
												<span className="text-sm text-gray-700">In Stock</span>
											</label>
										</div>
										<div className="flex gap-2 mt-4">
											<button 
												disabled={saving}
												onClick={() => handleUpdateProduct(product.id)}
												className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50 text-sm"
											>
												{saving ? 'Saving...' : 'Save'}
											</button>
											<button 
												onClick={() => setEditingId(null)}
												className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
											>
												Cancel
											</button>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}


