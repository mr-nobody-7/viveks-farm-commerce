import type { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ product_id: string }>;
}): Promise<Metadata> {
	const { product_id } = await params;

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/products/slug/${product_id}`,
			{ cache: "no-store" },
		);

		if (!response.ok) {
			return {
				title: "Product Not Found",
			};
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
	} catch (error) {
		return {
			title: "Product",
		};
	}
}

export default function ProductLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
