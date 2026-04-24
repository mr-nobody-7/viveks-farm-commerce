"use client";

import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeft,
	CheckCircle,
	Minus,
	Package,
	Plus,
	Shield,
	ShoppingCart,
	Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ProductVariant } from "@/lib/api";
import { api } from "@/lib/api";
import { useCartStore } from "@/lib/stores/cart-store";

interface ProductDetailProps {
	params: Promise<{ product_id: string }>;
}

export default function ProductDetail({ params }: ProductDetailProps) {
	const { product_id } = use(params);
	const router = useRouter();
	const addItem = useCartStore((state) => state.addItem);
	const updateQuantity = useCartStore((state) => state.updateQuantity);
	const cartItems = useCartStore((state) => state.items);

	const { data: product, isLoading } = useQuery({
		queryKey: ["product", product_id],
		queryFn: () => api.getProductBySlug(product_id),
	});

	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
		null,
	);
	const [activeImageIdx, setActiveImageIdx] = useState(0);

	// Set default variant when product loads
	if (product && !selectedVariant && product.variants.length > 0) {
		setSelectedVariant(product.variants[0]);
	}

	const { data: relatedProducts = [] } = useQuery({
		queryKey: ["products", "category", product?.category.slug],
		queryFn: () => api.getProductsByCategory(product?.category.slug ?? ""),
		enabled: !!product,
	});

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid md:grid-cols-2 gap-8 animate-pulse">
					<div className="space-y-3">
						<div className="aspect-square bg-gray-200 rounded-lg" />
						<div className="flex gap-2">
							{[1, 2, 3].map((i) => (
								<div key={i} className="h-16 w-16 bg-gray-200 rounded" />
							))}
						</div>
					</div>
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

	const images =
		product.images.length > 0 ? product.images : ["/placeholder.svg"];
	const activeImage = images[activeImageIdx] ?? images[0];

	const handleAddToCart = () => {
		addItem({
			productId: product._id,
			slug: product.slug,
			name: product.name,
			image: images[0],
			variantLabel: selectedVariant.label,
			price: selectedVariant.price,
			quantity: 1,
		});
		toast.success(`${product.name} added to cart`);
	};

	const cartItem = cartItems.find(
		(i) =>
			i.productId === product._id && i.variantLabel === selectedVariant.label,
	);

	const handleBuyNow = () => {
		addItem({
			productId: product._id,
			slug: product.slug,
			name: product.name,
			image: images[0],
			variantLabel: selectedVariant.label,
			price: selectedVariant.price,
			quantity: 1,
		});
		router.push("/cart");
	};

	const discount = selectedVariant.originalPrice
		? Math.round(
				((selectedVariant.originalPrice - selectedVariant.price) /
					selectedVariant.originalPrice) *
					100,
			)
		: 0;

	const CartControls = () =>
		cartItem ? (
			<div className="flex items-center gap-2 border rounded-md px-2 h-11">
				<Button
					size="icon"
					variant="ghost"
					className="h-8 w-8"
					onClick={() =>
						updateQuantity(
							product._id,
							selectedVariant.label,
							cartItem.quantity - 1,
						)
					}
				>
					<Minus className="h-4 w-4" />
				</Button>
				<span className="w-8 text-center font-semibold">
					{cartItem.quantity}
				</span>
				<Button
					size="icon"
					variant="ghost"
					className="h-8 w-8"
					onClick={() =>
						updateQuantity(
							product._id,
							selectedVariant.label,
							cartItem.quantity + 1,
						)
					}
				>
					<Plus className="h-4 w-4" />
				</Button>
			</div>
		) : (
			<Button size="lg" className="flex-1" onClick={handleAddToCart}>
				<ShoppingCart className="h-5 w-5 mr-2" />
				Add to Cart
			</Button>
		);

	return (
		<>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Breadcrumb */}
				<div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
					<Link href="/" className="hover:text-primary">
						Home
					</Link>
					<span>/</span>
					<Link href="/shop" className="hover:text-primary">
						Shop
					</Link>
					<span>/</span>
					<Link
						href={`/shop/${product.category.slug}`}
						className="hover:text-primary"
					>
						{product.category.name}
					</Link>
					<span>/</span>
					<span className="text-foreground truncate max-w-[160px]">
						{product.name}
					</span>
				</div>

				<button
					type="button"
					onClick={() => router.back()}
					className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4"
				>
					<ArrowLeft className="h-4 w-4" /> Back
				</button>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
					{/* Image gallery */}
					<div className="space-y-3">
						<div className="aspect-square rounded-xl bg-muted overflow-hidden border">
							<Image
								src={activeImage}
								alt={product.name}
								width={600}
								height={600}
								className="h-full w-full object-cover transition-all duration-200"
							/>
						</div>
						{images.length > 1 && (
							<div className="flex gap-2 overflow-x-auto pb-1">
								{images.map((img, idx) => (
									<button
										key={img}
										type="button"
										onClick={() => setActiveImageIdx(idx)}
										className={`h-16 w-16 shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
											activeImageIdx === idx
												? "border-primary"
												: "border-transparent hover:border-muted-foreground"
										}`}
									>
										<Image
											src={img}
											alt={`${product.name} ${idx + 1}`}
											width={64}
											height={64}
											className="h-full w-full object-cover"
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Info */}
					<div className="space-y-5">
						<div>
							<Badge variant="secondary" className="mb-2">
								{product.category.name}
							</Badge>
							<h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
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
										variant={
											selectedVariant.label === v.label ? "default" : "outline"
										}
										size="sm"
										onClick={() => setSelectedVariant(v)}
									>
										{v.label}
									</Button>
								))}
							</div>
						</div>

						{/* CTA buttons — hidden on mobile (shown in sticky bar) */}
						<div className="hidden sm:flex gap-3">
							<CartControls />
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

						{/* Delivery + trust info */}
						<div className="space-y-2 text-sm">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Truck className="h-4 w-4 text-primary shrink-0" />
								<span>
									Free delivery on orders above ₹500 · Ships in 2–4 business
									days
								</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<Package className="h-4 w-4 text-primary shrink-0" />
								<span>Securely packed to retain freshness</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<Shield className="h-4 w-4 text-primary shrink-0" />
								<span>FSSAI certified · No preservatives</span>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground">
								<CheckCircle className="h-4 w-4 text-primary shrink-0" />
								<span>100% authentic, sourced from own farm</span>
							</div>
						</div>

						<Separator />

						<div className="text-sm space-y-1">
							<p className="font-medium">Description</p>
							<p className="text-muted-foreground leading-relaxed">
								{product.description}
							</p>
						</div>
					</div>
				</div>

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

			{/* Sticky bottom CTA — mobile only */}
			<div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t p-3 flex gap-3 shadow-lg">
				<CartControls />
				<Button
					size="lg"
					variant="outline"
					className="flex-1"
					onClick={handleBuyNow}
				>
					Buy Now
				</Button>
			</div>
		</>
	);
}
