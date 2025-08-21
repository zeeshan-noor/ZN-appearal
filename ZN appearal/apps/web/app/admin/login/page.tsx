"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenValid, getToken } from '../../../lib/auth';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function AdminLogin() {
	const [email, setEmail] = useState('admin@znapparel.com');
	const [password, setPassword] = useState('Admin123!');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	// If already logged in, redirect to products
	if (typeof window !== 'undefined') {
		const existing = getToken();
		if (isTokenValid(existing)) {
			router.replace('/admin/products');
		}
	}

	return (
		<div className="container-default py-10 max-w-md">
			<h1 className="text-2xl font-bold">Admin Login</h1>
			<div className="mt-6 grid gap-4">
				<input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<input className="border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<button
					className="px-4 py-2 bg-brand text-white rounded"
					disabled={loading}
					onClick={async () => {
						setLoading(true);
						try {
							const res = await fetch(`${API}/auth/login`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ email, password }),
							});
							const data = await res.json();
							if (res.ok && data?.token) {
								localStorage.setItem('admin_token', data.token);
								router.push('/admin/products');
							} else {
								alert('Login failed');
							}
						} finally {
							setLoading(false);
						}
					}}
				>
					{loading ? 'Signing in…' : 'Sign in'}
				</button>
			</div>
		</div>
	);
}


