import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Profile",
	description:
		"Manage your profile and view your order history at Vivek's Farm.",
};

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
