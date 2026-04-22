"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ArrowLeft, CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type OrderStatus = "PENDING" | "PLACED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
productId: string;
name: string;
image: string;
variantLabel: string;
price: number;
quantity: number;
}

interface Address {
fullName: string;
phone: string;
addressLine: string;
city: string;
state: string;
pincode: string;
}

interface Order {
_id: string;
items: OrderItem[];
subtotalAmount: number;
deliveryCharge: number;
discountAmount: number;
couponCode?: string;
totalAmount: number;
address: Address;
status: OrderStatus;
paymentStatus: "PENDING" | "PAID" | "FAILED";
paymentMethod: "ONLINE" | "COD";
createdAt: string;
}

interface OrderDetailProps {
params: Promise<{ id: string }>;
}

const STATUS_STEPS = ["PLACED", "PACKED", "SHIPPED", "DELIVERED"] as const;

const statusColors: Record<OrderStatus, string> = {
PLACED: "bg-blue-500",
PACKED: "bg-orange-500",
SHIPPED: "bg-purple-500",
DELIVERED: "bg-green-500",
PENDING: "bg-gray-500",
CANCELLED: "bg-red-500",
};

const paymentStatusColors = {
PENDING: "bg-yellow-500",
PAID: "bg-green-500",
FAILED: "bg-red-500",
};

export default function OrderDetail({ params }: OrderDetailProps) {
const { id } = use(params);
const user = useAuthStore((state) => state.user);
const router = useRouter();
const [order, setOrder] = useState<Order | null>(null);
const [loading, setLoading] = useState(true);
const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
const [cancelLoading, setCancelLoading] = useState(false);

useEffect(() => {
if (!user) {
router.push("/");
return;
}

const fetchOrder = async () => {
try {
const response = await fetch(`${API_URL}/api/orders/${id}`, {
credentials: "include",
cache: "no-store",
});

if (!response.ok) throw new Error("Failed to fetch order");

const data = await response.json();
setOrder(data);
} catch (err) {
console.error("Failed to load order", err);
} finally {
setLoading(false);
}
};

fetchOrder();
}, [id, user, router]);

const handleCancel = async () => {
if (!order) return;
setCancelLoading(true);
try {
const response = await fetch(`${API_URL}/api/orders/${order._id}/cancel`, {
method: "PATCH",
credentials: "include",
});
const data = await response.json();
if (!response.ok) {
toast.error(data?.message || "Failed to cancel order");
return;
}
setOrder((prev) => (prev ? { ...prev, status: "CANCELLED" } : prev));
toast.success("Order cancelled successfully");
setCancelDialogOpen(false);
} catch {
toast.error("Failed to cancel order. Try again.");
} finally {
setCancelLoading(false);
}
};

if (loading) {
return (
<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl space-y-6">
<div className="h-8 bg-gray-200 rounded w-40 animate-pulse" />
{[1, 2, 3].map((i) => (
<div key={i} className="h-36 bg-gray-200 rounded-lg animate-pulse" />
))}
</div>
);
}

if (!order) {
return (
<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
<h2 className="text-2xl font-bold">Order not found</h2>
<Button asChild>
<Link href="/profile/orders">Back to Orders</Link>
</Button>
</div>
);
}

const currentStepIndex = STATUS_STEPS.indexOf(
order.status as (typeof STATUS_STEPS)[number],
);

return (
<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
<Button variant="ghost" className="mb-4" asChild>
<Link href="/profile/orders">
<ArrowLeft className="h-4 w-4 mr-2" />
Back to Orders
</Link>
</Button>

<div className="space-y-6">
{/* Order Header */}
<Card>
<CardHeader>
<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
<div>
<CardTitle>Order #{order._id.slice(-8).toUpperCase()}</CardTitle>
<p className="text-sm text-muted-foreground mt-1">
Placed on{" "}
{new Date(order.createdAt).toLocaleDateString("en-IN", {
day: "numeric",
month: "long",
year: "numeric",
})}
</p>
</div>
<div className="flex flex-wrap items-center gap-2">
<Badge className={`${statusColors[order.status]} text-white`}>
{order.status}
</Badge>
<Badge
className={`${paymentStatusColors[order.paymentStatus]} text-white`}
>
Payment: {order.paymentStatus}
</Badge>
<Badge variant="outline">{order.paymentMethod}</Badge>
{order.status === "PLACED" && (
<Button
variant="destructive"
size="sm"
onClick={() => setCancelDialogOpen(true)}
>
Cancel Order
</Button>
)}
</div>
</div>
</CardHeader>
</Card>

{/* Status Timeline */}
{order.status !== "CANCELLED" && order.status !== "PENDING" && (
<Card>
<CardContent className="p-6">
<div className="flex items-center">
{STATUS_STEPS.map((step, i) => {
const done = i <= currentStepIndex;
const active = i === currentStepIndex;
return (
<div key={step} className="flex flex-1 items-center">
<div className="flex flex-col items-center gap-1 shrink-0">
{done ? (
<CheckCircle2
className={`h-7 w-7 ${active ? "text-primary" : "text-green-500"}`}
/>
) : (
<Circle className="h-7 w-7 text-muted-foreground/30" />
)}
<span
className={`text-xs text-center font-medium leading-tight max-w-14 ${done ? "text-foreground" : "text-muted-foreground"}`}
>
{step}
</span>
</div>
{i < STATUS_STEPS.length - 1 && (
<div
className={`flex-1 h-0.5 mx-1 mb-5 ${i < currentStepIndex ? "bg-green-500" : "bg-muted"}`}
/>
)}
</div>
);
})}
</div>
</CardContent>
</Card>
)}

{order.status === "CANCELLED" && (
<Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
<CardContent className="p-4 flex items-center gap-3">
<XCircle className="h-5 w-5 text-red-500 shrink-0" />
<p className="text-red-700 dark:text-red-400 font-medium">
This order has been cancelled.
</p>
</CardContent>
</Card>
)}

{/* Order Items + Pricing */}
<Card>
<CardHeader>
<CardTitle>Items</CardTitle>
</CardHeader>
<CardContent>
<div className="space-y-4">
{order.items.map((item, index) => (
<div key={`${item.productId}-${item.variantLabel}`}>
<div className="flex gap-4">
<img
src={item.image || "/placeholder.svg"}
alt={item.name}
className="h-20 w-20 rounded-lg object-cover bg-muted shrink-0"
onError={(e) => {
(e.target as HTMLImageElement).src = "/placeholder.svg";
}}
/>
<div className="flex-1 min-w-0">
<h3 className="font-semibold">{item.name}</h3>
<p className="text-sm text-muted-foreground">
{item.variantLabel}
</p>
<div className="flex items-center justify-between mt-2">
<span className="text-sm text-muted-foreground">
Qty: {item.quantity}
</span>
<span className="font-semibold">
₹{item.price * item.quantity}
</span>
</div>
</div>
</div>
{index < order.items.length - 1 && (
<Separator className="mt-4" />
)}
</div>
))}
</div>

<Separator className="my-4" />

<div className="space-y-2 text-sm">
<div className="flex justify-between">
<span className="text-muted-foreground">Subtotal</span>
<span>₹{order.subtotalAmount}</span>
</div>
<div className="flex justify-between">
<span className="text-muted-foreground">Delivery</span>
<span>₹{order.deliveryCharge}</span>
</div>
{order.discountAmount > 0 && (
<div className="flex justify-between text-green-600">
<span>
Coupon
{order.couponCode ? ` (${order.couponCode})` : " Discount"}
</span>
<span>-₹{order.discountAmount}</span>
</div>
)}
</div>

<Separator className="my-4" />

<div className="flex justify-between items-center text-lg font-bold">
<span>Total</span>
<span className="text-primary">₹{order.totalAmount}</span>
</div>
</CardContent>
</Card>

{/* Shipping Address */}
<Card>
<CardHeader>
<CardTitle>Shipping Address</CardTitle>
</CardHeader>
<CardContent>
<div className="space-y-1 text-sm">
<p className="font-semibold">{order.address.fullName}</p>
<p>{order.address.addressLine}</p>
<p>
{order.address.city}, {order.address.state} -{" "}
{order.address.pincode}
</p>
<p className="text-muted-foreground">
Phone: {order.address.phone}
</p>
</div>
</CardContent>
</Card>
</div>

{/* Cancel Confirmation Dialog */}
<Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
<DialogContent>
<DialogHeader>
<DialogTitle>Cancel this order?</DialogTitle>
<DialogDescription>
This action cannot be undone. Your order will be permanently
cancelled.
</DialogDescription>
</DialogHeader>
<DialogFooter>
<Button
variant="outline"
onClick={() => setCancelDialogOpen(false)}
disabled={cancelLoading}
>
Keep Order
</Button>
<Button
variant="destructive"
onClick={handleCancel}
disabled={cancelLoading}
>
{cancelLoading ? (
<Loader2 className="h-4 w-4 animate-spin" />
) : (
"Yes, Cancel Order"
)}
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
</div>
);
}
