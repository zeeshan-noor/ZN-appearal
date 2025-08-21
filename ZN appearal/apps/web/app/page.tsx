"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Stats = dynamic(() => import('../components/Stats'), { ssr: false });

export default function HomePage() {
	return (
		<main>

			<section className="relative overflow-hidden">
				<div className="container-default grid md:grid-cols-2 gap-10 items-center py-16">
					<div>
						<motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-gray-900">
							Cutting-edge apparel machinery for modern production
						</motion.h1>
						<p className="mt-5 text-gray-600">From knitwear to denim cutting and high-speed plotters, ZN Apparel delivers precision machines with reliable support and fast delivery in Pakistan.</p>
						<div className="mt-8 flex gap-4">
							<Link href="/catalog" className="px-5 py-3 bg-brand hover:bg-brand-light text-white rounded-md transition">Explore Products</Link>
							<Link href="/contact" className="px-5 py-3 border border-brand text-brand rounded-md hover:bg-brand/10 transition">Get a Quote</Link>
						</div>
					</div>
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="relative h-80 rounded-xl overflow-hidden shadow-lg">
						<Image src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop" alt="Industrial sewing machine" fill className="object-cover"/>
					</motion.div>
				</div>
			</section>

			<section className="py-12 border-t border-gray-100">
				<div className="container-default grid md:grid-cols-3 gap-8">
					<div>
						<h3 className="font-semibold text-lg">Reliability in Every Stitch</h3>
						<p className="text-gray-600 mt-2">Industrial-grade machines engineered for consistent performance and longevity.</p>
					</div>
					<div>
						<h3 className="font-semibold text-lg">Comprehensive Support</h3>
						<p className="text-gray-600 mt-2">Training, maintenance, and troubleshooting to keep your production uninterrupted.</p>
					</div>
					<div>
						<h3 className="font-semibold text-lg">Tailored Solutions</h3>
						<p className="text-gray-600 mt-2">From planning to packaging, we enable your complete apparel production workflow.</p>
					</div>
				</div>
			</section>

			<Stats />
		</main>
	);
}


