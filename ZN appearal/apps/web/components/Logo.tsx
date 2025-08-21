"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Logo() {
	return (
		<Link href="/" aria-label="ZN Apparel Home" className="inline-flex items-center gap-2 group">
			<motion.svg
				initial={{ opacity: 0, y: -4 }}
				animate={{ opacity: 1, y: 0 }}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.98 }}
				width="36"
				height="36"
				viewBox="0 0 36 36"
				fill="none"
				className="shrink-0"
			>
				<rect x="0" y="0" width="36" height="36" rx="8" className="fill-brand" />
				{/* Stylized Z */}
				<path d="M10 11h16l-12 14h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
				{/* Needle detail */}
				<path d="M22 9l4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
			</motion.svg>
			<span className="hidden sm:inline text-base font-semibold text-gray-900 tracking-tight">ZN Apparel</span>
		</Link>
	);
}


