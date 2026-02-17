"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MessageCircle } from "lucide-react";

interface OrderSuccessProps {
	params: Promise<{ orderId: string }>;
}

export default function OrderSuccess({ params }: OrderSuccessProps) {
	const { orderId } = use(params);

	return (
		<div className="container py-20 max-w-lg mx-auto text-center space-y-6">
			<CheckCircle className="h-20 w-20 text-primary mx-auto" />
			<h1 className="text-3xl font-bold">Order Placed!</h1>
			<p className="text-muted-foreground">
				Thank you for shopping with Vivek's Farm. Your order has been placed
				successfully.
			</p>

			<Card>
				<CardContent className="p-6 space-y-2">
					<p className="text-sm text-muted-foreground">Order ID</p>
					<p className="text-xl font-mono font-bold text-primary">{orderId}</p>
				</CardContent>
			</Card>

			<div className="flex flex-col sm:flex-row gap-3 justify-center">
				<Button asChild>
					<a
						href={`https://wa.me/919876543210?text=Hi!%20I%20just%20placed%20order%20${orderId}%20on%20Vivek's%20Farm.`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<MessageCircle className="h-4 w-4 mr-2" />
						Contact us on WhatsApp
					</a>
				</Button>
				<Button variant="outline" asChild>
					<Link href="/shop">Continue Shopping</Link>
				</Button>
			</div>
		</div>
	);
}
