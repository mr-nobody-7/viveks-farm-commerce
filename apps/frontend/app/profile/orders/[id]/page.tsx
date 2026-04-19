"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ArrowLeft } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
	items: OrderItem[];
	totalAmount: number;
	address: Address;
	status: "PLACED" | "PACKED" | "SHIPPED" | "DELIVERED" | "PENDING";
	paymentStatus: "PENDING" | "PAID" | "FAILED";
	paymentMethod: "ONLINE" | "COD";
	createdAt: string;
}

interface OrderDetailProps {
	params: Promise<{ id: string }>;
}

const statusColors = {
	PLACED: "bg-blue-500",
	PACKED: "bg-orange-500",
	SHIPPED: "bg-purple-500",
	DELIVERED: "bg-green-500",
	PENDING: "bg-gray-500",
};

const paymentStatusColors = {
	PENDING: "bg-yellow-500",
	PAID: "bg-green-500",
	FAILED: "bg-red-500",
};

export default function OrderDetail({ params }: OrderDetailProps) {
	const { id } = use(params);
	const user = useAuthStore((state) => state.user);
	const router = useRouter();
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) {
			router.push("/");
			return;
		}

		const fetchOrder = async () => {
			try {
				const response = await fetch(`${API_URL}/api/orders/${id}`, {
					credentials: "include",
					cache: "no-store",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch order");
				}

				const data = await response.json();
				setOrder(data);
			} catch (err) {
				console.error("Failed to load order", err);
			} finally {
				setLoading(false);
			}
		};

		fetchOrder();
	}, [id, user, router]);

	if (loading) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
				<p className="text-muted-foreground">Loading order...</p>
			</div>
		);
	}

	if (!order) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
				<h2 className="text-2xl font-bold">Order not found</h2>
				<Button asChild>
					<Link href="/profile/orders">Back to Orders</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
			<Button variant="ghost" className="mb-4" asChild>
				<Link href="/profile/orders">
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to Orders
				</Link>
			</Button>

			<div className="space-y-6">
				{/* Order Header */}
				<Card>
					<CardHeader>
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
							<div>
								<CardTitle>
									Order #{order._id.slice(-8).toUpperCase()}
								</CardTitle>
								<p className="text-sm text-muted-foreground mt-1">
									Placed on{" "}
									{new Date(order.createdAt).toLocaleDateString("en-IN", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</p>
							</div>
							<div className="flex flex-wrap gap-2">
								<Badge className={`${statusColors[order.status]} text-white`}>
									{order.status}
								</Badge>
								<Badge
									className={`${paymentStatusColors[order.paymentStatus]} text-white`}
								>
									Payment: {order.paymentStatus}
								</Badge>
								<Badge variant="outline">{order.paymentMethod}</Badge>
							</div>
						</div>
					</CardHeader>
				</Card>

				{/* Order Items */}
				<Card>
					<CardHeader>
						<CardTitle>Items</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{order.items.map((item, index) => (
								<div key={index}>
									<div className="flex gap-4">
										<img
											src={item.image}
											alt={item.name}
											className="h-20 w-20 rounded-lg object-cover"
										/>
										<div className="flex-1">
											<h3 className="font-semibold">{item.name}</h3>
											<p className="text-sm text-muted-foreground">
												{item.variantLabel}
											</p>
											<div className="flex items-center justify-between mt-2">
												<span className="text-sm text-muted-foreground">
													Qty: {item.quantity}
												</span>
												<span className="font-semibold">₹{item.price}</span>
											</div>
										</div>
									</div>
									{index < order.items.length - 1 && <Separator className="mt-4" />}
								</div>
							))}
						</div>
						<Separator className="my-4" />
						<div className="flex justify-between items-center text-lg font-bold">
							<span>Total</span>
							<span className="text-primary">₹{order.totalAmount}</span>
						</div>
					</CardContent>
				</Card>

				{/* Shipping Address */}
				<Card>
					<CardHeader>
						<CardTitle>Shipping Address</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-1 text-sm">
							<p className="font-semibold">{order.address.fullName}</p>
							<p>{order.address.addressLine}</p>
							<p>
								{order.address.city}, {order.address.state} -{" "}
								{order.address.pincode}
							</p>
							<p className="text-muted-foreground">
								Phone: {order.address.phone}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
