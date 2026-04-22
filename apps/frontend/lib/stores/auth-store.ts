import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedAddress {
	fullName: string;
	phone: string;
	addressLine: string;
	city: string;
	state: string;
	pincode: string;
}

export interface User {
	_id: string;
	mobile: string;
	name?: string;
	role: string;
	savedAddress?: SavedAddress;
}

export type AuthStore = {
	user: User | null;
	setUser: (user: User | null) => void;
	logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set({ user }),
			logout: () => set({ user: null }),
		}),
		{
			name: "viveks-farm-auth",
		},
	),
);
