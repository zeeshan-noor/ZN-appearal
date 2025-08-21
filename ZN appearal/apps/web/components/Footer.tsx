export default function Footer() {
	return (
		<footer className="mt-20 border-t border-gray-200">
			<div className="container-default py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
				<div>
					<div className="text-lg font-semibold text-brand">ZN Apparel</div>
					<p className="mt-3 text-gray-600">The complete solution for your apparel needs: planning to packaging.</p>
				</div>
				<div>
					<div className="font-medium">Head Office</div>
					<div className="mt-2 text-gray-600">94 Mcleod road Lahore - Pakistan</div>
					<div className="mt-1 text-gray-600">+92-312-4446779</div>
				</div>
				<div>
					<div className="font-medium">Email</div>
					<div className="mt-2 text-gray-600">info@znapparel.com</div>
				</div>
				<div>
					<div className="font-medium">Hours</div>
					<div className="mt-2 text-gray-600">Mon - Fri, 10am - 5pm</div>
				</div>
			</div>
			<div className="py-6 border-t border-gray-100 text-center text-xs text-gray-500">© {new Date().getFullYear()} <span className="text-brand">ZN Apparel</span></div>
		</footer>
	);
}



