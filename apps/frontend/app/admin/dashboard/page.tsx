"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartLegendContent,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
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

interface AdminSettings {
	allowCOD: boolean;
	deliveryCharge: number;
}

const revenueConfig = {
	revenue: { label: "Revenue", color: "hsl(142, 76%, 36%)" },
	orders: { label: "Orders", color: "hsl(210, 90%, 50%)" },
} satisfies ChartConfig;

const paymentConfig = {
	PAID: { label: "Paid", color: "hsl(142, 70%, 45%)" },
	FAILED: { label: "Failed", color: "hsl(0, 80%, 60%)" },
	PENDING: { label: "Pending", color: "hsl(45, 95%, 50%)" },
} satisfies ChartConfig;

export default function AdminDashboardPage() {
	const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
	const [settings, setSettings] = useState<AdminSettings | null>(null);
	const [settingsUpdating, setSettingsUpdating] = useState(false);
	const [deliveryChargeInput, setDeliveryChargeInput] = useState("");
	const [deliveryChargeUpdating, setDeliveryChargeUpdating] = useState(false);
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

				const [metricsData, analyticsRes, settingsRes] = await Promise.all([
					res.json(),
					fetch(`${API_URL}/api/admin/analytics`, {
						credentials: "include",
					}),
					fetch(`${API_URL}/api/admin/settings`, {
						credentials: "include",
					}),
				]);

				setMetrics(metricsData);

				if (analyticsRes.ok) {
					const analyticsData = await analyticsRes.json();
					setAnalytics(analyticsData);
				}

				if (settingsRes.ok) {
					const settingsData = (await settingsRes.json()) as AdminSettings;
					setSettings(settingsData);
					setDeliveryChargeInput(String(settingsData.deliveryCharge ?? 49));
				}
			} catch (err) {
				setError("Failed to load dashboard metrics");
			} finally {
				setLoading(false);
			}
		};

		fetchMetrics();
	}, [router]);

	const handleToggleCOD = async () => {
		if (!settings) {
			return;
		}

		setSettingsUpdating(true);

		try {
			const res = await fetch(`${API_URL}/api/admin/settings`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ allowCOD: !settings.allowCOD }),
			});

			if (!res.ok) {
				throw new Error("Failed to update COD setting");
			}

			const updated = (await res.json()) as AdminSettings;
			setSettings({ ...settings, allowCOD: updated.allowCOD, deliveryCharge: updated.deliveryCharge });
		} catch {
			setError("Failed to update COD setting");
		} finally {
			setSettingsUpdating(false);
		}
	};

	const handleUpdateDeliveryCharge = async () => {
		const value = Number(deliveryChargeInput);
		if (Number.isNaN(value) || value < 0) return;
		setDeliveryChargeUpdating(true);
		try {
			const res = await fetch(`${API_URL}/api/admin/settings`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ deliveryCharge: value }),
			});
			if (!res.ok) throw new Error("Failed");
			const updated = (await res.json()) as AdminSettings;
			setSettings((prev) => prev ? { ...prev, deliveryCharge: updated.deliveryCharge } : prev);
			setDeliveryChargeInput(String(updated.deliveryCharge));
		} catch {
			setError("Failed to update delivery charge");
		} finally {
			setDeliveryChargeUpdating(false);
		}
	};

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

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* COD Toggle */}
				<div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
					<div>
						<p className="text-sm font-medium text-gray-600">Cash on Delivery</p>
						<p className="text-sm text-gray-500">
							Current status: {settings?.allowCOD ? "Enabled" : "Disabled"}
						</p>
					</div>
					<button
						type="button"
						onClick={handleToggleCOD}
						disabled={!settings || settingsUpdating}
						className={`px-4 py-2 rounded-md text-sm font-medium ${
							settings?.allowCOD
								? "bg-red-100 text-red-700"
								: "bg-green-100 text-green-700"
						}`}
					>
						{settingsUpdating
							? "Updating..."
							: settings?.allowCOD
								? "Disable COD"
								: "Enable COD"}
					</button>
				</div>

				{/* Delivery Charge */}
				<div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
					<p className="text-sm font-medium text-gray-600 mb-3">Delivery Charge (₹)</p>
					<div className="flex gap-2">
						<input
							type="number"
							min="0"
							value={deliveryChargeInput}
							onChange={(e) => setDeliveryChargeInput(e.target.value)}
							className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
						/>
						<button
							type="button"
							onClick={handleUpdateDeliveryCharge}
							disabled={deliveryChargeUpdating || deliveryChargeInput === String(settings?.deliveryCharge ?? 49)}
							className="px-4 py-2 rounded-md text-sm font-medium bg-green-100 text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{deliveryChargeUpdating ? "Saving..." : "Save"}
						</button>
					</div>
				</div>
			</div>

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
						{analytics?.monthly.length ? (
							<ChartContainer config={revenueConfig}>
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={analytics.monthly.slice(-6)}>
										<CartesianGrid strokeDasharray="3 3" vertical={false} />
										<XAxis dataKey="label" tickLine={false} axisLine={false} />
										<Tooltip
											content={
												<ChartTooltipContent
													formatter={(value, item) => {
														if (item.dataKey === "revenue") {
															return `Rs.${value.toLocaleString()}`;
														}

														return value.toLocaleString();
													}}
												/>
											}
										/>
										<Legend content={<ChartLegendContent />} />
										<Bar dataKey="revenue" fill="var(--color-revenue)" radius={6} />
										<Bar dataKey="orders" fill="var(--color-orders)" radius={6} />
									</BarChart>
								</ResponsiveContainer>
							</ChartContainer>
						) : (
							<p className="text-sm text-gray-500">No revenue data yet.</p>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Payment Mix</CardTitle>
					</CardHeader>
					<CardContent>
						{analytics?.paymentSummary.length ? (
							<ChartContainer config={paymentConfig}>
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Tooltip
											content={
												<ChartTooltipContent
													formatter={(value) => value.toLocaleString()}
												/>
											}
										/>
										<Legend content={<ChartLegendContent />} />
										<Pie
											data={analytics.paymentSummary.map((item) => ({
												status: item._id,
												count: item.count,
											}))}
											nameKey="status"
											dataKey="count"
											innerRadius={55}
											outerRadius={90}
										>
											{analytics.paymentSummary.map((item) => (
												<Cell
													key={item._id}
													fill={`var(--color-${item._id})`}
												/>
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
							</ChartContainer>
						) : (
							<p className="text-sm text-gray-500">No payment data yet.</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
