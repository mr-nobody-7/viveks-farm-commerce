"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AuthHydrator() {
	const setUser = useAuthStore((state) => state.setUser);

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
				setUser(user);
			} catch {
				// Ignore network errors; existing persisted state remains until next successful sync.
			}
		};

		hydrateAuth();
	}, [setUser]);

	return null;
}
