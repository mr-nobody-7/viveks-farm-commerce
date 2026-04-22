"use client";

import { Loader2, MapPin, Package, Plus, Star, Trash2 } from "lucide-react";
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
import { type SavedAddress, useAuthStore } from "@/lib/stores/auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type AddressForm = {
	label: string;
	fullName: string;
	phone: string;
	addressLine: string;
	city: string;
	state: string;
	pincode: string;
};

const emptyForm = (): AddressForm => ({
	label: "",
	fullName: "",
	phone: "",
	addressLine: "",
	city: "",
	state: "",
	pincode: "",
});

const Profile = () => {
	const user = useAuthStore((state) => state.user);
	const setUser = useAuthStore((state) => state.setUser);
	const hasHydrated = useAuthStore((state) => state._hasHydrated);
	const router = useRouter();

	const [name, setName] = useState("");
	const [profileLoading, setProfileLoading] = useState(false);

	// New address form
	const [showAddForm, setShowAddForm] = useState(false);
	const [newAddr, setNewAddr] = useState<AddressForm>(emptyForm());
	const [addrLoading, setAddrLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState<string | null>(null);

	useEffect(() => {
		if (!hasHydrated) return;
		if (!user) {
			router.push("/");
		} else {
			setName(user.name || "");
		}
	}, [hasHydrated, user, router]);

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

	const handleAddAddress = async (e: React.FormEvent) => {
		e.preventDefault();
		setAddrLoading(true);
		try {
			const response = await fetch(`${API_URL}/api/users/addresses`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...newAddr,
					isDefault: (user?.addresses?.length ?? 0) === 0,
				}),
			});
			if (!response.ok) throw new Error("Failed to add address");
			const updatedUser = await response.json();
			setUser(updatedUser);
			toast.success("Address added!");
			setShowAddForm(false);
			setNewAddr(emptyForm());
		} catch {
			toast.error("Failed to add address");
		} finally {
			setAddrLoading(false);
		}
	};

	const handleDeleteAddress = async (id: string) => {
		setActionLoading(id);
		try {
			const response = await fetch(`${API_URL}/api/users/addresses/${id}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (!response.ok) throw new Error("Failed to delete address");
			const updatedUser = await response.json();
			setUser(updatedUser);
			toast.success("Address deleted");
		} catch {
			toast.error("Failed to delete address");
		} finally {
			setActionLoading(null);
		}
	};

	const handleSetDefault = async (id: string) => {
		setActionLoading(`${id}-default`);
		try {
			const response = await fetch(
				`${API_URL}/api/users/addresses/${id}/default`,
				{
					method: "PATCH",
					credentials: "include",
				},
			);
			if (!response.ok) throw new Error("Failed to set default");
			const updatedUser = await response.json();
			setUser(updatedUser);
			toast.success("Default address updated");
		} catch {
			toast.error("Failed to update default address");
		} finally {
			setActionLoading(null);
		}
	};

	if (!hasHydrated || !user) {
		return null;
	}

	const addresses: SavedAddress[] = user.addresses || [];

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

					{/* Saved Addresses */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>Saved Addresses</CardTitle>
								<Button
									type="button"
									size="sm"
									variant="outline"
									onClick={() => setShowAddForm(!showAddForm)}
								>
									<Plus className="h-4 w-4 mr-1" />
									Add Address
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Existing addresses */}
							{addresses.length === 0 && !showAddForm && (
								<p className="text-sm text-muted-foreground">
									No saved addresses yet. Add one to speed up checkout.
								</p>
							)}
							{addresses.map((addr) => (
								<div key={addr._id} className="border rounded-lg p-4 space-y-1">
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
											<p className="font-medium text-sm">
												{addr.label || addr.fullName}
												{addr.isDefault && (
													<span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
														Default
													</span>
												)}
											</p>
										</div>
										<div className="flex items-center gap-1 shrink-0">
											{!addr.isDefault && (
												<Button
													size="sm"
													variant="ghost"
													className="h-8 text-xs"
													onClick={() => handleSetDefault(addr._id)}
													disabled={actionLoading === `${addr._id}-default`}
												>
													{actionLoading === `${addr._id}-default` ? (
														<Loader2 className="h-3 w-3 animate-spin" />
													) : (
														<>
															<Star className="h-3 w-3 mr-1" />
															Set Default
														</>
													)}
												</Button>
											)}
											<Button
												size="icon"
												variant="ghost"
												className="h-8 w-8 text-destructive hover:text-destructive"
												onClick={() => handleDeleteAddress(addr._id)}
												disabled={actionLoading === addr._id}
											>
												{actionLoading === addr._id ? (
													<Loader2 className="h-3 w-3 animate-spin" />
												) : (
													<Trash2 className="h-3 w-3" />
												)}
											</Button>
										</div>
									</div>
									<p className="text-xs text-muted-foreground pl-6">
										{addr.fullName} · {addr.phone}
									</p>
									<p className="text-xs text-muted-foreground pl-6">
										{addr.addressLine}, {addr.city}, {addr.state} -{" "}
										{addr.pincode}
									</p>
								</div>
							))}

							{/* Add new address form */}
							{showAddForm && (
								<form
									onSubmit={handleAddAddress}
									className="space-y-4 border rounded-lg p-4"
								>
									<p className="font-medium text-sm">New Address</p>
									<div className="space-y-2">
										<Label htmlFor="newAddrLabel">Label (optional)</Label>
										<Input
											id="newAddrLabel"
											value={newAddr.label}
											onChange={(e) =>
												setNewAddr((p) => ({ ...p, label: e.target.value }))
											}
											placeholder="Home, Office, etc."
										/>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="newAddrFullName">Full Name</Label>
											<Input
												id="newAddrFullName"
												required
												value={newAddr.fullName}
												onChange={(e) =>
													setNewAddr((p) => ({
														...p,
														fullName: e.target.value,
													}))
												}
												placeholder="Full name"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="newAddrPhone">Phone</Label>
											<Input
												id="newAddrPhone"
												type="tel"
												required
												value={newAddr.phone}
												onChange={(e) =>
													setNewAddr((p) => ({ ...p, phone: e.target.value }))
												}
												placeholder="10-digit number"
												pattern="[0-9]{10}"
											/>
										</div>
									</div>
									<div className="space-y-2">
										<Label htmlFor="newAddrLine">Address</Label>
										<Input
											id="newAddrLine"
											required
											value={newAddr.addressLine}
											onChange={(e) =>
												setNewAddr((p) => ({
													...p,
													addressLine: e.target.value,
												}))
											}
											placeholder="House/Flat, Street"
										/>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
										<div className="space-y-2">
											<Label htmlFor="newAddrCity">City</Label>
											<Input
												id="newAddrCity"
												required
												value={newAddr.city}
												onChange={(e) =>
													setNewAddr((p) => ({ ...p, city: e.target.value }))
												}
												placeholder="City"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="newAddrState">State</Label>
											<Select
												value={newAddr.state}
												onValueChange={(v) =>
													setNewAddr((p) => ({ ...p, state: v }))
												}
												required
											>
												<SelectTrigger id="newAddrState">
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
											<Label htmlFor="newAddrPincode">Pincode</Label>
											<Input
												id="newAddrPincode"
												required
												value={newAddr.pincode}
												onChange={(e) =>
													setNewAddr((p) => ({ ...p, pincode: e.target.value }))
												}
												placeholder="500001"
												pattern="[0-9]{6}"
											/>
										</div>
									</div>
									<div className="flex gap-2">
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
										<Button
											type="button"
											variant="outline"
											onClick={() => {
												setShowAddForm(false);
												setNewAddr(emptyForm());
											}}
										>
											Cancel
										</Button>
									</div>
								</form>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Profile;
