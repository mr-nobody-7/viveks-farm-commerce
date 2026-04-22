"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/api";
import Link from "next/link";
import { useCartStore } from "@/lib/stores/cart-store";
import { toast } from "sonner";

interface ProductCardProps {
	product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
	const variant = product.variants[0];
	const addItem = useCartStore((state) => state.addItem);
	const discountPercentage =
		variant.originalPrice && variant.originalPrice > variant.price
			? Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)
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

	return (
		<Link href={`/product/${product.slug}`}>
			<Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
				<div className="relative aspect-square bg-muted overflow-hidden">
					<img
						src={product.images[0] || "/placeholder.svg"}
						alt={product.name}
						className="h-full w-full object-cover transition-transform group-hover:scale-105"
						loading="lazy"
						onError={(e) => {
							(e.target as HTMLImageElement).src = "/placeholder.svg";
						}}
					/>
					<Badge className="absolute top-2 right-2" variant="secondary">
						{variant.label}
					</Badge>
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
					<div className="grid grid-cols-2 gap-2 pt-1">
						<Button
							size="sm"
							className="h-10 w-full"
							onClick={handleAddToCart}
						>
							<ShoppingCart className="h-4 w-4 mr-1" />
							Add
						</Button>
						<Button size="sm" variant="outline" className="h-10 w-full" asChild>
							<span>View</span>
						</Button>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};
