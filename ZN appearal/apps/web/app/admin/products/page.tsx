"use client";
import { useEffect, useState } from 'react';
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
};

type Category = {
	id: string;
	name: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function AdminProducts() {
	const [products, setProducts] = useState<Product[]>([]);
	const [token, setToken] = useState<string>('');
	const [form, setForm] = useState<any>({ name: '', slug: '', price: 0, imageUrl: '', description: '', categoryId: '' });
	const [uploading, setUploading] = useState(false);
	const [categories, setCategories] = useState<Category[]>([]);
	const router = useRouter();
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editForm, setEditForm] = useState<any>({ name: '', slug: '', price: 0, imageUrl: '', description: '', inStock: true });
	const [editUploading, setEditUploading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		const t = getToken();
		if (!isTokenValid(t)) {
			router.replace('/admin/login');
			return;
		}
		setToken(t as string);
		fetch(`${API}/products`).then((r) => r.json()).then(setProducts);
		fetch(`${API}/categories`).then((r) => r.json()).then((cats) => {
			setCategories(cats);
			setForm((f: any) => ({ ...f, categoryId: cats?.[0]?.id ?? '' }));
		});
	}, []);

	return (
		<div className="grid gap-6">
			<div className="border rounded p-4 grid gap-3">
				<div className="text-lg font-semibold">Add product</div>
				{/* Token field removed; using localStorage token */}
				<div className="grid sm:grid-cols-2 gap-3">
					<input placeholder="Name" className="border rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
					<input placeholder="Slug" className="border rounded px-3 py-2" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
					<input type="number" placeholder="Price (PKR)" className="border rounded px-3 py-2" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
					<div className="grid gap-2">
						<input
							type="file"
							accept="image/*"
							onChange={async (e) => {
								const file = e.target.files?.[0];
								if (!file) return;
								setUploading(true);
								try {
									const fd = new FormData();
									fd.append('file', file);
									const res = await fetch(`${API}/products/upload-image`, {
										method: 'POST',
										headers: { Authorization: `Bearer ${token}` },
										body: fd,
									});
									const data = await res.json();
									if (res.ok && data.url) {
										setForm({ ...form, imageUrl: data.url });
									} else {
										alert('Image upload failed');
									}
								} finally {
									setUploading(false);
								}
						}}
						/>
						{form.imageUrl ? (
							<img src={form.imageUrl} alt="Preview" className="h-24 w-24 object-cover rounded border" />
						) : null}
						{uploading ? <div className="text-xs text-gray-500">Uploading…</div> : null}
					</div>
					<textarea placeholder="Description" className="border rounded px-3 py-2 sm:col-span-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
					<select className="border rounded px-3 py-2" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
						{categories.map((c) => (
							<option key={c.id} value={c.id}>{c.name}</option>
						))}
					</select>
				</div>
				<button
					className="px-4 py-2 bg-brand text-white rounded"
					onClick={async () => {
						const res = await fetch(`${API}/products`, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
							body: JSON.stringify({ ...form, price: Number(form.price) * 100 }),
						});
						if (res.ok) {
							setForm({ name: '', slug: '', price: 0, imageUrl: '', description: '', categoryId: form.categoryId });
							const list = await fetch(`${API}/products`).then((r) => r.json());
							setProducts(list);
						} else {
							alert('Failed to add product');
						}
					}}
				>
					Create
				</button>
			</div>

			<div className="grid gap-3">
				<div className="text-lg font-semibold">Existing products</div>
				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{products.map((p) => (
						<div key={p.id} className="border rounded p-3 flex flex-col gap-2">
							<div className="flex items-center gap-3">
								{p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-14 w-14 object-cover rounded border" /> : <div className="h-14 w-14 bg-gray-100 rounded" />}
								<div>
									<div className="font-medium">{p.name}</div>
									<div className="text-sm text-gray-600">{p.slug}</div>
								</div>
							</div>
							<div className="text-sm">PKR {(p.price / 100).toLocaleString()}</div>
							<div className="mt-1 flex gap-2">
								<button className="px-3 py-1 text-sm border rounded hover:bg-gray-50" onClick={() => {
									setEditingId(p.id);
									setEditForm({ name: p.name, slug: p.slug, price: Math.round(p.price / 100), imageUrl: p.imageUrl || '', description: p.description || '', inStock: p.inStock ?? true });
								}}>Edit</button>
								<button disabled={deletingId === p.id} className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50" onClick={async () => {
									if (!confirm('Delete this product?')) return;
									setDeletingId(p.id);
									const res = await fetch(`${API}/products/${p.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
									if (res.ok) setProducts((prev) => prev.filter((x) => x.id !== p.id));
									else alert('Failed to delete');
									setDeletingId(null);
								}}>Delete</button>
							</div>

							{editingId === p.id ? (
								<div className="mt-3 border-t pt-3 grid gap-3">
									<div className="grid sm:grid-cols-2 gap-3">
										<input placeholder="Name" className="border rounded px-3 py-2" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
										<input placeholder="Slug" className="border rounded px-3 py-2" value={editForm.slug} onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} />
										<input type="number" placeholder="Price (PKR)" className="border rounded px-3 py-2" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} />
										<div className="grid gap-2">
											<input
												type="file"
												accept="image/*"
												onChange={async (e) => {
													const file = e.target.files?.[0];
													if (!file) return;
													setEditUploading(true);
													try {
														const fd = new FormData();
														fd.append('file', file);
														const res = await fetch(`${API}/products/upload-image`, {
															method: 'POST',
															headers: { Authorization: `Bearer ${token}` },
															body: fd,
														});
														const data = await res.json();
														if (res.ok && data.url) setEditForm({ ...editForm, imageUrl: data.url });
														else alert('Image upload failed');
													} finally {
														setEditUploading(false);
													}
											}}
											/>
											{editForm.imageUrl ? <img src={editForm.imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded border" /> : null}
											{editUploading ? <div className="text-xs text-gray-500">Uploading…</div> : null}
										</div>
										<textarea placeholder="Description" className="border rounded px-3 py-2 sm:col-span-2" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
									</div>
									<div className="flex gap-2">
										<button disabled={saving} className="px-4 py-2 bg-brand text-white rounded" onClick={async () => {
											setSaving(true);
											const res = await fetch(`${API}/products/${p.id}`, {
												method: 'PUT',
												headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
												body: JSON.stringify({ ...editForm, price: Number(editForm.price) * 100 }),
											});
											if (res.ok) {
												const list = await fetch(`${API}/products`).then((r) => r.json());
												setProducts(list);
												setEditingId(null);
											} else {
												alert('Failed to update');
											}
											setSaving(false);
										}}>
											Save
										</button>
										<button className="px-4 py-2 border rounded" onClick={() => setEditingId(null)}>Cancel</button>
									</div>
								</div>
							) : null}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}


