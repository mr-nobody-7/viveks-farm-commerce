"use client";

import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
	Bean,
	Bug,
	Candy,
	CircleDot,
	Cookie,
	Droplets,
	Flame,
	Heart,
	Leaf,
	Shield,
	Soup,
	Star,
	Truck,
	Wheat,
} from "lucide-react";
import Link from "next/link";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import {
	CategoryCardSkeleton,
	ProductCardSkeleton,
	TestimonialSkeleton,
} from "@/components/Skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

const slugIconMap: Record<string, LucideIcon> = {
	ghee: Droplets,
	sweets: Candy,
	pickles: Flame,
	honey: Bug,
	"cold-pressed-oils": Droplets,
	oils: Droplets,
	spices: Soup,
	flours: Wheat,
	millets: Leaf,
	rice: Wheat,
	pulses: Bean,
	cereals: CircleDot,
	snacks: Cookie,
};

const trustPoints = [
	{
		icon: Leaf,
		title: "Farm Fresh",
		description: "Directly from our fields to your kitchen — no middlemen",
	},
	{
		icon: Shield,
		title: "No Preservatives",
		description: "100% natural ingredients, no chemicals or additives",
	},
	{
		icon: Heart,
		title: "Handmade with Love",
		description: "Traditional recipes passed down through generations",
	},
	{
		icon: Truck,
		title: "Pan-India Delivery",
		description: "We deliver fresh products across India",
	},
];

const testimonials = [
	{
		name: "Priya Sharma",
		location: "Hyderabad",
		rating: 5,
		text: "The A2 Bilona ghee is absolutely divine! You can taste the difference from store-bought ghee immediately. Will definitely reorder.",
	},
	{
		name: "Ravi Kumar",
		location: "Bengaluru",
		rating: 5,
		text: "Ordered the cold-pressed groundnut oil and mango pickle. Both are exceptional. The pickle reminds me of my grandmother's recipe!",
	},
	{
		name: "Anita Reddy",
		location: "Chennai",
		rating: 5,
		text: "Amazing quality products. The honey is raw and unprocessed — you can see the difference. Fast delivery and excellent packaging.",
	},
	{
		name: "Suresh Nair",
		location: "Mumbai",
		rating: 5,
		text: "Finally found a trustworthy source for traditional Indian food products. Vivek's Farm never disappoints. A loyal customer for 2 years!",
	},
];

export default function Home() {
	const { data: products = [], isLoading: productsLoading } = useQuery({
		queryKey: ["products"],
		queryFn: api.getProducts,
	});

	const { data: categories = [], isLoading: categoriesLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: api.getCategories,
	});

	const featuredProducts = products
		.filter((p) => p.variants.some((v) => v.isActive))
		.slice(0, 8);

	const isLoading = productsLoading || categoriesLoading;

	return (
		<>
			{/* ——— Hero Carousel ——— */}
			<HeroCarousel />

			{/* ——— Promo Banner Strip ——— */}
			<div className="bg-primary text-primary-foreground">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
					<div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm font-medium text-center">
						<span className="flex items-center gap-2">
							<Truck className="h-4 w-4 shrink-0" />
							Free delivery on orders above ₹500
						</span>
						<span className="hidden sm:block opacity-40">|</span>
						<span className="flex items-center gap-2">
							<Shield className="h-4 w-4 shrink-0" />
							FSSAI Certified · No Preservatives
						</span>
						<span className="hidden sm:block opacity-40">|</span>
						<span className="flex items-center gap-2">
							<Star className="h-4 w-4 fill-current shrink-0" />
							4.9★ Rated by 500+ customers
						</span>
					</div>
				</div>
			</div>

			{/* ——— Offer Banner ——— */}
			<div className="bg-amber-50 border-b border-amber-100">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="text-center sm:text-left">
							<p className="text-lg font-bold text-amber-900">
								🎁 New Customer? Get 10% off your first order!
							</p>
							<p className="text-sm text-amber-700 mt-0.5">
								Use code{" "}
								<span className="font-mono font-bold bg-amber-200 px-1.5 py-0.5 rounded">
									WELCOME10
								</span>{" "}
								at checkout
							</p>
						</div>
						<Button
							asChild
							className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
						>
							<Link href="/shop">Shop Now →</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* ——— Categories ——— */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center mb-10">
					<h2 className="text-3xl font-bold">Shop by Category</h2>
					<p className="text-muted-foreground mt-2">
						Explore our range of farm-fresh products
					</p>
				</div>
				{categoriesLoading ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{["c1", "c2", "c3", "c4", "c5", "c6"].map((id) => (
							<CategoryCardSkeleton key={id} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
						{categories.map((cat) => {
							const Icon = slugIconMap[cat.slug.toLowerCase()] ?? Leaf;
							return (
								<Link key={cat._id} href={`/shop/${cat.slug}`}>
									<Card className="group text-center hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full">
										<CardContent className="p-4 space-y-2">
											<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
												<Icon className="h-5 w-5" />
											</div>
											<p className="text-sm font-medium">{cat.name}</p>
										</CardContent>
									</Card>
								</Link>
							);
						})}
					</div>
				)}
			</section>

			{/* ——— Featured Products ——— */}
			<section className="bg-muted/30 py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-3xl font-bold">Bestsellers</h2>
							<p className="text-muted-foreground mt-1">
								Our most loved products
							</p>
						</div>
						<Button variant="outline" asChild>
							<Link href="/shop">View All</Link>
						</Button>
					</div>
					{isLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
							{["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"].map((id) => (
								<ProductCardSkeleton key={id} />
							))}
						</div>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
							{featuredProducts.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</div>
					)}
				</div>
			</section>

			{/* ——— Mid-page Banner ——— */}
			<section className="py-14 bg-gradient-to-r from-green-900 to-emerald-800 text-white relative overflow-hidden">
				<div
					aria-hidden="true"
					className="absolute inset-0 opacity-10 text-[400px] flex items-center justify-end pr-10 leading-none select-none pointer-events-none"
				>
					🌿
				</div>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
					<div className="max-w-2xl space-y-4">
						<Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
							Limited Time
						</Badge>
						<h2 className="text-3xl md:text-4xl font-bold">
							Pure Ghee Bundle — Save 15%
						</h2>
						<p className="text-white/80 text-lg">
							Get our A2 Bilona Ghee in 500ml + 1L combo pack. Made fresh every
							week. Stock limited.
						</p>
						<div className="flex flex-wrap gap-3 pt-2">
							<Button size="lg" variant="secondary" asChild>
								<Link href="/shop/ghee">Grab the Bundle</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-white/40 text-white hover:bg-white/10"
								asChild
							>
								<Link href="/shop">Browse All</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* ——— Why Us ——— */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center mb-10">
					<h2 className="text-3xl font-bold">Why Vivek's Farm?</h2>
					<p className="text-muted-foreground mt-2">
						We believe in quality you can taste
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{trustPoints.map((point) => (
						<Card
							key={point.title}
							className="text-center border-none shadow-none bg-muted/40"
						>
							<CardContent className="p-6 space-y-3">
								<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
									<point.icon className="h-7 w-7" />
								</div>
								<h3 className="font-semibold">{point.title}</h3>
								<p className="text-sm text-muted-foreground">
									{point.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* ——— Testimonials ——— */}
			<section className="bg-primary/5 py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-10">
						<h2 className="text-3xl font-bold">What Our Customers Say</h2>
						<p className="text-muted-foreground mt-2">
							Trusted by thousands of happy customers across India
						</p>
					</div>
					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{["t1", "t2", "t3", "t4"].map((id) => (
								<TestimonialSkeleton key={id} />
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{testimonials.map((t) => (
								<Card key={t.name} className="bg-background">
									<CardContent className="p-5 space-y-3">
										<div className="flex gap-0.5">
											{Array.from({ length: t.rating }).map((_, i) => (
												<Star
													key={`${t.name}-star-${i}`}
													className="h-4 w-4 fill-yellow-400 text-yellow-400"
												/>
											))}
										</div>
										<p className="text-sm text-muted-foreground italic">
											"{t.text}"
										</p>
										<div>
											<p className="text-sm font-semibold">{t.name}</p>
											<p className="text-xs text-muted-foreground">
												{t.location}
											</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</section>

			{/* ——— CTA Banner ——— */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="rounded-2xl bg-primary text-primary-foreground px-8 py-12 text-center space-y-4">
					<h2 className="text-3xl font-bold">Ready to taste the difference?</h2>
					<p className="text-primary-foreground/80 max-w-md mx-auto">
						Order today and get farm-fresh products delivered to your doorstep.
						Free delivery on orders above ₹500.
					</p>
					<Button size="lg" variant="secondary" asChild>
						<Link href="/shop">Start Shopping</Link>
					</Button>
				</div>
			</section>
		</>
	);
}
