import type { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ product_id: string }>;
}): Promise<Metadata> {
	const { product_id } = await params;
	const fallbackMetadata: Metadata = {
		title: "Product Not Found",
		description: "The requested product is unavailable at the moment.",
	};

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/products/${product_id}`,
			{ cache: "no-store" },
		);

		if (!response.ok) {
			return fallbackMetadata;
		}

		const product = await response.json();

		return {
			title: `${product.name} - Buy Online`,
			description:
				product.description || `Buy ${product.name} online at Vivek's Farm`,
			openGraph: {
				title: product.name,
				description: product.description,
				images: product.images?.[0]
					? [{ url: product.images[0] }]
					: undefined,
			},
		};
	} catch {
		return fallbackMetadata;
	}
}

export default function ProductLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
