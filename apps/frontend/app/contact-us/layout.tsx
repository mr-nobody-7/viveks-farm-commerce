import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Contact Us",
	description:
		"Get in touch with Vivek's Farm. Reach us via WhatsApp, phone, or email for orders, queries, and feedback. We're happy to help!",
	openGraph: {
		title: "Contact Us | Vivek's Farm",
		description:
			"Contact Vivek's Farm for orders, queries, and feedback. Available on WhatsApp and phone.",
		type: "website",
	},
};

export default function ContactLayout({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
