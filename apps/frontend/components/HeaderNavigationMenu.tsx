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
	Soup,
	Wheat,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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

export function HeaderNavigationMenu() {
	const pathname = usePathname();

	const { data: categories = [] } = useQuery({
		queryKey: ["categories"],
		queryFn: api.getCategories,
	});

	const isActive = (path: string) =>
		path === "/"
			? pathname === "/"
			: pathname === path || pathname.startsWith(`${path}/`);

	const isShopActive = pathname.startsWith("/shop");

	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={cn(
							navigationMenuTriggerStyle(),
							isActive("/") && "bg-accent text-accent-foreground",
						)}
					>
						<Link href="/">Home</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={cn(
							navigationMenuTriggerStyle(),
							pathname === "/shop" && "bg-accent text-accent-foreground",
						)}
					>
						<Link href="/shop">Shop All</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger
						className={cn(
							isShopActive &&
								pathname !== "/shop" &&
								"bg-accent text-accent-foreground",
						)}
					>
						Categories
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<div className="grid grid-cols-2 gap-1 p-3 w-[420px]">
							{categories.map((cat) => {
								const Icon = slugIconMap[cat.slug.toLowerCase()] ?? Leaf;
								const active = pathname === `/shop/${cat.slug}`;
								return (
									<Link
										key={cat._id}
										href={`/shop/${cat.slug}`}
										className={cn(
											"flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
											active && "bg-accent text-accent-foreground font-medium",
										)}
									>
										<span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
											<Icon className="h-4 w-4" />
										</span>
										<div>
											<p className="font-medium leading-none">{cat.name}</p>
											{cat.description && (
												<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
													{cat.description}
												</p>
											)}
										</div>
									</Link>
								);
							})}
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={cn(
							navigationMenuTriggerStyle(),
							isActive("/about-us") && "bg-accent text-accent-foreground",
						)}
					>
						<Link href="/about-us">About Us</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						className={cn(
							navigationMenuTriggerStyle(),
							isActive("/contact-us") && "bg-accent text-accent-foreground",
						)}
					>
						<Link href="/contact-us">Contact Us</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
