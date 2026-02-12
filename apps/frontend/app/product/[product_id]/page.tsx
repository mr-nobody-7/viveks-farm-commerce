"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import {
	getProductById,
	getProductsByCategory,
	type ProductVariant,
} from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/providers/cart-store-provider";
import { useRouter } from "next/navigation";

interface ProductDetailProps {
	params: Promise<{ product_id: string }>;
}

export default function ProductDetail({ params }: ProductDetailProps) {
	const { product_id } = use(params);
	const router = useRouter();
	const { addItem } = useCart();
	const product = getProductById(product_id || "");
	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
		product ? product.variants[0] : null,
	);

	if (!product || !selectedVariant) {
		return (
			<div className="container py-20 text-center">
				<p className="text-muted-foreground">Product not found.</p>
				<Button variant="outline" className="mt-4" asChild>
					<Link href="/shop">Back to Shop</Link>
				</Button>
			</div>
		);
	}

	const relatedProducts = getProductsByCategory(product.category)
		.filter((p) => p.id !== product.id)
		.slice(0, 4);

	const handleAddToCart = () => {
		addItem({
			productId: product.id,
			name: product.name,
			image: product.images[0],
			weight: selectedVariant.weight,
			sellingPrice: selectedVariant.sellingPrice,
		});
	};

	const handleBuyNow = () => {
		handleAddToCart();
		router.push("/cart");
	};

	const discount = Math.round(
		((selectedVariant.actualPrice - selectedVariant.sellingPrice) /
			selectedVariant.actualPrice) *
			100,
	);

	return (
		<div className="container py-8">
			{/* Breadcrumb */}
			<button
				type="button"
				onClick={() => router.back()}
				className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
			>
				<ArrowLeft className="h-4 w-4" /> Back
			</button>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
				{/* Image */}
				<div className="aspect-square rounded-lg bg-muted overflow-hidden">
					<img
						src={product.images[0]}
						alt={product.name}
						className="h-full w-full object-cover"
					/>
				</div>

				{/* Info */}
				<div className="space-y-6">
					<div>
						<Badge variant="secondary" className="mb-2">
							{product.category}
						</Badge>
						<h1 className="text-3xl font-bold">{product.name}</h1>
					</div>

					<div className="flex items-baseline gap-3">
						<span className="text-3xl font-bold text-primary">
							₹{selectedVariant.sellingPrice}
						</span>
						<span className="text-lg text-muted-foreground line-through">
							₹{selectedVariant.actualPrice}
						</span>
						<Badge variant="destructive" className="text-xs">
							{discount}% OFF
						</Badge>
					</div>

					{/* Variant selector */}
					<div>
						<p className="text-sm font-medium mb-2">Select Size</p>
						<div className="flex gap-2 flex-wrap">
							{product.variants.map((v) => (
								<Button
									key={v.weight}
									variant={
										selectedVariant.weight === v.weight ? "default" : "outline"
									}
									size="sm"
									onClick={() => setSelectedVariant(v)}
								>
									{v.weight}
								</Button>
							))}
						</div>
					</div>

					<div className="flex gap-3">
						<Button size="lg" className="flex-1" onClick={handleAddToCart}>
							<ShoppingCart className="h-5 w-5 mr-2" />
							Add to Cart
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="flex-1"
							onClick={handleBuyNow}
						>
							Buy Now
						</Button>
					</div>

					<Separator />

					<div className="space-y-3 text-sm">
						<p className="text-muted-foreground">{product.description}</p>
						<div className="grid grid-cols-2 gap-2">
							<div>
								<span className="font-medium">Ingredients:</span>
								<p className="text-muted-foreground">{product.ingredients}</p>
							</div>
							<div>
								<span className="font-medium">Shelf Life:</span>
								<p className="text-muted-foreground">{product.shelfLife}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Related Products */}
			{relatedProducts.length > 0 && (
				<section className="mt-16">
					<h2 className="text-2xl font-bold mb-6">You might also like</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{relatedProducts.map((p) => (
							<ProductCard key={p.id} product={p} />
						))}
					</div>
				</section>
			)}
		</div>
	);
}
