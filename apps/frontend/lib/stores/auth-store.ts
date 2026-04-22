import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedAddress {
	_id: string;
	label?: string;
	fullName: string;
	phone: string;
	addressLine: string;
	city: string;
	state: string;
	pincode: string;
	isDefault: boolean;
}

export interface User {
	_id: string;
	mobile: string;
	name?: string;
	role: string;
	addresses?: SavedAddress[];
}

export type AuthStore = {
	user: User | null;
	_hasHydrated: boolean;
	setUser: (user: User | null) => void;
	logout: () => void;
	setHasHydrated: (v: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			user: null,
			_hasHydrated: false,
			setUser: (user) => set({ user }),
			logout: () => set({ user: null }),
			setHasHydrated: (v) => set({ _hasHydrated: v }),
		}),
		{
			name: "viveks-farm-auth",
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
