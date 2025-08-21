"use client";
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center min-h-[400px]">
			<div className="text-center">
				<motion.div
					animate={{ 
						rotate: 360,
						scale: [1, 1.1, 1]
					}}
					transition={{ 
						rotate: { duration: 2, repeat: Infinity, ease: "linear" },
						scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
					}}
					className="inline-block mb-4"
				>
					<svg
						width="48"
						height="48"
						viewBox="0 0 36 36"
						fill="none"
						className="text-brand"
					>
						<rect x="0" y="0" width="36" height="36" rx="8" className="fill-current" />
						{/* Stylized Z */}
						<path d="M10 11h16l-12 14h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
						{/* Needle detail */}
						<path d="M22 9l4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
					</svg>
				</motion.div>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="text-gray-600 font-medium"
				>
					Loading product...
				</motion.p>
			</div>
		</div>
	);
}
