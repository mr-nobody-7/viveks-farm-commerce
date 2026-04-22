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

export function AdminTableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="flex justify-between items-center">
				<div className="h-9 bg-gray-200 rounded w-40" />
				<div className="h-9 bg-gray-200 rounded w-28" />
			</div>
			<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<div className="bg-gray-50 px-6 py-3 flex gap-6">
					{Array.from({ length: cols }).map((_, i) => (
						<div key={i} className="h-3 bg-gray-200 rounded flex-1" />
					))}
				</div>
				<div className="divide-y divide-gray-100">
					{Array.from({ length: rows }).map((_, i) => (
						<div key={i} className="px-6 py-4 flex gap-6 items-center">
							{Array.from({ length: cols }).map((_, j) => (
								<div key={j} className={`h-4 bg-gray-200 rounded flex-1 ${j === 0 ? "max-w-48" : ""}`} />
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
