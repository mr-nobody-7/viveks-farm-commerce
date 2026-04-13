"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Loader2 } from "lucide-react";

const DELIVERY_CHARGE = 49;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const ENABLE_COD = process.env.NEXT_PUBLIC_ENABLE_COD === "true";

const Checkout = () => {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  
  // Derive subtotal from items
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const router = useRouter();
  const [payment, setPayment] = useState("ONLINE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login enforcement
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Nothing to checkout</h2>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const total = subtotal + DELIVERY_CHARGE;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const address = {
      fullName: formData.get("name") as string,
      phone: formData.get("phone") as string,
      addressLine: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
    };

    try {
      // Create order with payment method
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address,
          paymentMethod: payment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const data = await response.json();
      const orderId = data.orderId;

      // If COD, just redirect to success page
      if (payment === "COD") {
        clearCart();
        router.push(`/order-success/${orderId}`);
        return;
      }

      // If ONLINE, initiate Razorpay payment
      const paymentResponse = await fetch(`${API_URL}/payments/create-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      if (!paymentResponse.ok) {
        throw new Error("Failed to create payment");
      }

      const paymentData = await paymentResponse.json();

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        order_id: paymentData.razorpayOrderId,
        name: "Vivek's Farm",
        description: "Farm Fresh Products",
        handler: async function (response: any) {
          try {
            await fetch(`${API_URL}/payments/verify`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            clearCart();
            router.push(`/order-success/${orderId}`);
          } catch (err) {
            setError("Payment verification failed");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Shipping Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" required placeholder="Your full name" />
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
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" required placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" required placeholder="State" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      required
                      placeholder="500001"
                      pattern="[0-9]{6}"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Payment Method</h3>
                <RadioGroup value={payment} onValueChange={setPayment}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ONLINE" id="online" />
                    <Label htmlFor="online">Online Payment (UPI/Card/NetBanking)</Label>
                  </div>
                  {ENABLE_COD && (
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
                  <span>₹{DELIVERY_CHARGE}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
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
