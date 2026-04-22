"use client";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

type SortOption = "default" | "price-asc" | "price-desc";

const Shop = () => {
	const [sort, setSort] = useState<SortOption>("default");

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
		if (sort === "price-asc") {
			list = list.sort((a, b) => a.variants[0].price - b.variants[0].price);
		} else if (sort === "price-desc") {
			list = list.sort((a, b) => b.variants[0].price - a.variants[0].price);
		}
		return list;
	}, [products, sort]);

	if (productsLoading || categoriesLoading) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
					<Link href="/" className="hover:text-primary">
						Home
					</Link>
					<span>/</span>
					<span className="text-foreground">Shop</span>
				</div>
				<div className="flex flex-col md:flex-row gap-8">
					<aside className="w-full md:w-56 shrink-0">
						<div className="h-8 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
						<div className="space-y-2">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-10 bg-gray-200 rounded animate-pulse"
								/>
							))}
						</div>
					</aside>
					<div className="flex-1">
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
							{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
								<ProductCardSkeleton key={i} />
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
				<Link href="/" className="hover:text-primary">
					Home
				</Link>
				<span>/</span>
				<span className="text-foreground">Shop</span>
			</div>

			<div className="flex flex-col md:flex-row gap-8">
				{/* Category Sidebar */}
				<aside className="w-full md:w-56 shrink-0">
					<h3 className="font-semibold mb-3">Categories</h3>
					<div className="flex flex-row md:flex-col gap-2 flex-wrap">
						<Link href="/shop">
							<Badge variant="default" className="cursor-pointer">
								All
							</Badge>
						</Link>
						{categories
							.filter((cat) => Boolean(cat.slug?.trim()))
							.map((cat) => (
								<Link key={cat._id} href={`/shop/${cat.slug}`}>
									<Badge variant="outline" className="cursor-pointer">
										{cat.name}
									</Badge>
								</Link>
							))}
					</div>
				</aside>

				{/* Products */}
				<div className="flex-1">
					<div className="flex items-center justify-between mb-6">
						<p className="text-muted-foreground text-sm">
							{filteredProducts.length} product
							{filteredProducts.length !== 1 ? "s" : ""}
						</p>
						<Select
							value={sort}
							onValueChange={(v) => setSort(v as SortOption)}
						>
							<SelectTrigger className="w-44">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="default">Default</SelectItem>
								<SelectItem value="price-asc">Price: Low to High</SelectItem>
								<SelectItem value="price-desc">Price: High to Low</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{filteredProducts.length > 0 ? (
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
									Try browsing other categories or check back later.
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
