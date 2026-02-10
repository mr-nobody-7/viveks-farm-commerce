"use client";
import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/data/categories";
import { products, getProductsByCategory } from "@/lib/data/products";
import Link from "next/link";
import { useParams } from "next/navigation";

type SortOption = "default" | "price-asc" | "price-desc";

const Shop = () => {
  const { category } = useParams<{ category?: string }>();
  const [sort, setSort] = useState<SortOption>("default");

  const filteredProducts = useMemo(() => {
    let list = category ? getProductsByCategory(category) : products;
    if (sort === "price-asc") {
      list = [...list].sort(
        (a, b) => a.variants[0].sellingPrice - b.variants[0].sellingPrice,
      );
    } else if (sort === "price-desc") {
      list = [...list].sort(
        (a, b) => b.variants[0].sellingPrice - a.variants[0].sellingPrice,
      );
    }
    return list;
  }, [category, sort]);

  const currentCategory = categories.find((c) => c.id === category);

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        {currentCategory && (
          <>
            <span>/</span>
            <span className="text-foreground">{currentCategory.name}</span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Category Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="flex flex-row md:flex-col gap-2 flex-wrap">
            <Link href="/shop">
              <Badge
                variant={!category ? "default" : "outline"}
                className="cursor-pointer"
              >
                All
              </Badge>
            </Link>
            {categories.map((cat: any) => (
              <Link key={cat.id} href={`/shop/${cat.id}`}>
                <Badge
                  variant={category === cat.id ? "default" : "outline"}
                  className="cursor-pointer"
                >
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
              {filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                No products found in this category.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/shop">Browse all products</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
