"use client";

import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/api";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";

interface ProductCardProps {
	product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
	const variant = product.variants[0];
	const addItem = useCartStore((state) => state.addItem);
	const updateQuantity = useCartStore((state) => state.updateQuantity);
	const items = useCartStore((state) => state.items);
	const toggleWishlist = useWishlistStore((state) => state.toggleItem);
	const isWishlisted = useWishlistStore((state) => state.isWishlisted);
	const wishlisted = isWishlisted(product._id);

	const cartItem = items.find(
		(i) => i.productId === product._id && i.variantLabel === variant.label,
	);

	const discountPercentage =
		variant.originalPrice && variant.originalPrice > variant.price
			? Math.round(
					((variant.originalPrice - variant.price) / variant.originalPrice) *
						100,
				)
			: 0;

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		addItem({
			productId: product._id,
			slug: product.slug,
			name: product.name,
			image: product.images[0] || "/placeholder.svg",
			variantLabel: variant.label,
			price: variant.price,
			quantity: 1,
		});
		toast.success(`${product.name} added to cart`);
	};

	const handleDecrease = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		updateQuantity(product._id, variant.label, (cartItem?.quantity ?? 1) - 1);
	};

	const handleIncrease = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		updateQuantity(product._id, variant.label, (cartItem?.quantity ?? 0) + 1);
	};

	return (
		<Link href={`/product/${product.slug}`}>
			<Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
				<div className="relative aspect-square bg-muted overflow-hidden">
					<Image
						src={product.images[0] || "/placeholder.svg"}
						alt={product.name}
						fill
						className="object-cover transition-transform group-hover:scale-105"
						sizes="(max-width: 768px) 50vw, 25vw"
					/>
					<Badge className="absolute top-2 right-2" variant="secondary">
						{variant.label}
					</Badge>
					<button
						type="button"
						className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow transition-colors hover:bg-background"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							toggleWishlist({
								productId: product._id,
								slug: product.slug,
								name: product.name,
								image: product.images[0] || "/placeholder.svg",
								price: variant.price,
								category: product.category?.name ?? "",
							});
							toast.success(
								wishlisted ? "Removed from wishlist" : "Added to wishlist",
							);
						}}
						aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
					>
						<Heart
							className={`h-4 w-4 transition-colors ${
								wishlisted
									? "fill-red-500 text-red-500"
									: "text-muted-foreground"
							}`}
						/>
					</button>
					{discountPercentage > 0 && (
						<Badge className="absolute top-2 left-2" variant="destructive">
							{discountPercentage}% OFF
						</Badge>
					)}
				</div>
				<CardContent className="p-4 space-y-3">
					<h3 className="font-semibold text-foreground line-clamp-1">
						{product.name}
					</h3>
					<p className="text-xs text-muted-foreground line-clamp-2">
						{product.description}
					</p>
					<div className="flex items-center gap-2">
						<span className="text-lg font-bold text-primary">
							₹{variant.price}
						</span>
						{variant.originalPrice && (
							<span className="text-sm text-muted-foreground line-through">
								₹{variant.originalPrice}
							</span>
						)}
					</div>
					<div className="pt-1">
						{cartItem ? (
							<div className="flex items-center justify-center gap-1 border rounded-md h-10">
								<Button
									size="icon"
									variant="ghost"
									className="h-8 w-8"
									onClick={handleDecrease}
								>
									<Minus className="h-3 w-3" />
								</Button>
								<span className="w-6 text-center text-sm font-medium">
									{cartItem.quantity}
								</span>
								<Button
									size="icon"
									variant="ghost"
									className="h-8 w-8"
									onClick={handleIncrease}
								>
									<Plus className="h-3 w-3" />
								</Button>
							</div>
						) : (
							<Button
								size="sm"
								className="h-10 w-full"
								onClick={handleAddToCart}
							>
								<ShoppingCart className="h-4 w-4 mr-1" />
								Add
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};
