import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthHydrator } from "@/components/AuthHydrator";
import "./globals.css";
import Layout from "@/components/Layout";
import { CartStoreProvider } from "@/providers/cart-store-provider";
import { ReactQueryProvider } from "@/providers/react-query-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Vivek's Farm - Fresh Farm Products Delivered",
		template: "%s | Vivek's Farm",
	},
	description:
		"Shop 100% natural farm products including pure ghee, traditional pickles, honey, and homemade sweets. Directly from our fields to your kitchen with no preservatives or chemicals.",
	keywords: [
		"farm products",
		"organic ghee",
		"traditional pickles",
		"natural honey",
		"homemade sweets",
		"farm fresh",
	],
	authors: [{ name: "Vivek's Farm" }],
	openGraph: {
		type: "website",
		locale: "en_IN",
		siteName: "Vivek's Farm",
		title: "Vivek's Farm - Fresh Farm Products Delivered",
		description:
			"100% natural farm products with no preservatives. Traditional recipes passed down through generations.",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ReactQueryProvider>
					<CartStoreProvider>
						<AuthHydrator />
						<Layout>{children}</Layout>{" "}
						<Toaster richColors position="top-center" />{" "}
					</CartStoreProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
