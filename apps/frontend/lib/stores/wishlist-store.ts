import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
	productId: string;
	slug: string;
	name: string;
	image: string;
	price: number;
	category: string;
};

export type WishlistStore = {
	items: WishlistItem[];
	addItem: (item: WishlistItem) => void;
	removeItem: (productId: string) => void;
	toggleItem: (item: WishlistItem) => void;
	isWishlisted: (productId: string) => boolean;
	clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
	persist(
		(set, get) => ({
			items: [],
			addItem: (item) => {
				set((state) => ({ items: [...state.items, item] }));
			},
			removeItem: (productId) => {
				set((state) => ({
					items: state.items.filter((i) => i.productId !== productId),
				}));
			},
			toggleItem: (item) => {
				const isWishlisted = get().isWishlisted(item.productId);
				if (isWishlisted) {
					get().removeItem(item.productId);
				} else {
					get().addItem(item);
				}
			},
			isWishlisted: (productId) => {
				return get().items.some((i) => i.productId === productId);
			},
			clearWishlist: () => set({ items: [] }),
		}),
		{
			name: "viveks-farm-wishlist",
		},
	),
);
