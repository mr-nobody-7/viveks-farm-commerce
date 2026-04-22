"use client";

import { Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderCardSkeleton } from "@/components/Skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Order {
	_id: string;
	totalAmount: number;
	status:
		| "PLACED"
		| "PACKED"
		| "SHIPPED"
		| "DELIVERED"
		| "PENDING"
		| "CANCELLED";
	paymentStatus: "PENDING" | "PAID" | "FAILED";
	paymentMethod: "ONLINE" | "COD";
	createdAt: string;
}

const statusColors = {
	PLACED: "bg-blue-500",
	PACKED: "bg-orange-500",
	SHIPPED: "bg-purple-500",
	DELIVERED: "bg-green-500",
	PENDING: "bg-gray-500",
	CANCELLED: "bg-red-500",
};

const paymentStatusColors = {
	PENDING: "bg-yellow-500",
	PAID: "bg-green-500",
	FAILED: "bg-red-500",
};

const Orders = () => {
	const user = useAuthStore((state) => state.user);
	const router = useRouter();
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) {
			router.push("/");
			return;
		}

		const fetchOrders = async () => {
			try {
				const response = await fetch(`${API_URL}/api/orders/user`, {
					credentials: "include",
					cache: "no-store",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch orders");
				}

				const data = await response.json();
				setOrders(data);
			} catch (err) {
				console.error("Failed to load orders", err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [user, router]);

	if (loading) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
				<div className="flex items-center justify-between mb-8">
					<div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
					<div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
				</div>
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<OrderCardSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
				<h1 className="text-3xl font-bold">My Orders</h1>
				<Button variant="outline" className="w-full sm:w-auto" asChild>
					<Link href="/profile">Back to Profile</Link>
				</Button>
			</div>

			{orders.length === 0 ? (
				<div className="text-center py-20 space-y-4">
					<Package className="h-16 w-16 mx-auto text-muted-foreground" />
					<h2 className="text-xl font-semibold">No orders yet</h2>
					<p className="text-muted-foreground">
						Start shopping to see your orders here
					</p>
					<Button asChild>
						<Link href="/shop">Continue Shopping</Link>
					</Button>
				</div>
			) : (
				<div className="space-y-4">
					{orders.map((order) => (
						<Card key={order._id}>
							<CardContent className="p-6">
								<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<span className="text-sm text-muted-foreground">
												Order ID:
											</span>
											<span className="font-mono font-semibold">
												#{order._id.slice(-8).toUpperCase()}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-sm text-muted-foreground">
												Date:
											</span>
											<span className="text-sm">
												{new Date(order.createdAt).toLocaleDateString("en-IN", {
													day: "numeric",
													month: "short",
													year: "numeric",
												})}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-sm text-muted-foreground">
												Total:
											</span>
											<span className="font-semibold">
												₹{order.totalAmount}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Badge
												className={`${statusColors[order.status]} text-white`}
											>
												{order.status}
											</Badge>
											<Badge
												className={`${paymentStatusColors[order.paymentStatus]} text-white`}
											>
												{order.paymentStatus}
											</Badge>
											<Badge variant="outline">{order.paymentMethod}</Badge>
										</div>
									</div>
									<Button className="w-full sm:w-auto" asChild>
										<Link href={`/profile/orders/${order._id}`}>
											View Details
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
};

export default Orders;
