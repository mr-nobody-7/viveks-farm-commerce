import { createStore } from "zustand/vanilla";

export interface CartItem {
	productId: string;
	name: string;
	image: string;
	weight: string;
	sellingPrice: number;
	quantity: number;
}

export interface CartState {
	items: CartItem[];
}

export interface CartActions {
	addItem: (item: Omit<CartItem, "quantity">) => void;
	removeItem: (productId: string, weight: string) => void;
	updateQuantity: (productId: string, weight: string, quantity: number) => void;
	clearCart: () => void;
	getTotalItems: () => number;
	getSubtotal: () => number;
}

export type CartStore = CartState & CartActions;

export const defaultInitState: CartState = {
	items: [],
};

export const createCartStore = (initState: CartState = defaultInitState) => {
	return createStore<CartStore>()((set, get) => ({
		...initState,

		addItem: (item) => {
			set((state) => {
				const existing = state.items.find(
					(i) => i.productId === item.productId && i.weight === item.weight,
				);

				if (existing) {
					return {
						items: state.items.map((i) =>
							i.productId === item.productId && i.weight === item.weight
								? { ...i, quantity: i.quantity + 1 }
								: i,
						),
					};
				}

				return {
					items: [...state.items, { ...item, quantity: 1 }],
				};
			});
		},

		removeItem: (productId, weight) => {
			set((state) => ({
				items: state.items.filter(
					(i) => !(i.productId === productId && i.weight === weight),
				),
			}));
		},

		updateQuantity: (productId, weight, quantity) => {
			if (quantity <= 0) {
				get().removeItem(productId, weight);
				return;
			}

			set((state) => ({
				items: state.items.map((i) =>
					i.productId === productId && i.weight === weight
						? { ...i, quantity }
						: i,
				),
			}));
		},

		clearCart: () => {
			set({ items: [] });
		},

		getTotalItems: () => {
			const state = get();
			return state.items.reduce((sum, i) => sum + i.quantity, 0);
		},

		getSubtotal: () => {
			const state = get();
			return state.items.reduce(
				(sum, i) => sum + i.sellingPrice * i.quantity,
				0,
			);
		},
	}));
};
