"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useCart } from './cart/CartContext';

export default function Header() {
	const pathname = usePathname();
	const linkCls = (href: string) =>
		`hover:text-brand ${pathname === href ? 'text-brand font-medium' : 'text-gray-700'}`;
	const { count } = useCart();
	return (
		<header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
			<div className="container-default h-[var(--header-height)] flex items-center justify-between">
				<Logo />
				<nav className="flex items-center gap-6 text-sm">
					<Link className={linkCls('/catalog')} href="/catalog">Products</Link>
					<Link className={linkCls('/about')} href="/about">Company</Link>
					<Link className={linkCls('/contact')} href="/contact">Contact</Link>
					<Link className={linkCls('/cart')} href="/cart">Cart{count > 0 ? ` (${count})` : ''}</Link>
				</nav>
			</div>
		</header>
	);
}



