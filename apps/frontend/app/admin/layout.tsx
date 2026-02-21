"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({
	children,
}: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();

	// Don't show layout on login page
	if (pathname === "/admin/login") {
		return <>{children}</>;
	}

	const handleLogout = async () => {
		try {
			await fetch("http://localhost:4000/api/admin/logout", {
				method: "POST",
				credentials: "include",
			});
			router.push("/admin/login");
		} catch (err) {
			console.error("Logout failed:", err);
		}
	};

	const navItems = [
		{
			name: "Dashboard",
			path: "/admin/dashboard",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
			),
		},
		{
			name: "Orders",
			path: "/admin/orders",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
					/>
				</svg>
			),
		},
		{
			name: "Categories",
			path: "/admin/categories",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
					/>
				</svg>
			),
		},
		{
			name: "Products",
			path: "/admin/products",
			icon: (
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
					/>
				</svg>
			),
		},
	];

	return (
		<div className="min-h-screen flex bg-gray-50">
			{/* Sidebar */}
			<aside className="w-64 bg-white border-r border-gray-200">
				<div className="p-6">
					<h2 className="text-2xl font-bold text-green-600">
						Vivek's Farm
					</h2>
					<p className="text-sm text-gray-600 mt-1">Admin Panel</p>
				</div>

				<nav className="px-3 space-y-1">
					{navItems.map((item) => (
						<Link
							key={item.path}
							href={item.path}
							className={cn(
								"flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
								pathname === item.path
									? "bg-green-50 text-green-700"
									: "text-gray-700 hover:bg-gray-50",
							)}
						>
							{item.icon}
							{item.name}
						</Link>
					))}

					<button
						type="button"
						onClick={handleLogout}
						className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
						Logout
					</button>
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 p-8">{children}</main>
		</div>
	);
}
