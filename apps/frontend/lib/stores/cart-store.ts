import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
	productId: string;
	slug: string;
	name: string;
	image: string;
	variantLabel: string;
	price: number;
	quantity: number;
};

export type CartStore = {
	items: CartItem[];
	addItem: (item: CartItem) => void;
	removeItem: (productId: string, variantLabel: string) => void;
	updateQuantity: (
		productId: string,
		variantLabel: string,
		quantity: number,
	) => void;
	clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],

			addItem: (item) => {
				const existing = get().items.find(
					(i) =>
						i.productId === item.productId &&
						i.variantLabel === item.variantLabel,
				);

				if (existing) {
					set({
						items: get().items.map((i) =>
							i.productId === item.productId &&
							i.variantLabel === item.variantLabel
								? { ...i, quantity: i.quantity + item.quantity }
								: i,
						),
					});
				} else {
					set({ items: [...get().items, item] });
				}
			},

			removeItem: (productId, variantLabel) =>
				set({
					items: get().items.filter(
						(i) =>
							!(i.productId === productId && i.variantLabel === variantLabel),
					),
				}),

			updateQuantity: (productId, variantLabel, quantity) => {
				if (quantity <= 0) {
					get().removeItem(productId, variantLabel);
					return;
				}

				set({
					items: get().items.map((i) =>
						i.productId === productId && i.variantLabel === variantLabel
							? { ...i, quantity }
							: i,
					),
				});
			},

			clearCart: () => set({ items: [] }),
		}),
		{
			name: "viveks-farm-cart",
		},
	),
);
