"use client";

import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";

export default function WishlistPage() {
	const items = useWishlistStore((state) => state.items);
	const removeItem = useWishlistStore((state) => state.removeItem);
	const clearWishlist = useWishlistStore((state) => state.clearWishlist);
	const addToCart = useCartStore((state) => state.addItem);

	const handleAddToCart = (item: (typeof items)[number]) => {
		addToCart({
			productId: item.productId,
			slug: item.slug,
			name: item.name,
			image: item.image,
			variantLabel: "Default",
			price: item.price,
			quantity: 1,
		});
		toast.success(`${item.name} added to cart`);
	};

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
				<Link href="/" className="hover:text-primary">
					Home
				</Link>
				<span>/</span>
				<span className="text-foreground">Wishlist</span>
			</div>

			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<Heart className="h-6 w-6 text-red-500 fill-red-500" />
					Wishlist
					{items.length > 0 && (
						<span className="text-base font-normal text-muted-foreground">
							({items.length} item{items.length !== 1 ? "s" : ""})
						</span>
					)}
				</h1>
				{items.length > 0 && (
					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground"
						onClick={() => {
							clearWishlist();
							toast.success("Wishlist cleared");
						}}
					>
						<Trash2 className="h-4 w-4 mr-1" />
						Clear all
					</Button>
				)}
			</div>

			{items.length === 0 ? (
				<div className="text-center py-24 space-y-4">
					<Heart className="h-16 w-16 mx-auto text-muted-foreground/30" />
					<div>
						<h2 className="text-xl font-semibold mb-2">
							Your wishlist is empty
						</h2>
						<p className="text-muted-foreground">
							Save products you love by tapping the heart icon.
						</p>
					</div>
					<Button asChild>
						<Link href="/shop">Browse Products</Link>
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{items.map((item) => (
						<Card key={item.productId} className="overflow-hidden">
							<Link href={`/product/${item.slug}`}>
								<div className="aspect-square bg-muted overflow-hidden">
									<Image
										src={item.image}
										alt={item.name}
										width={300}
										height={300}
										className="h-full w-full object-cover hover:scale-105 transition-transform"
									/>
								</div>
							</Link>
							<CardContent className="p-4 space-y-3">
								<div>
									<Link
										href={`/product/${item.slug}`}
										className="font-semibold hover:text-primary transition-colors line-clamp-1"
									>
										{item.name}
									</Link>
									{item.category && (
										<p className="text-xs text-muted-foreground">
											{item.category}
										</p>
									)}
								</div>
								<p className="text-lg font-bold text-primary">₹{item.price}</p>
								<div className="flex gap-2">
									<Button
										size="sm"
										className="flex-1"
										onClick={() => handleAddToCart(item)}
									>
										<ShoppingCart className="h-4 w-4 mr-1" />
										Add to Cart
									</Button>
									<Button
										size="icon"
										variant="ghost"
										className="shrink-0 text-red-400 hover:text-red-500 hover:bg-red-50"
										onClick={() => {
											removeItem(item.productId);
											toast.success("Removed from wishlist");
										}}
										aria-label="Remove from wishlist"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
