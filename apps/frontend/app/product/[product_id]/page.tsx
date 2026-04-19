"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import type { ProductVariant } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/lib/stores/cart-store";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface ProductDetailProps {
	params: Promise<{ product_id: string }>;
}

export default function ProductDetail({ params }: ProductDetailProps) {
	const { product_id } = use(params);
	const router = useRouter();
	const addItem = useCartStore((state) => state.addItem);

	const { data: product, isLoading } = useQuery({
		queryKey: ["product", product_id],
		queryFn: () => api.getProductBySlug(product_id),
	});

	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
		null,
	);

	// Set default variant when product loads
	if (product && !selectedVariant && product.variants.length > 0) {
		setSelectedVariant(product.variants[0]);
	}

	const { data: relatedProducts = [] } = useQuery({
		queryKey: ["products", "category", product?.category.slug],
		queryFn: () => api.getProductsByCategory(product!.category.slug),
		enabled: !!product,
	});

	const filteredRelatedProducts = relatedProducts
		.filter((p) => p.slug !== product_id)
		.slice(0, 4);

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid md:grid-cols-2 gap-8 animate-pulse">
					{/* Image skeleton */}
					<div className="aspect-square bg-gray-200 rounded-lg" />
					{/* Content skeleton */}
					<div className="space-y-4">
						<div className="h-8 bg-gray-200 rounded w-3/4" />
						<div className="h-6 bg-gray-200 rounded w-1/4" />
						<div className="h-4 bg-gray-200 rounded w-full" />
						<div className="h-4 bg-gray-200 rounded w-5/6" />
						<div className="h-12 bg-gray-200 rounded w-full mt-6" />
					</div>
				</div>
			</div>
		);
	}

	if (!product || !selectedVariant) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
				<p className="text-muted-foreground">Product not found.</p>
				<Button variant="outline" className="mt-4" asChild>
					<Link href="/shop">Back to Shop</Link>
				</Button>
			</div>
		);
	}

	const handleAddToCart = () => {
		addItem({
			productId: product._id,
			slug: product.slug,
			name: product.name,
			image: product.images[0] || "/placeholder.svg",
			variantLabel: selectedVariant.label,
			price: selectedVariant.price,
			quantity: 1,
		});
	};

	const handleBuyNow = () => {
		handleAddToCart();
		router.push("/cart");
	};

	const discount = selectedVariant.originalPrice
		? Math.round(
				((selectedVariant.originalPrice - selectedVariant.price) /
					selectedVariant.originalPrice) *
					100,
			)
		: 0;

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
							{product.category.name}
						</Badge>
						<h1 className="text-3xl font-bold">{product.name}</h1>
					</div>

					<div className="flex items-baseline gap-3">
						<span className="text-3xl font-bold text-primary">
							₹{selectedVariant.price}
						</span>
						{selectedVariant.originalPrice && (
							<>
								<span className="text-lg text-muted-foreground line-through">
									₹{selectedVariant.originalPrice}
								</span>
								<Badge variant="destructive" className="text-xs">
									{discount}% OFF
								</Badge>
							</>
						)}
					</div>

					{/* Variant selector */}
					<div>
						<p className="text-sm font-medium mb-2">Select Size</p>
						<div className="flex gap-2 flex-wrap">
							{product.variants.map((v) => (
								<Button
									key={v.label}
									variant={selectedVariant.label === v.label ? "default" : "outline"}
									size="sm"
									onClick={() => setSelectedVariant(v)}
								>
									{v.label}
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
						<div>
							<span className="font-medium">Description:</span>
							<p className="text-muted-foreground mt-1">{product.description}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Related Products */}
			{relatedProducts.length > 0 && (
				<section className="mt-16">
					<h2 className="text-2xl font-bold mb-6">You might also like</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{relatedProducts
							.filter((p) => p.slug !== product.slug)
							.slice(0, 4)
							.map((p) => (
								<ProductCard key={p.slug} product={p} />
							))}
					</div>
				</section>
			)}
		</div>
	);
}
