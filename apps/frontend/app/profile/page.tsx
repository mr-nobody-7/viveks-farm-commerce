"use client";

import { Loader2, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { INDIAN_STATES } from "@/lib/constants";
import { useAuthStore } from "@/lib/stores/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Profile = () => {
	const user = useAuthStore((state) => state.user);
	const setUser = useAuthStore((state) => state.setUser);
	const router = useRouter();

	// Basic info
	const [name, setName] = useState("");
	const [profileLoading, setProfileLoading] = useState(false);

	// Saved address
	const [addrFullName, setAddrFullName] = useState("");
	const [addrPhone, setAddrPhone] = useState("");
	const [addrLine, setAddrLine] = useState("");
	const [addrCity, setAddrCity] = useState("");
	const [addrState, setAddrState] = useState("");
	const [addrPincode, setAddrPincode] = useState("");
	const [addrLoading, setAddrLoading] = useState(false);

	useEffect(() => {
		if (!user) {
			router.push("/");
		} else {
			setName(user.name || "");
			if (user.savedAddress) {
				setAddrFullName(user.savedAddress.fullName || "");
				setAddrPhone(user.savedAddress.phone || "");
				setAddrLine(user.savedAddress.addressLine || "");
				setAddrCity(user.savedAddress.city || "");
				setAddrState(user.savedAddress.state || "");
				setAddrPincode(user.savedAddress.pincode || "");
			}
		}
	}, [user, router]);

	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setProfileLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/users/profile`, {
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
			if (!response.ok) throw new Error("Failed to update profile");
			const updatedUser = await response.json();
			setUser(updatedUser);
			toast.success("Profile updated successfully!");
		} catch {
			toast.error("Failed to update profile");
		} finally {
			setProfileLoading(false);
		}
	};

	const handleSaveAddress = async (e: React.FormEvent) => {
		e.preventDefault();
		setAddrLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/users/address`, {
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fullName: addrFullName,
					phone: addrPhone,
					addressLine: addrLine,
					city: addrCity,
					state: addrState,
					pincode: addrPincode,
				}),
			});
			if (!response.ok) throw new Error("Failed to save address");
			const updatedUser = await response.json();
			setUser(updatedUser);
			toast.success("Address saved successfully!");
		} catch {
			toast.error("Failed to save address");
		} finally {
			setAddrLoading(false);
		}
	};

	if (!user) {
		return null;
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
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
					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle>Basic Information</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSaveProfile} className="space-y-4">
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
								<Button type="submit" disabled={profileLoading}>
									{profileLoading ? (
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

					{/* Saved Address */}
					<Card>
						<CardHeader>
							<CardTitle>Saved Address</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSaveAddress} className="space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="addrFullName">Full Name</Label>
										<Input
											id="addrFullName"
											value={addrFullName}
											onChange={(e) => setAddrFullName(e.target.value)}
											placeholder="Full name"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="addrPhone">Phone</Label>
										<Input
											id="addrPhone"
											type="tel"
											value={addrPhone}
											onChange={(e) => setAddrPhone(e.target.value)}
											placeholder="10-digit mobile number"
											pattern="[0-9]{10}"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="addrLine">Address</Label>
									<Input
										id="addrLine"
										value={addrLine}
										onChange={(e) => setAddrLine(e.target.value)}
										placeholder="House/Flat, Street"
									/>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									<div className="space-y-2">
										<Label htmlFor="addrCity">City</Label>
										<Input
											id="addrCity"
											value={addrCity}
											onChange={(e) => setAddrCity(e.target.value)}
											placeholder="City"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="addrState">State</Label>
										<Select value={addrState} onValueChange={setAddrState}>
											<SelectTrigger id="addrState">
												<SelectValue placeholder="Select state" />
											</SelectTrigger>
											<SelectContent>
												{INDIAN_STATES.map((s) => (
													<SelectItem key={s} value={s}>
														{s}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="addrPincode">Pincode</Label>
										<Input
											id="addrPincode"
											value={addrPincode}
											onChange={(e) => setAddrPincode(e.target.value)}
											placeholder="500001"
											pattern="[0-9]{6}"
										/>
									</div>
								</div>
								<Button type="submit" disabled={addrLoading}>
									{addrLoading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Saving...
										</>
									) : (
										"Save Address"
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
