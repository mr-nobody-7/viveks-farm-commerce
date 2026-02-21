export function ProductCardSkeleton() {
	return (
		<div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
			<div className="aspect-square bg-gray-200" />
			<div className="p-4 space-y-3">
				<div className="h-4 bg-gray-200 rounded w-3/4" />
				<div className="h-3 bg-gray-200 rounded w-1/2" />
				<div className="h-8 bg-gray-200 rounded" />
			</div>
		</div>
	);
}

export function OrderCardSkeleton() {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
			<div className="space-y-3">
				<div className="h-4 bg-gray-200 rounded w-1/4" />
				<div className="h-3 bg-gray-200 rounded w-1/3" />
				<div className="h-6 bg-gray-200 rounded w-1/2" />
			</div>
		</div>
	);
}

export function MetricCardSkeleton() {
	return (
		<div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-pulse">
			<div className="space-y-3">
				<div className="h-4 bg-gray-200 rounded w-1/2" />
				<div className="h-8 bg-gray-200 rounded w-3/4" />
			</div>
		</div>
	);
}
