"use client";

import { Loader2, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { LoginModal } from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { INDIAN_STATES } from "@/lib/constants";
import { type SavedAddress, useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RazorpayWindow extends Window {
	Razorpay: new (
		options: Record<string, unknown>,
	) => {
		open: () => void;
		on: (
			event: string,
			handler: (resp: Record<string, unknown>) => void,
		) => void;
	};
}

type CouponPricing = {
	subtotalAmount: number;
	deliveryCharge: number;
	discountAmount: number;
	totalAmount: number;
	couponCode?: string;
	message?: string;
};

const Checkout = () => {
	const items = useCartStore((state) => state.items);
	const clearCart = useCartStore((state) => state.clearCart);
	const user = useAuthStore((state) => state.user);
	const hasHydrated = useAuthStore((state) => state._hasHydrated);
	const setUser = useAuthStore((state) => state.setUser);
	const subtotal = useMemo(
		() => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
		[items],
	);
	const router = useRouter();
	const razorpayRef = useRef<{
		open: () => void;
		on: (
			event: string,
			handler: (resp: Record<string, unknown>) => void,
		) => void;
	} | null>(null);

	const [payment, setPayment] = useState("ONLINE");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [couponCode, setCouponCode] = useState("");
	const [couponLoading, setCouponLoading] = useState(false);
	const [couponMessage, setCouponMessage] = useState("");
	const [appliedPricing, setAppliedPricing] = useState<CouponPricing | null>(
		null,
	);
	const [allowCOD, setAllowCOD] = useState(false);
	const [selectedState, setSelectedState] = useState("");
	const [deliveryCharge, setDeliveryCharge] = useState(49);
	// Address fields
	const [addrName, setAddrName] = useState("");
	const [addrPhone, setAddrPhone] = useState("");
	const [addrLine, setAddrLine] = useState("");
	const [addrCity, setAddrCity] = useState("");
	const [addrPincode, setAddrPincode] = useState("");

	// Multi-address state
	const [showNewAddrForm, setShowNewAddrForm] = useState(false);
	const [saveAddress, setSaveAddress] = useState(false);
	const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
		null,
	);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const didPrefill = useRef(false);

	const savedAddresses: SavedAddress[] = user?.addresses || [];
	const defaultAddress =
		savedAddresses.find((a) => a.isDefault) || savedAddresses[0];

	useEffect(() => {
		if (!hasHydrated) return;
		if (!user) return;
		if (didPrefill.current) return;
		didPrefill.current = true;
		if (defaultAddress) {
			setAddrName(defaultAddress.fullName || user.name || "");
			setAddrPhone(defaultAddress.phone || user.mobile || "");
			setAddrLine(defaultAddress.addressLine || "");
			setAddrCity(defaultAddress.city || "");
			setSelectedState(defaultAddress.state || "");
			setAddrPincode(defaultAddress.pincode || "");
			setSelectedAddressId(defaultAddress._id);
		} else {
			setAddrName(user.name || "");
			setAddrPhone(user.mobile || "");
		}
	}, [hasHydrated, user, defaultAddress]);

	useEffect(() => {
		if (hasHydrated && !user) {
			setShowLoginModal(true);
		}
	}, [hasHydrated, user]);

	const fillFromAddress = (addr: SavedAddress) => {
		setAddrName(addr.fullName || "");
		setAddrPhone(addr.phone || "");
		setAddrLine(addr.addressLine || "");
		setAddrCity(addr.city || "");
		setSelectedState(addr.state || "");
		setAddrPincode(addr.pincode || "");
		setSelectedAddressId(addr._id);
		setShowNewAddrForm(false);
		toast.success("Address selected");
	};

	const prevItemsRef = useRef(items);

	useEffect(() => {
		if (prevItemsRef.current === items) return;
		prevItemsRef.current = items;
		if (appliedPricing) {
			toast.info("Coupon removed (cart was updated)");
		}
		setAppliedPricing(null);
		setCouponMessage("");
	}, [items, appliedPricing]);

	useEffect(() => {
		const fetchCheckoutSettings = async () => {
			try {
				const response = await fetch(`${API_URL}/api/settings`);
				if (!response.ok) {
					setAllowCOD(false);
					return;
				}

				const data = (await response.json()) as {
					allowCOD?: boolean;
					deliveryCharge?: number;
				};
				setAllowCOD(data.allowCOD === true);
				if (typeof data.deliveryCharge === "number")
					setDeliveryCharge(data.deliveryCharge);
			} catch {
				setAllowCOD(false);
			}
		};

		fetchCheckoutSettings();
	}, []);

	useEffect(() => {
		if (!allowCOD && payment === "COD") {
			setPayment("ONLINE");
		}
	}, [allowCOD, payment]);

	if (!hasHydrated) {
		return null;
	}

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-20 text-center space-y-4 sm:px-6 lg:px-8">
				<h2 className="text-2xl font-bold">Login Required</h2>
				<p className="text-muted-foreground">
					Please enter your mobile number and OTP to continue checkout.
				</p>
				<Button onClick={() => setShowLoginModal(true)}>
					Login to Continue
				</Button>
				<LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="container mx-auto px-4 py-20 text-center space-y-4 sm:px-6 lg:px-8">
				<h2 className="text-2xl font-bold">Nothing to checkout</h2>
				<Button asChild>
					<Link href="/shop">Continue Shopping</Link>
				</Button>
			</div>
		);
	}

	const discountAmount = appliedPricing?.discountAmount || 0;
	const total = subtotal + deliveryCharge - discountAmount;

	const handleApplyCoupon = async () => {
		setError("");
		setCouponMessage("");

		if (!couponCode.trim()) {
			setCouponMessage("Enter a coupon code");
			setAppliedPricing(null);
			return;
		}

		setCouponLoading(true);

		try {
			const response = await fetch(`${API_URL}/api/orders/coupon/validate`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					couponCode,
					items,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				setAppliedPricing(null);
				setCouponMessage(data?.message || "Coupon could not be applied");
				toast.error(data?.message || "Coupon could not be applied");
				return;
			}

			setAppliedPricing(data);
			setCouponCode(data.couponCode || couponCode.toUpperCase());
			toast.success(data.message || "Coupon applied!");
			setCouponMessage("");
		} catch (_err) {
			setAppliedPricing(null);
			setCouponMessage("Failed to apply coupon. Try again.");
			toast.error("Failed to apply coupon. Try again.");
		} finally {
			setCouponLoading(false);
		}
	};

	const handlePlaceOrder = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const address = {
			fullName: addrName,
			phone: addrPhone,
			addressLine: addrLine,
			city: addrCity,
			state: selectedState,
			pincode: addrPincode,
		};

		try {
			// Optionally save new address to account
			if (saveAddress && showNewAddrForm) {
				const saveResp = await fetch(`${API_URL}/api/users/addresses`, {
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						...address,
						isDefault: savedAddresses.length === 0,
					}),
				});
				if (saveResp.ok) {
					const updatedUser = await saveResp.json();
					setUser(updatedUser);
				}
			}

			const response = await fetch(`${API_URL}/api/orders`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					items,
					address,
					paymentMethod: payment,
					couponCode: appliedPricing?.couponCode,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data?.message || "Failed to place order");
			}

			const orderId = data.orderId;

			if (payment === "COD") {
				clearCart();
				router.push(`/order-success/${orderId}`);
				return;
			}

			const paymentResponse = await fetch(
				`${API_URL}/api/payments/create-order`,
				{
					method: "POST",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ orderId }),
				},
			);

			if (!paymentResponse.ok) {
				throw new Error("Failed to create payment");
			}

			const paymentData = await paymentResponse.json();

			const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
			if (!razorpayKeyId) {
				throw new Error("Razorpay key is not configured for frontend");
			}

			const options = {
				key: razorpayKeyId,
				amount: paymentData.amount,
				currency: paymentData.currency,
				order_id: paymentData.razorpayOrderId,
				name: "Vivek's Farm",
				description: "Farm Fresh Products",
				prefill: {
					name: addrName,
					contact: addrPhone || user.mobile,
				},
				method: {
					upi: true,
					card: true,
					netbanking: true,
					wallet: true,
					paylater: true,
					emi: false,
				},
				handler: async (paymentResult: unknown) => {
					try {
						const verifyResponse = await fetch(
							`${API_URL}/api/payments/verify`,
							{
								method: "POST",
								credentials: "include",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify(paymentResult),
							},
						);

						if (!verifyResponse.ok) {
							setError(
								"Payment verification failed. Please contact support with your order ID.",
							);
							setLoading(false);
							return;
						}

						clearCart();
						router.push(`/order-success/${orderId}`);
					} catch (_err) {
						setError("Payment verification failed. Please try again.");
						setLoading(false);
					}
				},
				modal: {
					ondismiss: () => {
						setLoading(false);
					},
				},
			};

			const RazorpayClass = (window as unknown as RazorpayWindow).Razorpay;
			razorpayRef.current = new RazorpayClass(options);
			razorpayRef.current.on(
				"payment.failed",
				(response: Record<string, unknown>) => {
					const errObj = response.error as Record<string, unknown> | undefined;
					setError(
						(errObj?.description as string) ||
							"Payment failed. Please try again.",
					);
					setLoading(false);
				},
			);
			razorpayRef.current.open();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to place order. Please try again.",
			);
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
			<h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

			<form onSubmit={handlePlaceOrder}>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Form */}
					<div className="lg:col-span-2 space-y-6">
						{/* Shipping */}
						<Card>
							<CardContent className="p-6 space-y-4">
								<h3 className="font-semibold text-lg">Shipping Address</h3>

								{/* Saved address selector */}
								{savedAddresses.length > 0 && (
									<div className="space-y-2">
										{savedAddresses.map((addr) => (
											<button
												key={addr._id}
												type="button"
												onClick={() => fillFromAddress(addr)}
												className={`w-full text-left border rounded-lg p-3 transition-colors ${
													selectedAddressId === addr._id && !showNewAddrForm
														? "border-primary bg-primary/5"
														: "border-border hover:border-primary/50"
												}`}
											>
												<div className="flex items-start gap-2">
													<MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
													<div className="flex-1 min-w-0">
														<p className="font-medium text-sm">
															{addr.label || addr.fullName}
															{addr.isDefault && (
																<span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
																	Default
																</span>
															)}
														</p>
														<p className="text-xs text-muted-foreground truncate">
															{addr.addressLine}, {addr.city}, {addr.state} -{" "}
															{addr.pincode}
														</p>
													</div>
												</div>
											</button>
										))}
										<button
											type="button"
											onClick={() => {
												setShowNewAddrForm(true);
												setSelectedAddressId(null);
												setAddrName(user.name || "");
												setAddrPhone(user.mobile || "");
												setAddrLine("");
												setAddrCity("");
												setSelectedState("");
												setAddrPincode("");
											}}
											className={`w-full text-left border border-dashed rounded-lg p-3 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground flex items-center gap-2 ${
												showNewAddrForm
													? "border-primary text-foreground"
													: "border-border"
											}`}
										>
											<Plus className="h-4 w-4" />
											Use a different address
										</button>
									</div>
								)}

								{/* Address fields */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="name">Full Name</Label>
										<Input
											id="name"
											name="name"
											required
											placeholder="Your full name"
											value={addrName}
											onChange={(e) => setAddrName(e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="phone">Phone Number</Label>
										<Input
											id="phone"
											name="phone"
											type="tel"
											required
											placeholder="9876543210"
											pattern="[0-9]{10}"
											value={addrPhone}
											onChange={(e) => setAddrPhone(e.target.value)}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="address">Address</Label>
									<Input
										id="address"
										name="address"
										required
										placeholder="House/Flat, Street"
										value={addrLine}
										onChange={(e) => setAddrLine(e.target.value)}
									/>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									<div className="space-y-2">
										<Label htmlFor="city">City</Label>
										<Input
											id="city"
											name="city"
											required
											placeholder="City"
											value={addrCity}
											onChange={(e) => setAddrCity(e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="state">State</Label>
										<Select
											value={selectedState}
											onValueChange={setSelectedState}
											required
										>
											<SelectTrigger id="state">
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
										<Label htmlFor="pincode">Pincode</Label>
										<Input
											id="pincode"
											name="pincode"
											required
											placeholder="500001"
											pattern="[0-9]{6}"
											value={addrPincode}
											onChange={(e) => setAddrPincode(e.target.value)}
										/>
									</div>
								</div>
								{showNewAddrForm && (
									<label className="flex items-center gap-2 text-sm cursor-pointer">
										<input
											type="checkbox"
											checked={saveAddress}
											onChange={(e) => setSaveAddress(e.target.checked)}
											className="rounded"
										/>
										Save this address to my account
									</label>
								)}
							</CardContent>
						</Card>

						{/* Payment */}
						<Card>
							<CardContent className="p-6 space-y-4">
								<h3 className="font-semibold text-lg">Payment Method</h3>
								<RadioGroup value={payment} onValueChange={setPayment}>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="ONLINE" id="online" />
										<Label htmlFor="online">
											Online Payment (UPI/Card/NetBanking)
										</Label>
									</div>
									{allowCOD && (
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="COD" id="cod" />
											<Label htmlFor="cod">Cash on Delivery</Label>
										</div>
									)}
								</RadioGroup>
							</CardContent>
						</Card>
					</div>

					{/* Order Summary */}
					<Card className="h-fit lg:sticky lg:top-24">
						<CardContent className="p-6 space-y-4">
							<h3 className="font-semibold text-lg">Order Summary</h3>
							<div className="space-y-2">
								<Label htmlFor="coupon">Coupon Code</Label>
								<div className="flex gap-2">
									<Input
										id="coupon"
										value={couponCode}
										onChange={(event) => {
											setCouponCode(event.target.value.toUpperCase());
											setAppliedPricing(null);
											setCouponMessage("");
										}}
										placeholder="Enter coupon"
									/>
									<Button
										type="button"
										variant="outline"
										onClick={handleApplyCoupon}
										disabled={couponLoading || loading}
									>
										{couponLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											"Apply"
										)}
									</Button>
								</div>
								{couponMessage && (
									<p
										className={`text-xs ${
											appliedPricing ? "text-green-600" : "text-destructive"
										}`}
									>
										{couponMessage}
									</p>
								)}
							</div>
							<div className="space-y-2 text-sm">
								{items.map((item) => (
									<div
										key={`${item.productId}-${item.variantLabel}`}
										className="flex justify-between"
									>
										<span className="text-muted-foreground truncate max-w-[70%]">
											{item.name} ({item.variantLabel}) × {item.quantity}
										</span>
										<span>₹{item.price * item.quantity}</span>
									</div>
								))}
							</div>
							<Separator />
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Subtotal</span>
									<span>₹{subtotal}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Delivery</span>
									<span>₹{deliveryCharge}</span>
								</div>
								{discountAmount > 0 && (
									<div className="flex justify-between text-green-600">
										<span>Coupon Discount</span>
										<span>-₹{discountAmount}</span>
									</div>
								)}
							</div>
							<Separator />
							<div className="flex justify-between font-bold text-lg">
								<span>Total</span>
								<span className="text-primary">₹{total}</span>
							</div>
							{error && <p className="text-sm text-destructive">{error}</p>}
							<Button
								type="submit"
								className="w-full"
								size="lg"
								disabled={loading}
							>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Placing Order...
									</>
								) : (
									"Place Order"
								)}
							</Button>
						</CardContent>
					</Card>
				</div>
			</form>
		</div>
	);
};

export default Checkout;
