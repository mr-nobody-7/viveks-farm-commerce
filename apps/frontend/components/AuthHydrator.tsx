"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { loadSelectionsForUser } from "@/lib/user-scoped-storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AuthHydrator() {
	const setUser = useAuthStore((state) => state.setUser);
	const clearCart = useCartStore((state) => state.clearCart);
	const addCartItem = useCartStore((state) => state.addItem);
	const clearWishlist = useWishlistStore((state) => state.clearWishlist);
	const addWishlistItem = useWishlistStore((state) => state.addItem);

	useEffect(() => {
		if (!API_URL) {
			setUser(null);
			return;
		}

		const hydrateAuth = async () => {
			try {
				const response = await fetch(`${API_URL}/api/users/me`, {
					credentials: "include",
				});

				if (response.status === 401) {
					setUser(null);
					return;
				}

				if (!response.ok) {
					return;
				}

				const user = await response.json();
				const scopedSelections = loadSelectionsForUser(user.mobile);

				clearCart();
				for (const item of scopedSelections.cart) {
					addCartItem(item);
				}

				clearWishlist();
				for (const item of scopedSelections.wishlist) {
					addWishlistItem(item);
				}

				setUser(user);
			} catch {
				// Ignore network errors; existing persisted state remains until next successful sync.
			}
		};

		hydrateAuth();
	}, [addCartItem, addWishlistItem, clearCart, clearWishlist, setUser]);

	return null;
}
