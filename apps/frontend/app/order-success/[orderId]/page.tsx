"use client";

import { CheckCircle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface OrderItem {
	name: string;
	variantLabel: string;
	price: number;
	quantity: number;
}

interface Order {
	_id: string;
	items: OrderItem[];
	subtotalAmount: number;
	deliveryCharge: number;
	discountAmount: number;
	couponCode?: string;
	totalAmount: number;
	address: {
		fullName: string;
		city: string;
		state: string;
	};
	paymentMethod: "ONLINE" | "COD";
}

interface OrderSuccessProps {
	params: Promise<{ orderId: string }>;
}

export default function OrderSuccess({ params }: OrderSuccessProps) {
	const { orderId } = use(params);
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!orderId || !API_URL) {
			setLoading(false);
			return;
		}

		fetch(`${API_URL}/api/orders/${orderId}`, {
			credentials: "include",
			cache: "no-store",
		})
			.then((r) => (r.ok ? r.json() : null))
			.then((d) => setOrder(d))
			.catch(() => {})
			.finally(() => setLoading(false));
	}, [orderId]);

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl space-y-6">
			<div className="text-center space-y-3">
				<CheckCircle className="h-20 w-20 text-primary mx-auto" />
				<h1 className="text-3xl font-bold">Order Placed!</h1>
				<p className="text-muted-foreground">
					Thank you for shopping with Vivek&apos;s Farm. Your order has been
					placed successfully.
				</p>
				<p className="text-sm font-mono bg-muted rounded px-3 py-1.5 inline-block">
					Order ID: {String(orderId).slice(-8).toUpperCase()}
				</p>
			</div>

			{loading ? (
				<Card>
					<CardContent className="p-6 space-y-3">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-4 bg-gray-200 rounded animate-pulse"
								style={{ width: `${60 + i * 10}%` }}
							/>
						))}
					</CardContent>
				</Card>
			) : order ? (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Order Summary</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							{order.items.map((item) => (
								<div
									key={`${item.name}-${item.variantLabel}`}
									className="flex justify-between text-sm"
								>
									<span className="text-muted-foreground">
										{item.name} ({item.variantLabel}) × {item.quantity}
									</span>
									<span>₹{item.price * item.quantity}</span>
								</div>
							))}
						</div>
						<Separator />
						<div className="space-y-1 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Subtotal</span>
								<span>₹{order.subtotalAmount}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Delivery</span>
								<span>₹{order.deliveryCharge}</span>
							</div>
							{order.discountAmount > 0 && (
								<div className="flex justify-between text-green-600">
									<span>
										Coupon
										{order.couponCode ? ` (${order.couponCode})` : " Discount"}
									</span>
									<span>-₹{order.discountAmount}</span>
								</div>
							)}
						</div>
						<Separator />
						<div className="flex justify-between font-bold text-lg">
							<span>Total</span>
							<span className="text-primary">₹{order.totalAmount}</span>
						</div>
						{order.address && (
							<p className="text-xs text-muted-foreground pt-1">
								Delivering to {order.address.fullName}, {order.address.city},{" "}
								{order.address.state}
							</p>
						)}
					</CardContent>
				</Card>
			) : null}

			<div className="flex flex-col sm:flex-row gap-3 justify-center">
				<Button asChild>
					<a
						href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20just%20placed%20order%20${orderId}%20on%20Vivek's%20Farm.`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<MessageCircle className="h-4 w-4 mr-2" />
						Contact us on WhatsApp
					</a>
				</Button>
				<Button variant="outline" asChild>
					<Link href="/profile/orders">View My Orders</Link>
				</Button>
				<Button variant="ghost" asChild>
					<Link href="/shop">Continue Shopping</Link>
				</Button>
			</div>
		</div>
	);
}
