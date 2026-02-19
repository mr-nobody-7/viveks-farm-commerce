"use client";

import Link from "next/link";
import { HeaderNavigationMenu } from "./HeaderNavigationMenu";
import Image from "next/image";
import { Leaf, ShoppingCart, User, LogOut, Package, UserCircle } from "lucide-react";
import { ICON_SIZE } from "@/lib/constants";
import { Button } from "./ui/button";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useState } from "react";
import { LoginModal } from "./LoginModal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
	const items = useCartStore((state) => state.items);
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const [showLogin, setShowLogin] = useState(false);

	// Derive total count from items
	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

	const handleLogout = () => {
		logout();
	};

	return (
		<>
			<div className="w-full border-b flex items-center justify-between px-10 py-2 sticky top-0 bg-white opacity-90 z-10">
				<Link href="/">
					<div className="flex items-center gap-2">
						<Leaf className="h-6 w-6 text-primary" size={ICON_SIZE.HEADER} />
						<span className="text-xl font-bold">Vivek's Farm</span>
					</div>
				</Link>
				<HeaderNavigationMenu />
				<div className="flex items-center justify-between gap-2">
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<User size={ICON_SIZE.HEADER} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>
									{user.name || user.mobile}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />							<DropdownMenuItem asChild>
								<Link href="/profile">
									<UserCircle className="mr-2 h-4 w-4" />
									Profile
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link href="/profile/orders">
									<Package className="mr-2 h-4 w-4" />
									My Orders
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />								<DropdownMenuItem onClick={handleLogout}>
									<LogOut className="mr-2 h-4 w-4" />
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button variant="ghost" onClick={() => setShowLogin(true)}>
							<User size={ICON_SIZE.HEADER} className="mr-2" />
							Login
						</Button>
					)}
					<Button variant="ghost" className="relative" asChild>
						<Link href="/cart">
							<ShoppingCart size={ICON_SIZE.HEADER} />
							{totalItems > 0 && (
								<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
									{totalItems}
								</span>
							)}
						</Link>
					</Button>
				</div>
			</div>
			<LoginModal open={showLogin} onOpenChange={setShowLogin} />
		</>
	);
};
