import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
	_id: string;
	mobile: string;
	name?: string;
	role: string;
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
