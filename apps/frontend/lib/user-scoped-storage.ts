import type { CartItem } from "@/lib/stores/cart-store";
import type { WishlistItem } from "@/lib/stores/wishlist-store";

const CART_USER_KEY = "viveks-farm-cart-by-user";
const WISHLIST_USER_KEY = "viveks-farm-wishlist-by-user";

type CartByUser = Record<string, CartItem[]>;
type WishlistByUser = Record<string, WishlistItem[]>;

const canUseStorage = () => typeof window !== "undefined";

const readJson = <T>(key: string, fallback: T): T => {
	if (!canUseStorage()) return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
};

const writeJson = <T>(key: string, value: T) => {
	if (!canUseStorage()) return;
	window.localStorage.setItem(key, JSON.stringify(value));
};

const mergeCartItems = (base: CartItem[], incoming: CartItem[]): CartItem[] => {
	const merged = new Map<string, CartItem>();

	for (const item of base) {
		const key = `${item.productId}__${item.variantLabel}`;
		merged.set(key, { ...item });
	}

	for (const item of incoming) {
		const key = `${item.productId}__${item.variantLabel}`;
		const existing = merged.get(key);
		if (existing) {
			merged.set(key, {
				...existing,
				quantity: existing.quantity + item.quantity,
			});
		} else {
			merged.set(key, { ...item });
		}
	}

	return Array.from(merged.values());
};

const mergeWishlistItems = (
	base: WishlistItem[],
	incoming: WishlistItem[],
): WishlistItem[] => {
	const merged = new Map<string, WishlistItem>();

	for (const item of base) {
		merged.set(item.productId, { ...item });
	}

	for (const item of incoming) {
		if (!merged.has(item.productId)) {
			merged.set(item.productId, { ...item });
		}
	}

	return Array.from(merged.values());
};

export const saveCartForUser = (mobile: string, items: CartItem[]) => {
	const all = readJson<CartByUser>(CART_USER_KEY, {});
	all[mobile] = items;
	writeJson(CART_USER_KEY, all);
};

export const saveWishlistForUser = (mobile: string, items: WishlistItem[]) => {
	const all = readJson<WishlistByUser>(WISHLIST_USER_KEY, {});
	all[mobile] = items;
	writeJson(WISHLIST_USER_KEY, all);
};

export const attachGuestSelectionsToUser = (
	mobile: string,
	guestCartItems: CartItem[],
	guestWishlistItems: WishlistItem[],
) => {
	const cartByUser = readJson<CartByUser>(CART_USER_KEY, {});
	const wishlistByUser = readJson<WishlistByUser>(WISHLIST_USER_KEY, {});

	const mergedCart = mergeCartItems(cartByUser[mobile] || [], guestCartItems);
	const mergedWishlist = mergeWishlistItems(
		wishlistByUser[mobile] || [],
		guestWishlistItems,
	);

	cartByUser[mobile] = mergedCart;
	wishlistByUser[mobile] = mergedWishlist;

	writeJson(CART_USER_KEY, cartByUser);
	writeJson(WISHLIST_USER_KEY, wishlistByUser);

	return { mergedCart, mergedWishlist };
};

export const loadSelectionsForUser = (mobile: string) => {
	const cartByUser = readJson<CartByUser>(CART_USER_KEY, {});
	const wishlistByUser = readJson<WishlistByUser>(WISHLIST_USER_KEY, {});

	return {
		cart: cartByUser[mobile] || [],
		wishlist: wishlistByUser[mobile] || [],
	};
};
