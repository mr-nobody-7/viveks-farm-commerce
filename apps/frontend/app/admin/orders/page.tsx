"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";
import { OrderCardSkeleton } from "@/components/Skeletons";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
	_id: string;
	mobile: string;
	name?: string;
}

interface Order {
	_id: string;
	user: User;
	totalAmount: number;
	status: "PENDING" | "PLACED" | "PACKED" | "SHIPPED" | "DELIVERED";
	paymentMethod: "ONLINE" | "COD";
	paymentStatus: "PENDING" | "PAID" | "FAILED";
	createdAt: string;
}

const orderStatusColors = {
	PENDING: "bg-gray-100 text-gray-800",
	PLACED: "bg-blue-100 text-blue-800",
	PACKED: "bg-orange-100 text-orange-800",
	SHIPPED: "bg-purple-100 text-purple-800",
	DELIVERED: "bg-green-100 text-green-800",
};

const paymentStatusColors = {
	PENDING: "bg-yellow-100 text-yellow-800",
	PAID: "bg-green-100 text-green-800",
	FAILED: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<"SUCCESS" | "FAILED" | "PENDING">(
		"SUCCESS",
	);
	const router = useRouter();

	const fetchOrders = async () => {
		try {
			const res = await fetch(`${API_URL}/api/admin/orders`, {
				credentials: "include",
			});

			if (!res.ok) {
				if (res.status === 401) {
					router.push("/admin/login");
					return;
				}
				throw new Error("Failed to fetch orders");
			}

			const data = await res.json();
			setOrders(data);
		} catch (err) {
			console.error("Error fetching orders:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, [router]);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
					<div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
				</div>
				<div className="space-y-4">
					{[1, 2, 3, 4].map((i) => (
						<OrderCardSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	const successfulOrders = orders.filter(
		(order) => order.paymentMethod === "COD" || order.paymentStatus === "PAID",
	);
	const failedOrders = orders.filter((order) => order.paymentStatus === "FAILED");
	const pendingPaymentOrders = orders.filter(
		(order) => order.paymentMethod === "ONLINE" && order.paymentStatus === "PENDING",
	);

	const displayedOrders =
		activeTab === "SUCCESS"
			? successfulOrders
			: activeTab === "FAILED"
				? failedOrders
				: pendingPaymentOrders;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<h1 className="text-3xl font-bold">Orders</h1>
				<div className="text-sm text-gray-500">
					Total: {orders.length} orders
				</div>
			</div>

			<div className="flex flex-wrap gap-2">
				<button
					type="button"
					onClick={() => setActiveTab("SUCCESS")}
					className={`px-3 py-2 rounded-md text-sm font-medium ${
						activeTab === "SUCCESS"
							? "bg-green-100 text-green-700"
							: "bg-gray-100 text-gray-700"
					}`}
				>
					Successful / COD ({successfulOrders.length})
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("FAILED")}
					className={`px-3 py-2 rounded-md text-sm font-medium ${
						activeTab === "FAILED"
							? "bg-red-100 text-red-700"
							: "bg-gray-100 text-gray-700"
					}`}
				>
					Failed Payments ({failedOrders.length})
				</button>
				<button
					type="button"
					onClick={() => setActiveTab("PENDING")}
					className={`px-3 py-2 rounded-md text-sm font-medium ${
						activeTab === "PENDING"
							? "bg-yellow-100 text-yellow-700"
							: "bg-gray-100 text-gray-700"
					}`}
				>
					Pending Payments ({pendingPaymentOrders.length})
				</button>
			</div>

			{displayedOrders.length === 0 ? (
				<div className="bg-white rounded-lg border border-gray-200 p-12 text-center space-y-4">
					<Package className="h-16 w-16 mx-auto text-gray-400" />
					<h3 className="text-xl font-semibold text-gray-700">No orders in this section</h3>
					<p className="text-gray-500">
						Switch tabs to review other order groups.
					</p>
				</div>
			) : (
				<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="min-w-[1100px] divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Order ID
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Date
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Customer
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Mobile
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Total
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Payment
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Payment Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Order Status
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{displayedOrders.length === 0 ? (
								<tr>
									<td
										colSpan={9}
										className="px-6 py-12 text-center text-gray-500"
									>
										No orders found
									</td>
								</tr>
							) : (
								displayedOrders.map((order) => (
									<tr key={order._id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
											#{order._id.slice(-8).toUpperCase()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{formatDate(order.createdAt)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{order.user.name || "Guest"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{order.user.mobile}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											₹{order.totalAmount.toLocaleString()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{order.paymentMethod}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
													paymentStatusColors[order.paymentStatus]
												}`}
											>
												{order.paymentStatus}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
													orderStatusColors[order.status]
												}`}
											>
												{order.status}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<Link
												href={`/admin/orders/${order._id}`}
												className="text-blue-600 hover:text-blue-900"
											>
												View
											</Link>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
			)}
		</div>
	);
}
