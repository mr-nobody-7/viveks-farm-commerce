import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Checkout",
	description:
		"Complete your purchase of fresh farm products. Choose online payment or cash on delivery.",
};

export default function CheckoutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
