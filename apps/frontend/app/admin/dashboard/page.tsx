"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MetricCardSkeleton } from "@/components/Skeletons";

interface DashboardMetrics {
	totalOrders: number;
	totalRevenue: number;
	pendingOrders: number;
}

export default function AdminDashboardPage() {
	const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const router = useRouter();

	useEffect(() => {
		const fetchMetrics = async () => {
			try {
				const res = await fetch("http://localhost:4000/api/admin/dashboard", {
					credentials: "include",
				});

				if (!res.ok) {
					if (res.status === 401) {
						router.push("/admin/login");
						return;
					}
					throw new Error("Failed to fetch metrics");
				}

				const data = await res.json();
				setMetrics(data);
			} catch (err) {
				setError("Failed to load dashboard metrics");
			} finally {
				setLoading(false);
			}
		};

		fetchMetrics();
	}, [router]);

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<MetricCardSkeleton />
					<MetricCardSkeleton />
					<MetricCardSkeleton />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-red-600">{error}</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold">Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Total Orders Card */}
				<div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Total Orders
							</p>
							<p className="text-3xl font-bold mt-2">
								{metrics?.totalOrders || 0}
							</p>
						</div>
						<div className="bg-blue-100 p-3 rounded-full">
							<svg
								className="w-6 h-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* Total Revenue Card */}
				<div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Total Revenue
							</p>
							<p className="text-3xl font-bold mt-2">
								₹{metrics?.totalRevenue?.toLocaleString() || 0}
							</p>
						</div>
						<div className="bg-green-100 p-3 rounded-full">
							<svg
								className="w-6 h-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* Pending Orders Card */}
				<div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">
								Pending Orders
							</p>
							<p className="text-3xl font-bold mt-2">
								{metrics?.pendingOrders || 0}
							</p>
						</div>
						<div className="bg-yellow-100 p-3 rounded-full">
							<svg
								className="w-6 h-6 text-yellow-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
