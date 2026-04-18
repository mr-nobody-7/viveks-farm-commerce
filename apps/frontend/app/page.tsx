"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Shield, Heart, Truck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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

export default function Home() {
	const { data: products = [], isLoading: productsLoading } = useQuery({
		queryKey: ["products"],
		queryFn: api.getProducts,
	});

	const { data: categories = [], isLoading: categoriesLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: api.getCategories,
	});

	const featuredProducts = products.filter(
		(p) => p.variants.some((v) => v.isActive),
	);

	if (productsLoading || categoriesLoading) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	return (
		<>
			{/* Hero */}
			<section className="relative bg-linear-to-br from-primary/10 via-accent to-secondary/30">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
					<div className="max-w-2xl space-y-6">
						<Badge variant="secondary" className="text-sm px-3 py-1">
							🌿 100% Natural & Farm Fresh
						</Badge>
						<h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
							Fresh from our farm to your table
						</h1>
						<p className="text-lg text-muted-foreground max-w-lg">
							Discover pure ghee, handmade pickles, traditional sweets,
							cold-pressed oils, and more — all crafted with care at Vivek's
							Farm.
						</p>
						<div className="flex gap-3">
							<Button size="lg" asChild>
								<Link href="/shop">Shop Now</Link>
							</Button>
							<Button size="lg" variant="outline" asChild>
								<Link href="/our-story">Our Story</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Categories */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center mb-10">
					<h2 className="text-3xl font-bold">Shop by Category</h2>
					<p className="text-muted-foreground mt-2">
						Explore our range of farm-fresh products
					</p>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
					{categories.map((cat) => (
						<Link key={cat._id} href={`/shop/${cat.slug}`}>
							<Card className="group text-center hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
								<CardContent className="p-4 space-y-2">
									<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
										<Leaf className="h-6 w-6" />
									</div>
									<p className="text-sm font-medium">{cat.name}</p>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</section>

			{/* Featured Products */}
			<section className="bg-secondary/30 py-16">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-3xl font-bold">Bestsellers</h2>
							<p className="text-muted-foreground mt-1">Our most loved products</p>
						</div>
						<Button variant="outline" asChild>
							<Link href="/shop">View All</Link>
						</Button>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
						{featuredProducts.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				</div>
			</section>

			{/* Trust Section */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="text-center mb-10">
					<h2 className="text-3xl font-bold">Why Vivek's Farm?</h2>
					<p className="text-muted-foreground mt-2">
						We believe in quality you can taste
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{trustPoints.map((point) => (
						<Card key={point.title} className="text-center">
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
		</>
	);
}
