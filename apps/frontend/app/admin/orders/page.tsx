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
	items: Array<{
		quantity: number;
	}>;
	subtotalAmount: number;
	deliveryCharge: number;
	discountAmount: number;
	couponCode?: string;
	totalAmount: number;
	status: "PENDING" | "PLACED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
	paymentMethod: "ONLINE" | "COD";
	paymentStatus: "PENDING" | "PAID" | "FAILED";
	createdAt: string;
	updatedAt: string;
}

const orderStatusColors = {
	PENDING: "bg-gray-100 text-gray-800",
	PLACED: "bg-blue-100 text-blue-800",
	PACKED: "bg-orange-100 text-orange-800",
	SHIPPED: "bg-purple-100 text-purple-800",
	DELIVERED: "bg-green-100 text-green-800",
	CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<
		"ALL" | "SUCCESS" | "FAILED" | "PENDING"
	>("ALL");
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"ALL" | "PENDING" | "PLACED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED"
	>("ALL");
	const [paymentMethodFilter, setPaymentMethodFilter] = useState<
		"ALL" | "ONLINE" | "COD"
	>("ALL");
	const [paymentStatusFilter, setPaymentStatusFilter] = useState<
		"ALL" | "PENDING" | "PAID" | "FAILED"
	>("ALL");
	const [dateFrom, setDateFrom] = useState("");
	const [dateTo, setDateTo] = useState("");
	const [sortBy, setSortBy] = useState<
		"newest" | "oldest" | "amount-high" | "amount-low"
	>("newest");
	const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
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

	const formatCurrency = (amount: number) => `Rs.${amount.toLocaleString("en-IN")}`;

	const getItemsCount = (order: Order) =>
		order.items.reduce((sum, item) => sum + item.quantity, 0);

	const handleQuickStatusUpdate = async (
		order: Order,
		nextStatus: Order["status"],
	) => {
		if (order.status === nextStatus) {
			return;
		}

		if (
			(nextStatus === "SHIPPED" || nextStatus === "DELIVERED") &&
			order.paymentMethod === "ONLINE" &&
			order.paymentStatus !== "PAID"
		) {
			const shouldContinue = window.confirm(
				"This order is not paid yet. Continue updating status?",
			);

			if (!shouldContinue) {
				return;
			}
		}

		setUpdatingOrderId(order._id);

		try {
			const res = await fetch(`${API_URL}/api/admin/orders/${order._id}/status`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ status: nextStatus }),
			});

			if (!res.ok) {
				throw new Error("Failed to update order status");
			}

			setOrders((prevOrders) =>
				prevOrders.map((currentOrder) =>
					currentOrder._id === order._id
						? { ...currentOrder, status: nextStatus, updatedAt: new Date().toISOString() }
						: currentOrder,
				),
			);
		} catch (err) {
			console.error("Error updating status:", err);
			alert("Failed to update order status");
		} finally {
			setUpdatingOrderId(null);
		}
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

	const baseOrders =
		activeTab === "ALL"
			? orders
			: activeTab === "SUCCESS"
				? successfulOrders
				: activeTab === "FAILED"
					? failedOrders
					: pendingPaymentOrders;

	const filteredOrders = baseOrders.filter((order) => {
		const query = searchQuery.trim().toLowerCase();
		const matchesQuery =
			query.length === 0 ||
			order._id.toLowerCase().includes(query) ||
			(order.user.name || "").toLowerCase().includes(query) ||
			order.user.mobile.toLowerCase().includes(query) ||
			(order.couponCode || "").toLowerCase().includes(query);

		const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
		const matchesPaymentMethod =
			paymentMethodFilter === "ALL" || order.paymentMethod === paymentMethodFilter;
		const matchesPaymentStatus =
			paymentStatusFilter === "ALL" || order.paymentStatus === paymentStatusFilter;

		const orderDate = new Date(order.createdAt);
		const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
		const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;
		const matchesFromDate = !fromDate || orderDate >= fromDate;
		const matchesToDate = !toDate || orderDate <= toDate;

		return (
			matchesQuery &&
			matchesStatus &&
			matchesPaymentMethod &&
			matchesPaymentStatus &&
			matchesFromDate &&
			matchesToDate
		);
	});

	const displayedOrders = [...filteredOrders].sort((a, b) => {
		if (sortBy === "newest") {
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		}

		if (sortBy === "oldest") {
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		}

		if (sortBy === "amount-high") {
			return b.totalAmount - a.totalAmount;
		}

		return a.totalAmount - b.totalAmount;
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<h1 className="text-3xl font-bold">Orders</h1>
				<div className="text-sm text-gray-500">
					Showing: {displayedOrders.length} / {orders.length} orders
				</div>
			</div>

			<div className="flex flex-wrap gap-2">
				<button
					type="button"
					onClick={() => setActiveTab("ALL")}
					className={`px-3 py-2 rounded-md text-sm font-medium ${
						activeTab === "ALL"
							? "bg-gray-800 text-white"
							: "bg-gray-100 text-gray-700"
					}`}
				>
					All ({orders.length})
				</button>
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

			<div className="bg-white rounded-lg border border-gray-200 p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search by order ID, name, phone, coupon"
					className="px-3 py-2 border border-gray-300 rounded-md text-sm"
				/>
				<select
					value={statusFilter}
					onChange={(e) =>
						setStatusFilter(
							e.target.value as
								| "ALL"
								| "PENDING"
								| "PLACED"
								| "PACKED"
								| "SHIPPED"
								| "DELIVERED"
								| "CANCELLED",
						)
					}
					className="px-3 py-2 border border-gray-300 rounded-md text-sm"
				>
					<option value="ALL">All Order Statuses</option>
					<option value="PENDING">PENDING</option>
					<option value="PLACED">PLACED</option>
					<option value="PACKED">PACKED</option>
					<option value="SHIPPED">SHIPPED</option>
					<option value="DELIVERED">DELIVERED</option>
					<option value="CANCELLED">CANCELLED</option>
				</select>
				<select
					value={paymentMethodFilter}
					onChange={(e) =>
						setPaymentMethodFilter(e.target.value as "ALL" | "ONLINE" | "COD")
					}
					className="px-3 py-2 border border-gray-300 rounded-md text-sm"
				>
					<option value="ALL">All Payment Methods</option>
					<option value="ONLINE">ONLINE</option>
					<option value="COD">COD</option>
				</select>
				<select
					value={paymentStatusFilter}
					onChange={(e) =>
						setPaymentStatusFilter(
							e.target.value as "ALL" | "PENDING" | "PAID" | "FAILED",
						)
					}
					className="px-3 py-2 border border-gray-300 rounded-md text-sm"
				>
					<option value="ALL">All Payment Statuses</option>
					<option value="PENDING">PENDING</option>
					<option value="PAID">PAID</option>
					<option value="FAILED">FAILED</option>
				</select>
				<input
					type="date"
					value={dateFrom}
					onChange={(e) => setDateFrom(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded-md text-sm"
				/>
				<input
					type="date"
					value={dateTo}
					onChange={(e) => setDateTo(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded-md text-sm"
				/>
				<select
					value={sortBy}
					onChange={(e) =>
						setSortBy(
							e.target.value as
								| "newest"
								| "oldest"
								| "amount-high"
								| "amount-low",
						)
					}
					className="px-3 py-2 border border-gray-300 rounded-md text-sm"
				>
					<option value="newest">Sort: Newest First</option>
					<option value="oldest">Sort: Oldest First</option>
					<option value="amount-high">Sort: Amount High-Low</option>
					<option value="amount-low">Sort: Amount Low-High</option>
				</select>
				<button
					type="button"
					onClick={() => {
						setSearchQuery("");
						setStatusFilter("ALL");
						setPaymentMethodFilter("ALL");
						setPaymentStatusFilter("ALL");
						setDateFrom("");
						setDateTo("");
						setSortBy("newest");
					}}
					className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 hover:bg-gray-100"
				>
					Reset Filters
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
						<table className="min-w-400 divide-y divide-gray-200">
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
									Items
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Subtotal
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Discount
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Delivery
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Total
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Coupon
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
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Updated
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
										colSpan={15}
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
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{getItemsCount(order)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{formatCurrency(order.subtotalAmount || 0)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
											-{formatCurrency(order.discountAmount || 0)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{formatCurrency(order.deliveryCharge || 0)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{formatCurrency(order.totalAmount)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{order.couponCode || "-"}
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
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{formatDate(order.updatedAt || order.createdAt)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<select
												value={order.status}
												onChange={(e) =>
													handleQuickStatusUpdate(
														order,
														e.target.value as Order["status"],
													)
												}
											disabled={updatingOrderId === order._id || order.status === "CANCELLED" || order.status === "DELIVERED"}
											className="mr-3 px-2 py-1 border border-gray-300 rounded text-xs disabled:bg-gray-100 disabled:cursor-not-allowed"
										>
											<option value="PLACED">PLACED</option>
											<option value="PACKED">PACKED</option>
											<option value="SHIPPED">SHIPPED</option>
											<option value="DELIVERED">DELIVERED</option>
											{order.status === "CANCELLED" && <option value="CANCELLED">CANCELLED</option>}
											{order.status === "PENDING" && <option value="PENDING">PENDING</option>}
											</select>
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
