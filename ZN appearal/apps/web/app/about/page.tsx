export default function AboutPage() {
	return (
		<div className="container-default py-10 space-y-12">
			<section>
				<h1 className="text-3xl md:text-4xl font-bold">Company Profile</h1>
				<p className="mt-4 text-gray-700 max-w-3xl">
					ZN Apparel empowers the apparel industry with cutting-edge machinery from leading global manufacturers. Our approach blends
					visionary planning, rigorous professionalism, and responsive service — enabling customers to scale from planning to packaging.
				</p>
			</section>

			<section className="grid md:grid-cols-3 gap-6">
				<div className="border rounded-lg p-6">
					<h3 className="text-xl font-semibold text-brand">Our Mission</h3>
					<p className="mt-3 text-gray-700">To accelerate the success of apparel manufacturers by delivering reliable, high-performance equipment and exceptional after-sales support.</p>
				</div>
				<div className="border rounded-lg p-6">
					<h3 className="text-xl font-semibold text-brand">Our Vision</h3>
					<p className="mt-3 text-gray-700">To be the trusted technology partner for the region’s most ambitious apparel brands — redefining precision, speed, and sustainability in production.</p>
				</div>
				<div className="border rounded-lg p-6">
					<h3 className="text-xl font-semibold text-brand">Our Values</h3>
					<ul className="mt-3 text-gray-700 list-disc pl-5 space-y-1">
						<li>Customer-first craftsmanship</li>
						<li>Honesty and accountability</li>
						<li>Continuous innovation</li>
						<li>Operational excellence</li>
					</ul>
				</div>
			</section>

			<section className="grid md:grid-cols-2 gap-8 items-start">
				<div className="space-y-3">
					<h3 className="text-2xl font-semibold">Our Presence</h3>
					<p className="text-gray-700">We serve customers nationwide with responsive coverage from Lahore HQ and regional teams, including Faisalabad and Sialkot. Visit our Faisalabad location in Green Town.</p>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<div className="font-medium">Lahore (Head Office)</div>
							<div className="text-gray-600">94 Mcleod road, Lahore</div>
						</div>
						<div>
							<div className="font-medium">Faisalabad</div>
							<div className="text-gray-600">Green Town, Faisalabad</div>
						</div>
					</div>
				</div>
				<div className="rounded-xl overflow-hidden border">
					{/* Google Map embed: Green Town, Faisalabad */}
					<iframe
						title="Green Town Faisalabad Map"
						className="w-full h-80"
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						src="https://www.google.com/maps?q=Green%20Town%20Faisalabad&output=embed"
					/>
				</div>
			</section>

			<section>
				<h3 className="text-2xl font-semibold">Brand Partners</h3>
				<p className="mt-2 text-gray-700">We collaborate with leading global suppliers to deliver proven, industrial-grade solutions.</p>
				<div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
					<div className="h-16 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-sm">Partner</div>
					<div className="h-16 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-sm">Partner</div>
					<div className="h-16 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-sm">Partner</div>
					<div className="h-16 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-sm">Partner</div>
					<div className="h-16 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-sm">Partner</div>
				</div>
			</section>

			<section className="border rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
				<div>
					<h3 className="text-xl font-semibold">Ready to modernize your production?</h3>
					<p className="text-gray-700 mt-1">Our specialists can help you plan, select, and deploy the right equipment for your line.</p>
				</div>
				<a href="/contact" className="px-5 py-3 bg-brand hover:bg-brand-light text-white rounded-md transition">Talk to an expert</a>
			</section>
		</div>
	);
}



