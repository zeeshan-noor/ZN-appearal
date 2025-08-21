export default function ContactPage() {
	return (
		<div className="container-default py-10 grid md:grid-cols-2 gap-10">
			<div>
				<h1 className="text-3xl font-bold">Have Any Query? Feel Free to Contact</h1>
				<p className="mt-4 text-gray-700">Call us 24/7 or fill out the form.</p>
				<div className="mt-6 space-y-2">
					<div className="font-medium">Lahore Head Office</div>
					<div>94 Mcleod road Lahore - Pakistan</div>
					<div>Cell: +92-312-4446779</div>
					<div>Email: info@znapparel.com</div>
				</div>
			</div>
			<form className="border rounded-lg p-6 space-y-4">
				<div>
					<label className="block text-sm font-medium">Your Name</label>
					<input className="mt-2 w-full border rounded px-3 py-2" />
				</div>
				<div>
					<label className="block text-sm font-medium">Your Email</label>
					<input type="email" className="mt-2 w-full border rounded px-3 py-2" />
				</div>
				<div>
					<label className="block text-sm font-medium">Message</label>
					<textarea className="mt-2 w-full border rounded px-3 py-2 h-32" />
				</div>
				<button className="px-5 py-3 bg-brand hover:bg-brand-light text-white rounded-md transition">Submit Inquiry</button>
			</form>
		</div>
	);
}



