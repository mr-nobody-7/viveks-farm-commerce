import type { Metadata } from "next";
import type { ReactNode } from "react";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ category: string }>;
}): Promise<Metadata> {
	const { category } = await params;

	// Convert slug to title-case display name
	const displayName = category
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
			{ cache: "no-store" },
		);

		if (res.ok) {
			const categories = await res.json();
			const match = categories.find(
				(c: { slug: string; name: string; description?: string }) =>
					c.slug === category,
			);

			if (match) {
				return {
					title: `${match.name} | Vivek's Farm`,
					description:
						match.description ||
						`Shop ${match.name} — 100% natural farm products with no preservatives. Direct from our farm to your kitchen.`,
					openGraph: {
						title: `${match.name} | Vivek's Farm`,
						description:
							match.description ||
							`Explore our range of ${match.name} — handcrafted with traditional recipes.`,
						type: "website",
					},
				};
			}
		}
	} catch {
		// fall through to default
	}

	return {
		title: `${displayName} | Vivek's Farm`,
		description: `Shop ${displayName} — 100% natural farm products with no preservatives.`,
	};
}

export default function CategoryLayout({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
