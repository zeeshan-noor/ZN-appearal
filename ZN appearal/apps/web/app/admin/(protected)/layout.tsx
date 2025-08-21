"use client";
import { useRouter, usePathname } from 'next/navigation';
import { clearToken, getToken, isTokenValid } from '../../../lib/auth';
import { useEffect, useState } from 'react';

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const [showLogout, setShowLogout] = useState<boolean>(false);

	useEffect(() => {
		const token = getToken();
		const valid = isTokenValid(token);
		setShowLogout(valid);
		if (!valid) {
			router.replace('/admin/login');
		}
	}, [pathname]);

	return (
		<div className="container-default py-8">
			<div className="flex items-center justify-between gap-4">
				<h1 className="text-2xl font-bold">Admin Panel</h1>
				{showLogout ? (
					<button
						className="px-3 py-2 text-sm border border-brand text-brand rounded hover:bg-brand/10 transition"
						onClick={() => {
							clearToken();
							setShowLogout(false);
							router.replace('/admin/login');
						}}
					>
						Logout
					</button>
				) : null}
			</div>
			<div className="mt-6">{children}</div>
		</div>
	);
}


