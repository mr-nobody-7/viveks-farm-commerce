"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart-store";
import { toast } from "sonner";

const DELIVERY_CHARGE = 49;

const Cart = () => {
	const items = useCartStore((state) => state.items);
	const updateQuantity = useCartStore((state) => state.updateQuantity);
	const removeItem = useCartStore((state) => state.removeItem);

	const handleRemove = (productId: string, variantLabel: string, name: string) => {
		removeItem(productId, variantLabel);
		toast.success(`${name} removed from cart`);
	};

	// Derive subtotal from items
	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	if (items.length === 0) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
				<ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
				<h2 className="text-2xl font-bold">Your cart is empty</h2>
				<p className="text-muted-foreground">
					Looks like you haven't added any products yet.
				</p>
				<Button asChild>
					<Link href="/shop">Continue Shopping</Link>
				</Button>
			</div>
		);
	}

	const total = subtotal + DELIVERY_CHARGE;

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Cart items */}
				<div className="lg:col-span-2 space-y-4">
					{items.map((item) => (
						<Card key={`${item.productId}-${item.variantLabel}`}>
							<CardContent className="p-4 flex flex-col sm:flex-row gap-4">
								<div className="h-20 w-20 rounded-md bg-muted overflow-hidden shrink-0">
									<img
										src={item.image}
										alt={item.name}
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="font-semibold truncate">{item.name}</h3>
									<p className="text-sm text-muted-foreground">{item.variantLabel}</p>
									<p className="text-primary font-bold mt-1">
										₹{item.price}
									</p>
								</div>
								<div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-destructive"
										onClick={() => {
										removeItem(item.productId, item.variantLabel);
										toast.success(`${item.name} removed from cart`);
									}}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
									<div className="flex items-center gap-1">
										<Button
											variant="outline"
											size="icon"
											className="h-8 w-8"
											onClick={() =>
												updateQuantity(
													item.productId,
													item.variantLabel,
													item.quantity - 1,
												)
											}
										>
											<Minus className="h-3 w-3" />
										</Button>
										<span className="w-8 text-center text-sm font-medium">
											{item.quantity}
										</span>
										<Button
											variant="outline"
											size="icon"
											className="h-8 w-8"
											onClick={() =>
												updateQuantity(
													item.productId,
													item.variantLabel,
													item.quantity + 1,
												)
											}
										>
											<Plus className="h-3 w-3" />
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Price Summary */}
				<Card className="h-fit lg:sticky lg:top-24">
					<CardContent className="p-6 space-y-4">
						<h3 className="font-semibold text-lg">Order Summary</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Subtotal</span>
								<span>₹{subtotal}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Delivery</span>
								<span>₹{DELIVERY_CHARGE}</span>
							</div>
						</div>
						<Separator />
						<div className="flex justify-between font-bold text-lg">
							<span>Total</span>
							<span className="text-primary">₹{total}</span>
						</div>
						<Button className="w-full" size="lg" asChild>
							<Link href="/checkout">Proceed to Checkout</Link>
						</Button>
						<Button variant="ghost" className="w-full" asChild>
							<Link href="/shop">Continue Shopping</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Cart;
