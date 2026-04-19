"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCardSkeleton } from "@/components/Skeletons";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface DashboardMetrics {
	totalOrders: number;
	totalRevenue: number;
	pendingOrders: number;
}

interface AnalyticsResponse {
	paymentSummary: Array<{ _id: string; count: number }>;
	orderStatusSummary: Array<{ _id: string; count: number }>;
	monthly: Array<{ label: string; revenue: number; orders: number }>;
}

export default function AdminDashboardPage() {
	const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchMetrics = async () => {
			try {
				const res = await fetch(`${API_URL}/api/admin/dashboard`, {
					credentials: "include",
				});

				if (!res.ok) {
					if (res.status === 401) {
						router.push("/admin/login");
						return;
					}
					throw new Error("Failed to fetch metrics");
				}

				const [metricsData, analyticsRes] = await Promise.all([
					res.json(),
					fetch(`${API_URL}/api/admin/analytics`, {
						credentials: "include",
					}),
				]);

				setMetrics(metricsData);

				if (analyticsRes.ok) {
					const analyticsData = await analyticsRes.json();
					setAnalytics(analyticsData);
				}
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

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Revenue Trend (Paid Orders)</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{analytics?.monthly.length ? (
								analytics.monthly.slice(-6).map((entry) => {
									const maxRevenue =
										Math.max(...analytics.monthly.map((m) => m.revenue), 1);
									const width = Math.max(
										8,
										Math.round((entry.revenue / maxRevenue) * 100),
									);

									return (
										<div key={entry.label} className="space-y-1">
											<div className="flex items-center justify-between text-xs text-gray-600">
												<span>{entry.label}</span>
												<span>₹{entry.revenue.toLocaleString()}</span>
											</div>
											<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
												<div
													className="h-full bg-green-500 rounded-full"
													style={{ width: `${width}%` }}
												/>
											</div>
										</div>
									);
								})
							) : (
								<p className="text-sm text-gray-500">No revenue data yet.</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Payment Mix</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{analytics?.paymentSummary.length ? (
								analytics.paymentSummary.map((item) => {
									const total = analytics.paymentSummary.reduce(
										(sum, entry) => sum + entry.count,
										0,
									);
									const percent = total
										? Math.round((item.count / total) * 100)
										: 0;

									return (
										<div key={item._id} className="space-y-1">
											<div className="flex items-center justify-between text-sm">
												<span className="font-medium">{item._id}</span>
												<span className="text-gray-600">
													{item.count} ({percent}%)
												</span>
											</div>
											<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
												<div
													className={`h-full rounded-full ${
														item._id === "PAID"
															? "bg-green-500"
															: item._id === "FAILED"
																? "bg-red-500"
																: "bg-yellow-500"
													}`}
													style={{ width: `${Math.max(percent, 6)}%` }}
												/>
											</div>
										</div>
									);
								})
							) : (
								<p className="text-sm text-gray-500">No payment data yet.</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
