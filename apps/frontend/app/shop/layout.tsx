import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Shop Fresh Farm Products | Vivek's Farm",
	description:
		"Browse our selection of 100% natural farm products including ghee, pickles, honey, and sweets. Direct from farm to your kitchen with no preservatives.",
	openGraph: {
		title: "Shop Fresh Farm Products | Vivek's Farm",
		description:
			"100% natural farm products with no preservatives. Traditional recipes passed down through generations.",
		type: "website",
	},
};

export default function ShopLayout({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
