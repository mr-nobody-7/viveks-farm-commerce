"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppButton } from "./WhatsAppButton";

const Layout = ({ children }: { children: ReactNode }) => {
	const pathname = usePathname();
	const isAdminRoute = pathname?.startsWith("/admin");

	if (isAdminRoute) {
		return <main className="min-h-screen">{children}</main>;
	}

	return (
		<div className="flex min-h-screen flex-col">
			<AnnouncementBar />
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
			<WhatsAppButton />
		</div>
	);
};

export default Layout;
