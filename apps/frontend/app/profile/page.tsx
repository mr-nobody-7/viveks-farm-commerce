"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Package, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const Profile = () => {
	const user = useAuthStore((state) => state.user);
	const setUser = useAuthStore((state) => state.setUser);
	const router = useRouter();
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (!user) {
			router.push("/");
		} else {
			setName(user.name || "");
		}
	}, [user, router]);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			const response = await fetch(`${API_URL}/users/profile`, {
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});

			if (!response.ok) {
				throw new Error("Failed to update profile");
			}

			const updatedUser = await response.json();
			setUser(updatedUser);
			setMessage("Profile updated successfully!");
		} catch (err) {
			setMessage("Failed to update profile");
		} finally {
			setLoading(false);
		}
	};

	if (!user) {
		return null;
	}

	return (
		<div className="container py-8 max-w-4xl">
			<h1 className="text-3xl font-bold mb-8">My Profile</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Sidebar */}
				<Card className="h-fit">
					<CardContent className="p-6 space-y-2">
						<Link
							href="/profile"
							className="flex items-center gap-3 py-2 px-3 rounded-lg bg-primary text-primary-foreground"
						>
							Profile
						</Link>
						<Link
							href="/profile/orders"
							className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-secondary"
						>
							<Package className="h-4 w-4" />
							My Orders
						</Link>
					</CardContent>
				</Card>

				{/* Main Content */}
				<div className="md:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Basic Information</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSave} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="mobile">Mobile Number</Label>
									<Input id="mobile" value={user.mobile} disabled />
								</div>
								<div className="space-y-2">
									<Label htmlFor="name">Full Name</Label>
									<Input
										id="name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder="Enter your name"
									/>
								</div>
								{message && (
									<p
										className={`text-sm ${
											message.includes("success")
												? "text-green-600"
												: "text-destructive"
										}`}
									>
										{message}
									</p>
								)}
								<Button type="submit" disabled={loading}>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Saving...
										</>
									) : (
										"Save Changes"
									)}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Profile;
