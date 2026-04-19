import { Router } from "express";
import { type AuthRequest, requireAuth } from "../middleware/auth.middleware";
import { Coupon, type ICoupon } from "../models/coupon.model";
import { Order } from "../models/order.model";

const router = Router();
const DELIVERY_CHARGE = Number(process.env.DELIVERY_CHARGE || 49);

type OrderItemInput = {
	productId: string;
	price: number;
	quantity: number;
};

type PricingResult = {
	subtotalAmount: number;
	deliveryCharge: number;
	discountAmount: number;
	totalAmount: number;
	couponCode?: string;
	message?: string;
};

const roundCurrency = (value: number) => Number(value.toFixed(2));

const evaluateCouponDiscount = (
	coupon: ICoupon,
	items: OrderItemInput[],
	subtotalAmount: number,
) => {
	if (!coupon.isActive) {
		throw new Error("Coupon is inactive");
	}

	if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
		throw new Error("Coupon has expired");
	}

	if (
		typeof coupon.usageLimit === "number" &&
		coupon.usedCount >= coupon.usageLimit
	) {
		throw new Error("Coupon usage limit reached");
	}

	if (
		typeof coupon.minOrderAmount === "number" &&
		subtotalAmount < coupon.minOrderAmount
	) {
		throw new Error(
			`Minimum order amount for this coupon is Rs.${coupon.minOrderAmount}`,
		);
	}

	const applicableProductIds = new Set(
		coupon.applicableProducts.map((id) => id.toString()),
	);

	const eligibleSubtotal =
		applicableProductIds.size === 0
			? subtotalAmount
			: items.reduce((sum, item) => {
					if (!applicableProductIds.has(item.productId.toString())) {
						return sum;
					}

					return sum + item.price * item.quantity;
				}, 0);

	if (eligibleSubtotal <= 0) {
		throw new Error("Coupon is not applicable to items in your cart");
	}

	let discountAmount =
		coupon.discountType === "PERCENTAGE"
			? (eligibleSubtotal * coupon.discountValue) / 100
			: coupon.discountValue;

	if (typeof coupon.maxDiscountAmount === "number") {
		discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
	}

	discountAmount = Math.min(discountAmount, eligibleSubtotal);

	if (discountAmount <= 0) {
		throw new Error("Coupon discount is not valid for this order");
	}

	return roundCurrency(discountAmount);
};

const calculateOrderPricing = async (
	items: OrderItemInput[],
	couponCode?: string,
): Promise<PricingResult> => {
	const subtotalAmount = roundCurrency(
		items.reduce((sum, item) => sum + item.price * item.quantity, 0),
	);

	if (subtotalAmount <= 0) {
		throw new Error("Cart total must be greater than zero");
	}

	if (!couponCode?.trim()) {
		return {
			subtotalAmount,
			deliveryCharge: DELIVERY_CHARGE,
			discountAmount: 0,
			totalAmount: roundCurrency(subtotalAmount + DELIVERY_CHARGE),
		};
	}

	const normalizedCouponCode = couponCode.trim().toUpperCase();
	const coupon = await Coupon.findOne({ code: normalizedCouponCode });

	if (!coupon) {
		throw new Error("Invalid coupon code");
	}

	const discountAmount = evaluateCouponDiscount(coupon, items, subtotalAmount);

	return {
		subtotalAmount,
		deliveryCharge: DELIVERY_CHARGE,
		discountAmount,
		totalAmount: roundCurrency(
			subtotalAmount + DELIVERY_CHARGE - discountAmount,
		),
		couponCode: normalizedCouponCode,
		message: `Coupon ${normalizedCouponCode} applied successfully`,
	};
};

router.get("/orders/user", requireAuth, async (req: AuthRequest, res) => {
	const orders = await Order.find({ user: req.userId })
		.sort({ createdAt: -1 })
		.lean();

	res.json(orders);
});

router.get("/orders/:id", requireAuth, async (req: AuthRequest, res) => {
	const order = await Order.findOne({
		_id: req.params.id,
		user: req.userId,
	}).lean();

	if (!order) {
		return res.status(404).json({ message: "Order not found" });
	}

	res.json(order);
});

router.post("/orders/coupon/validate", requireAuth, async (req, res) => {
	const { couponCode, items } = req.body as {
		couponCode?: string;
		items?: OrderItemInput[];
	};

	if (!couponCode?.trim()) {
		return res.status(400).json({ message: "Coupon code is required" });
	}

	if (!items?.length) {
		return res.status(400).json({ message: "Cart is empty" });
	}

	try {
		const pricing = await calculateOrderPricing(items, couponCode);
		return res.json(pricing);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Invalid coupon";
		return res.status(400).json({ message });
	}
});

router.post("/orders", requireAuth, async (req: AuthRequest, res) => {
	const { items, address, paymentMethod, couponCode } = req.body as {
		items: OrderItemInput[];
		address: Record<string, string>;
		paymentMethod: "ONLINE" | "COD";
		couponCode?: string;
	};

	if (!items || items.length === 0) {
		return res.status(400).json({ message: "Cart is empty" });
	}

	const enableCOD = process.env.ENABLE_COD === "true";

	if (paymentMethod === "COD" && !enableCOD) {
		return res.status(400).json({ message: "COD not allowed" });
	}

	let pricing: PricingResult;
	let appliedCouponCode: string | undefined;

	try {
		pricing = await calculateOrderPricing(items, couponCode);
		appliedCouponCode = pricing.couponCode;
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to apply coupon";
		return res.status(400).json({ message });
	}

	let couponUsageReserved = false;

	if (appliedCouponCode) {
		const usageQuery: {
			code: string;
			isActive: boolean;
			expiresAt?: { $gt: Date };
			usedCount?: { $lt: number };
		} = {
			code: appliedCouponCode,
			isActive: true,
		};

		const currentCoupon = await Coupon.findOne({
			code: appliedCouponCode,
		}).lean();

		if (!currentCoupon) {
			return res.status(400).json({ message: "Invalid coupon code" });
		}

		if (currentCoupon.expiresAt) {
			usageQuery.expiresAt = { $gt: new Date() };
		}

		if (typeof currentCoupon.usageLimit === "number") {
			usageQuery.usedCount = { $lt: currentCoupon.usageLimit };
		}

		const coupon = await Coupon.findOneAndUpdate(
			usageQuery,
			{ $inc: { usedCount: 1 } },
			{ new: true },
		);

		if (!coupon) {
			return res.status(409).json({
				message: "Coupon usage limit reached or coupon is no longer valid",
			});
		}

		couponUsageReserved = true;
	}

	try {
		const order = await Order.create({
			user: req.userId,
			items,
			subtotalAmount: pricing.subtotalAmount,
			deliveryCharge: pricing.deliveryCharge,
			discountAmount: pricing.discountAmount,
			couponCode: appliedCouponCode,
			totalAmount: pricing.totalAmount,
			address,
			paymentMethod,
			paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
			status: paymentMethod === "COD" ? "PLACED" : "PENDING",
		});

		return res.status(201).json({
			message: "Order created",
			orderId: order._id,
			pricing,
		});
	} catch (error) {
		if (couponUsageReserved && appliedCouponCode) {
			await Coupon.findOneAndUpdate(
				{ code: appliedCouponCode, usedCount: { $gt: 0 } },
				{ $inc: { usedCount: -1 } },
			);
		}

		const message =
			error instanceof Error ? error.message : "Failed to create order";
		return res.status(500).json({ message });
	}
});

export default router;
