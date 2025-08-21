import './globals.css';
import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CartProvider } from '../components/cart/CartContext';

export const metadata: Metadata = {
	title: 'ZN Apparel — Precision Textile & Apparel Machinery',
	description: 'Professional apparel machinery, precision cutting, knitwear, denim, plotters & more. Order online with secure checkout.',
	icons: {
		icon: '/icon.svg',
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<CartProvider>
					<Header />
					{children}
					<Footer />
				</CartProvider>
			</body>
		</html>
	);
}


