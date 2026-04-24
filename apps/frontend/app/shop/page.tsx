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
	Leaf,
	ShoppingBag,
	Soup,
	Wheat,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

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

type SortOption = "default" | "price-asc" | "price-desc";

const Shop = () => {
	const [sort, setSort] = useState<SortOption>("default");
	const [search, setSearch] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");

	const { data: products = [], isLoading: productsLoading } = useQuery({
		queryKey: ["products"],
		queryFn: api.getProducts,
	});

	const { data: categories = [], isLoading: categoriesLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: api.getCategories,
	});

	const filteredProducts = useMemo(() => {
		let list = [...products];

		// Search filter
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					p.description.toLowerCase().includes(q),
			);
		}

		// Price filter
		const min = Number(minPrice) || 0;
		const max = Number(maxPrice) || Number.POSITIVE_INFINITY;
		if (minPrice || maxPrice) {
			list = list.filter((p) => {
				const price = p.variants[0]?.price ?? 0;
				return price >= min && price <= max;
			});
		}

		// Sort
		if (sort === "price-asc") {
			list = list.sort((a, b) => a.variants[0].price - b.variants[0].price);
		} else if (sort === "price-desc") {
			list = list.sort((a, b) => b.variants[0].price - a.variants[0].price);
		}
		return list;
	}, [products, sort, search, minPrice, maxPrice]);

	const isLoading = productsLoading || categoriesLoading;

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
				<Link href="/" className="hover:text-primary">
					Home
				</Link>
				<span>/</span>
				<span className="text-foreground">Shop</span>
			</div>

			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar */}
				<aside className="w-full md:w-56 shrink-0">
					<div className="space-y-5 sticky top-24">
						{/* Category list */}
						<div>
							<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
								Categories
							</p>
							<nav className="space-y-0.5">
								<Link
									href="/shop"
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
										"bg-primary text-primary-foreground font-medium",
									)}
								>
									<ShoppingBag className="h-4 w-4 shrink-0" />
									All Products
								</Link>
								{isLoading ? (
									<div className="space-y-1">
										{["s1", "s2", "s3"].map((id) => (
											<div
												key={id}
												className="h-9 bg-muted rounded-lg animate-pulse"
											/>
										))}
									</div>
								) : (
									categories
										.filter((cat) => Boolean(cat.slug?.trim()))
										.map((cat) => {
											const Icon = slugIconMap[cat.slug.toLowerCase()] ?? Leaf;
											return (
												<Link
													key={cat._id}
													href={`/shop/${cat.slug}`}
													className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
												>
													<Icon className="h-4 w-4 shrink-0" />
													{cat.name}
												</Link>
											);
										})
								)}
							</nav>
						</div>

						<Separator />

						{/* Price filter */}
						<div>
							<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
								Price Range
							</p>
							<div className="space-y-2">
								<div className="space-y-1">
									<Label htmlFor="minPrice" className="text-xs">
										Min (₹)
									</Label>
									<Input
										id="minPrice"
										type="number"
										placeholder="0"
										value={minPrice}
										onChange={(e) => setMinPrice(e.target.value)}
										className="h-8 text-sm"
									/>
								</div>
								<div className="space-y-1">
									<Label htmlFor="maxPrice" className="text-xs">
										Max (₹)
									</Label>
									<Input
										id="maxPrice"
										type="number"
										placeholder="Any"
										value={maxPrice}
										onChange={(e) => setMaxPrice(e.target.value)}
										className="h-8 text-sm"
									/>
								</div>
								{(minPrice || maxPrice) && (
									<Button
										variant="ghost"
										size="sm"
										className="w-full text-xs h-7"
										onClick={() => {
											setMinPrice("");
											setMaxPrice("");
										}}
									>
										Clear filter
									</Button>
								)}
							</div>
						</div>
					</div>
				</aside>

				{/* Products */}
				<div className="flex-1">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
						<div className="flex items-center gap-3 flex-1">
							<Input
								placeholder="Search products..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="max-w-xs"
							/>
							<p className="text-muted-foreground text-sm whitespace-nowrap">
								{filteredProducts.length} product
								{filteredProducts.length !== 1 ? "s" : ""}
							</p>
						</div>
						<Select
							value={sort}
							onValueChange={(v) => setSort(v as SortOption)}
						>
							<SelectTrigger className="w-44 shrink-0">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="default">Default</SelectItem>
								<SelectItem value="price-asc">Price: Low to High</SelectItem>
								<SelectItem value="price-desc">Price: High to Low</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
							{["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"].map((id) => (
								<ProductCardSkeleton key={id} />
							))}
						</div>
					) : filteredProducts.length > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
							{filteredProducts.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</div>
					) : (
						<div className="text-center py-20 space-y-4">
							<ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
							<div>
								<h3 className="text-xl font-semibold mb-2">
									No products found
								</h3>
								<p className="text-muted-foreground">
									Try a different search or category.
								</p>
							</div>
							<Button asChild>
								<Link href="/">Go Home</Link>
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Shop;
