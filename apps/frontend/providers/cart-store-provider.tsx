"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import {
	type CartStore,
	createCartStore,
	type CartItem,
} from "@/lib/stores/cart-store";

export type CartStoreApi = ReturnType<typeof createCartStore>;

export const CartStoreContext = createContext<CartStoreApi | undefined>(
	undefined,
);

export interface CartStoreProviderProps {
	children: ReactNode;
}

export const CartStoreProvider = ({ children }: CartStoreProviderProps) => {
	const storeRef = useRef<CartStoreApi>(null);

	if (!storeRef.current) {
		storeRef.current = createCartStore();
	}

	return (
		<CartStoreContext.Provider value={storeRef.current}>
			{children}
		</CartStoreContext.Provider>
	);
};

export const useCartStore = <T,>(selector: (store: CartStore) => T): T => {
	const cartStoreContext = useContext(CartStoreContext);

	if (!cartStoreContext) {
		throw new Error("useCartStore must be used within CartStoreProvider");
	}

	return useStore(cartStoreContext, selector);
};

// Convenience hook to get cart items
export const useCart = () => {
	const items = useCartStore((state) => state.items);
	const addItem = useCartStore((state) => state.addItem);
	const removeItem = useCartStore((state) => state.removeItem);
	const updateQuantity = useCartStore((state) => state.updateQuantity);
	const clearCart = useCartStore((state) => state.clearCart);
	const getTotalItems = useCartStore((state) => state.getTotalItems);
	const getSubtotal = useCartStore((state) => state.getSubtotal);

	return {
		items,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		totalItems: getTotalItems(),
		subtotal: getSubtotal(),
	};
};

export type { CartItem };
