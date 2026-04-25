import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "My Wishlist",
	description:
		"View and manage your saved farm products. Add items to cart or remove from your wishlist on Vivek's Farm.",
	robots: {
		index: false,
		follow: false,
	},
};

export default function WishlistLayout({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
