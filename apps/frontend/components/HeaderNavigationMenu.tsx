"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	NavigationMenu,
	NavigationMenuLink,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function HeaderNavigationMenu() {
	const pathname = usePathname();

	const isActive = (path: string) =>
		path === "/"
			? pathname === "/"
			: pathname === path || pathname.startsWith(`${path}/`);

	return (
		<NavigationMenu>
			<NavigationMenuLink
				asChild
				className={cn(
					navigationMenuTriggerStyle(),
					isActive("/") && "bg-accent text-accent-foreground",
				)}
			>
				<Link href="/">Home</Link>
			</NavigationMenuLink>
			<NavigationMenuLink
				asChild
				className={cn(
					navigationMenuTriggerStyle(),
					isActive("/shop") && "bg-accent text-accent-foreground",
				)}
			>
				<Link href="/shop">Shop All</Link>
			</NavigationMenuLink>
			<NavigationMenuLink
				asChild
				className={cn(
					navigationMenuTriggerStyle(),
					isActive("/shop") && "bg-accent text-accent-foreground",
				)}
			>
				<Link href="/shop">Categories</Link>
			</NavigationMenuLink>
			<NavigationMenuLink
				asChild
				className={cn(
					navigationMenuTriggerStyle(),
					isActive("/about-us") && "bg-accent text-accent-foreground",
				)}
			>
				<Link href="/about-us">About Us</Link>
			</NavigationMenuLink>
			<NavigationMenuLink
				asChild
				className={cn(
					navigationMenuTriggerStyle(),
					isActive("/contact-us") && "bg-accent text-accent-foreground",
				)}
			>
				<Link href="/contact-us">Contact Us</Link>
			</NavigationMenuLink>
		</NavigationMenu>
	);
}
