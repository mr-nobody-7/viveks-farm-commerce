"use client";

import { CheckCircle2, Circle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
	_id: string;
	mobile: string;
	name?: string;
}

interface OrderItem {
	productId: string;
	name: string;
	image: string;
	variantLabel: string;
	price: number;
	quantity: number;
}

interface Address {
	fullName: string;
	phone: string;
	addressLine: string;
	city: string;
	state: string;
	pincode: string;
}

interface Order {
	_id: string;
	user: User;
	items: OrderItem[];
	subtotalAmount: number;
	deliveryCharge: number;
	discountAmount: number;
	couponCode?: string;
	totalAmount: number;
	address: Address;
	status:
		| "PENDING"
		| "PLACED"
		| "PACKED"
		| "SHIPPED"
		| "DELIVERED"
		| "CANCELLED";
	paymentMethod: "ONLINE" | "COD";
	paymentStatus: "PENDING" | "PAID" | "FAILED";
	razorpayOrderId?: string;
	razorpayPaymentId?: string;
	createdAt: string;
	updatedAt: string;
}

interface OrderDetailProps {
	params: Promise<{ id: string }>;
}

const orderStatusColors = {
	PENDING: "bg-gray-100 text-gray-800",
	PLACED: "bg-blue-100 text-blue-800",
	PACKED: "bg-orange-100 text-orange-800",
	SHIPPED: "bg-purple-100 text-purple-800",
	DELIVERED: "bg-green-100 text-green-800",
	CANCELLED: "bg-red-100 text-red-800",
};

const paymentStatusColors: Record<string, string> = {
	PENDING: "bg-yellow-100 text-yellow-800",
	PAID: "bg-green-100 text-green-800",
	FAILED: "bg-red-100 text-red-800",
};

export default function AdminOrderDetailPage({ params }: OrderDetailProps) {
	const { id } = use(params);
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	const router = useRouter();

	const fetchOrder = useCallback(async () => {
		try {
			const res = await fetch(`${API_URL}/api/admin/orders/${id}`, {
				credentials: "include",
			});

			if (!res.ok) {
				if (res.status === 401) {
					router.push("/admin/login");
					return;
				}
				throw new Error("Failed to fetch order");
			}

			const data = await res.json();
			setOrder(data);
			setSelectedStatus(data.status);
		} catch (err) {
			console.error("Error fetching order:", err);
		} finally {
			setLoading(false);
		}
	}, [id, router]);

	useEffect(() => {
		fetchOrder();
	}, [fetchOrder]);

	const handleUpdateStatus = async () => {
		if (!order || selectedStatus === order.status) return;

		// Warn if trying to ship unpaid order
		if (
			selectedStatus === "SHIPPED" &&
			order.paymentStatus !== "PAID" &&
			order.paymentMethod === "ONLINE"
		) {
			const confirm = window.confirm(
				"This order is not paid yet. Are you sure you want to ship it?",
			);
			if (!confirm) return;
		}

		setUpdating(true);
		try {
			const res = await fetch(`${API_URL}/api/admin/orders/${id}/status`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ status: selectedStatus }),
			});

			if (!res.ok) throw new Error("Failed to update status");

			await fetchOrder(); // Refetch to get updated data
			alert("Order status updated successfully!");
		} catch (err) {
			console.error("Error updating status:", err);
			alert("Failed to update order status");
		} finally {
			setUpdating(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return (
			<div className="space-y-6 animate-pulse">
				<div className="h-4 bg-gray-200 rounded w-24" />
				<div className="h-9 bg-gray-200 rounded w-56" />
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2 space-y-6">
						<div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
							<div className="h-5 bg-gray-200 rounded w-40" />
							<div className="grid grid-cols-2 gap-4">
								{["name", "phone", "address", "city", "state", "pincode"].map(
									(field) => (
										<div key={`skeleton-field-${field}`} className="space-y-1">
											<div className="h-3 bg-gray-200 rounded w-20" />
											<div className="h-4 bg-gray-200 rounded w-32" />
										</div>
									),
								)}
							</div>
						</div>
						<div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
							<div className="h-5 bg-gray-200 rounded w-32" />
							<div className="h-4 bg-gray-200 rounded w-48" />
							<div className="h-4 bg-gray-200 rounded w-36" />
						</div>
					</div>
					<div className="bg-white rounded-lg border border-gray-200 p-6 h-48" />
				</div>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center space-y-4">
					<p className="text-gray-500">Order not found</p>
					<Link
						href="/admin/orders"
						className="text-blue-600 hover:text-blue-900"
					>
						Back to Orders
					</Link>
				</div>
			</div>
		);
	}

	const itemsSubtotal = order.items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<Link
						href="/admin/orders"
						className="text-sm text-blue-600 hover:text-blue-900 mb-2 inline-block"
					>
						← Back to Orders
					</Link>
					<h1 className="text-3xl font-bold">
						Order #{order._id.slice(-8).toUpperCase()}
					</h1>
				</div>
			</div>

			{/* Status Timeline */}
			{order.status === "CANCELLED" ? (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
					<XCircle className="h-6 w-6 text-red-500 shrink-0" />
					<div>
						<p className="font-semibold text-red-700">Order Cancelled</p>
						<p className="text-sm text-red-600">
							This order was cancelled by the customer.
						</p>
					</div>
				</div>
			) : (
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
						Order Progress
					</h2>
					<div className="flex items-center justify-between">
						{(["PLACED", "PACKED", "SHIPPED", "DELIVERED"] as const).map(
							(step, i, arr) => {
								const steps = ["PLACED", "PACKED", "SHIPPED", "DELIVERED"];
								const currentIdx = steps.indexOf(order.status);
								const stepIdx = steps.indexOf(step);
								const isDone = stepIdx <= currentIdx;
								return (
									<div key={step} className="flex items-center flex-1">
										<div className="flex flex-col items-center gap-1">
											{isDone ? (
												<CheckCircle2 className="h-6 w-6 text-green-600" />
											) : (
												<Circle className="h-6 w-6 text-gray-300" />
											)}
											<span
												className={`text-xs font-medium ${isDone ? "text-green-700" : "text-gray-400"}`}
											>
												{step}
											</span>
										</div>
										{i < arr.length - 1 && (
											<div
												className={`flex-1 h-0.5 mx-2 ${stepIdx < currentIdx ? "bg-green-400" : "bg-gray-200"}`}
											/>
										)}
									</div>
								);
							},
						)}
					</div>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - Order Details */}
				<div className="lg:col-span-2 space-y-6">
					{/* Order Info Card */}
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h2 className="text-lg font-semibold mb-4">Order Information</h2>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-500">Order ID</p>
								<p className="font-mono font-medium">
									#{order._id.slice(-8).toUpperCase()}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Order Date</p>
								<p className="font-medium">{formatDate(order.createdAt)}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Last Updated</p>
								<p className="font-medium">{formatDate(order.updatedAt)}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Payment Method</p>
								<p className="font-medium">{order.paymentMethod}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Payment Status</p>
								<span
									className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
										paymentStatusColors[order.paymentStatus]
									}`}
								>
									{order.paymentStatus}
								</span>
							</div>
							<div>
								<p className="text-sm text-gray-500">Order Status</p>
								<span
									className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
										orderStatusColors[order.status]
									}`}
								>
									{order.status}
								</span>
							</div>
							{order.razorpayOrderId && (
								<div>
									<p className="text-sm text-gray-500">Razorpay Order ID</p>
									<p className="font-mono text-sm">{order.razorpayOrderId}</p>
								</div>
							)}
							{order.razorpayPaymentId && (
								<div>
									<p className="text-sm text-gray-500">Razorpay Payment ID</p>
									<p className="font-mono text-sm">{order.razorpayPaymentId}</p>
								</div>
							)}
						</div>
					</div>

					{/* Customer Info Card */}
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h2 className="text-lg font-semibold mb-4">Customer Information</h2>
						<div className="space-y-3">
							<div>
								<p className="text-sm text-gray-500">Name</p>
								<p className="font-medium">{order.user.name || "Guest"}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Mobile</p>
								<p className="font-medium">{order.user.mobile}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Delivery Address</p>
								<p className="font-medium">{order.address.fullName}</p>
								<p className="text-gray-700">{order.address.addressLine}</p>
								<p className="text-gray-700">
									{order.address.city}, {order.address.state}{" "}
									{order.address.pincode}
								</p>
								<p className="text-gray-700">Phone: {order.address.phone}</p>
							</div>
						</div>
					</div>

					{/* Items Card */}
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h2 className="text-lg font-semibold mb-4">Order Items</h2>
						<div className="space-y-4">
							{order.items.map((item, _index) => (
								<div
									key={`${item.productId}-${item.variantLabel}`}
									className="flex items-center gap-4 pb-4 border-b last:border-b-0 last:pb-0"
								>
									{item.image && (
										<Image
											src={item.image}
											alt={item.name}
											width={64}
											height={64}
											className="w-16 h-16 rounded object-cover"
										/>
									)}
									<div className="flex-1">
										<p className="font-medium">{item.name}</p>
										<p className="text-sm text-gray-500">{item.variantLabel}</p>
										<p className="text-sm text-gray-500">
											Qty: {item.quantity}
										</p>
									</div>
									<div className="text-right">
										<p className="font-medium">
											₹{(item.price * item.quantity).toLocaleString()}
										</p>
										<p className="text-sm text-gray-500">
											₹{item.price.toLocaleString()} each
										</p>
									</div>
								</div>
							))}
						</div>
						<div className="mt-4 pt-4 border-t space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-gray-500">Subtotal</span>
								<span>
									₹{(order.subtotalAmount ?? itemsSubtotal).toLocaleString()}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-gray-500">Delivery</span>
								<span>₹{(order.deliveryCharge ?? 0).toLocaleString()}</span>
							</div>
							{(order.discountAmount ?? 0) > 0 && (
								<div className="flex justify-between text-sm text-green-700">
									<span>
										Coupon{" "}
										{order.couponCode ? `(${order.couponCode})` : "Discount"}
									</span>
									<span>−₹{order.discountAmount.toLocaleString()}</span>
								</div>
							)}
							<div className="flex justify-between font-semibold text-lg border-t pt-2">
								<span>Total</span>
								<span>₹{order.totalAmount.toLocaleString()}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Status Update */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
						<h2 className="text-lg font-semibold mb-4">Update Status</h2>
						<div className="space-y-4">
							<div>
								<label
									htmlFor="status"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Order Status
								</label>
								<select
									id="status"
									value={selectedStatus}
									onChange={(e) => setSelectedStatus(e.target.value)}
									disabled={
										order.status === "CANCELLED" || order.status === "DELIVERED"
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
								>
									<option value="PLACED">PLACED</option>
									<option value="PACKED">PACKED</option>
									<option value="SHIPPED">SHIPPED</option>
									<option value="DELIVERED">DELIVERED</option>
								</select>
								{(order.status === "CANCELLED" ||
									order.status === "DELIVERED") && (
									<p className="text-xs text-gray-500 mt-1">
										Status cannot be changed for {order.status.toLowerCase()}{" "}
										orders.
									</p>
								)}
							</div>

							{order.paymentStatus !== "PAID" &&
								order.paymentMethod === "ONLINE" &&
								selectedStatus === "SHIPPED" && (
									<div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
										<p className="text-sm text-yellow-800">
											⚠️ Warning: This order is not paid yet. Shipping unpaid
											orders may result in payment issues.
										</p>
									</div>
								)}

							<Button
								onClick={handleUpdateStatus}
								disabled={updating || selectedStatus === order.status}
								className="w-full"
							>
								{updating ? "Updating..." : "Update Status"}
							</Button>

							<div className="pt-4 border-t">
								<p className="text-xs text-gray-500">
									Current status: <strong>{order.status}</strong>
								</p>
								<p className="text-xs text-gray-500 mt-1">
									Last updated: {formatDate(order.updatedAt)}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
