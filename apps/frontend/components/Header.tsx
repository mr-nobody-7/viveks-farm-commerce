"use client";

import {
	Heart,
	Leaf,
	LogOut,
	Package,
	ShoppingCart,
	User,
	UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ICON_SIZE } from "@/lib/constants";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import {
	saveCartForUser,
	saveWishlistForUser,
} from "@/lib/user-scoped-storage";
import { HeaderNavigationMenu } from "./HeaderNavigationMenu";
import { LoginModal } from "./LoginModal";
import { Button } from "./ui/button";

export const Header = () => {
	const items = useCartStore((state) => state.items);
	const clearCart = useCartStore((state) => state.clearCart);
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const wishlistItems = useWishlistStore((state) => state.items);
	const clearWishlist = useWishlistStore((state) => state.clearWishlist);
	const [showLogin, setShowLogin] = useState(false);

	// Derive total count from items
	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

	const handleLogout = () => {
		if (user?.mobile) {
			saveCartForUser(user.mobile, items);
			saveWishlistForUser(user.mobile, wishlistItems);
		}

		clearCart();
		clearWishlist();
		logout();
	};

	return (
		<>
			<div className="w-full border-b sticky top-0 bg-white/95 backdrop-blur z-30">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
					<div className="flex items-center justify-between gap-3">
						<Link href="/" className="shrink-0">
							<div className="flex items-center gap-2">
								<Leaf
									className="h-6 w-6 text-primary"
									size={ICON_SIZE.HEADER}
								/>
								<span className="text-base sm:text-lg font-bold">
									Vivek's Farm
								</span>
							</div>
						</Link>
						<div className="hidden lg:block">
							<HeaderNavigationMenu />
						</div>
						<div className="flex items-center gap-1 sm:gap-2 shrink-0">
							{user ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-10 w-10">
											<User size={ICON_SIZE.HEADER} />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>
											{user.name || user.mobile}
										</DropdownMenuLabel>
										<DropdownMenuSeparator />{" "}
										<DropdownMenuItem asChild>
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
										<DropdownMenuSeparator />{" "}
										<DropdownMenuItem onClick={handleLogout}>
											<LogOut className="mr-2 h-4 w-4" />
											Logout
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<>
									<Button
										variant="ghost"
										onClick={() => setShowLogin(true)}
										className="hidden sm:inline-flex"
									>
										<User size={ICON_SIZE.HEADER} className="mr-2" />
										Login
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setShowLogin(true)}
										className="h-10 w-10 sm:hidden"
									>
										<User size={ICON_SIZE.HEADER} />
									</Button>
								</>
							)}
							<Button
								variant="ghost"
								className="relative h-10 w-10"
								size="icon"
								asChild
							>
								<Link href="/wishlist">
									<Heart size={ICON_SIZE.HEADER} />
									{wishlistItems.length > 0 && (
										<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
											{wishlistItems.length}
										</span>
									)}
								</Link>
							</Button>
							<Button
								variant="ghost"
								className="relative h-10 w-10"
								size="icon"
								asChild
							>
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

					<div className="lg:hidden border-t mt-2 pt-2">
						<div className="flex gap-4 overflow-x-auto text-sm whitespace-nowrap text-muted-foreground">
							<Link href="/" className="hover:text-primary">
								Home
							</Link>
							<Link href="/shop" className="hover:text-primary">
								Shop
							</Link>
							<Link href="/about-us" className="hover:text-primary">
								About
							</Link>
							<Link href="/contact-us" className="hover:text-primary">
								Contact
							</Link>
						</div>
					</div>
				</div>
			</div>
			<LoginModal open={showLogin} onOpenChange={setShowLogin} />
		</>
	);
};
