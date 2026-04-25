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
		default: "Vivek's Farm | Pure & Natural Farm Products",
		template: "%s | Vivek's Farm",
	},
	description:
		"Shop 100% natural farm products — pure A2 ghee, handmade pickles, raw honey, cold-pressed oils, and traditional sweets. Farm fresh, no preservatives, pan-India delivery.",
	keywords: [
		"A2 ghee",
		"farm fresh",
		"organic honey",
		"cold pressed oils",
		"handmade pickles",
		"natural sweets",
		"no preservatives",
		"traditional recipes",
		"bilona ghee",
		"Vivek Farm",
	],
	authors: [{ name: "Vivek's Farm" }],
	creator: "Vivek's Farm",
	openGraph: {
		type: "website",
		locale: "en_IN",
		siteName: "Vivek's Farm",
		title: "Vivek's Farm | Pure & Natural Farm Products",
		description:
			"100% natural farm products — A2 ghee, pickles, honey, oils and sweets. No preservatives, traditional recipes, delivered across India.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Vivek's Farm | Pure & Natural Farm Products",
		description:
			"Shop pure A2 ghee, raw honey, handmade pickles & more. Farm fresh, no chemicals, pan-India delivery.",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-snippet": -1,
			"max-image-preview": "large",
		},
	},
	category: "shopping",
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
