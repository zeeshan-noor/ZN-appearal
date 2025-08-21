export default function Loading() {
	return (
		<div className="container-default py-10">
			<div className="mb-6">
				<div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
			</div>
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="border rounded-lg p-4">
						<div className="aspect-video rounded mb-3 bg-gray-200 animate-pulse"></div>
						<div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
						<div className="h-3 bg-gray-200 rounded animate-pulse w-2/3 mb-2"></div>
						<div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
					</div>
				))}
			</div>
		</div>
	);
}
