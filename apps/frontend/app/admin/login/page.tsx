"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch(`${API_URL}/api/admin/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include", // Important for cookies
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.message || "Login failed");
				setLoading(false);
				return;
			}

			// Redirect to admin dashboard
			router.push("/admin/dashboard");
		} catch (_err) {
			setError("Failed to connect to server");
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Admin Login</h1>
					<p className="mt-2 text-gray-600">
						Sign in to access the admin panel
					</p>
				</div>

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email
							</label>
							<input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
								disabled={loading}
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
								disabled={loading}
							/>
						</div>
					</div>

					{error && (
						<div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
							{error}
						</div>
					)}

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Signing in..." : "Sign In"}
					</Button>
				</form>
			</div>
		</div>
	);
}
