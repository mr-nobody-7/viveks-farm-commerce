import crypto from "node:crypto";
import { Router } from "express";
import Razorpay from "razorpay";
import { type AuthRequest, requireAuth } from "../middleware/auth.middleware";
import { Order } from "../models/order.model";

const router = Router();

const getRazorpayClient = () => {
	const keyId = process.env.RAZORPAY_KEY_ID;
	const keySecret = process.env.RAZORPAY_KEY_SECRET;

	if (!keyId || !keySecret) {
		return null;
	}

	return new Razorpay({
		key_id: keyId,
		key_secret: keySecret,
	});
};

router.post(
	"/payments/create-order",
	requireAuth,
	async (req: AuthRequest, res) => {
		const razorpay = getRazorpayClient();

		if (!razorpay) {
			return res.status(503).json({
				message: "Payment gateway is not configured",
			});
		}

		const { orderId } = req.body;

		const order = await Order.findById(orderId);

		if (!order) return res.status(404).json({ message: "Order not found" });

		let razorpayOrder: {
			id: string;
			amount: number | string;
			currency: string;
		};
		try {
			razorpayOrder = await razorpay.orders.create({
				amount: order.totalAmount * 100, // convert to paisa
				currency: "INR",
				receipt: order._id.toString(),
			});
		} catch (error) {
			console.error("Failed to create Razorpay order:", error);
			return res.status(502).json({ message: "Failed to initiate payment" });
		}

		order.razorpayOrderId = razorpayOrder.id;
		await order.save();

		res.json({
			key: process.env.RAZORPAY_KEY_ID,
			razorpayOrderId: razorpayOrder.id,
			amount: razorpayOrder.amount,
			currency: razorpayOrder.currency,
		});
	},
);

router.post("/payments/verify", requireAuth, async (req: AuthRequest, res) => {
	if (!process.env.RAZORPAY_KEY_SECRET) {
		return res.status(503).json({
			message: "Payment gateway is not configured",
		});
	}

	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
		req.body;

	const body = `${razorpay_order_id}|${razorpay_payment_id}`;

	const expectedSignature = crypto
		.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
		.update(body.toString())
		.digest("hex");

	if (expectedSignature !== razorpay_signature) {
		return res.status(400).json({ message: "Invalid signature" });
	}

	const order = await Order.findOne({
		razorpayOrderId: razorpay_order_id,
	});

	if (!order) {
		return res.status(404).json({ message: "Order not found" });
	}

	order.paymentStatus = "PAID";
	order.razorpayPaymentId = razorpay_payment_id;
	order.status = "PLACED";

	await order.save();

	res.json({ message: "Payment verified" });
});

export default router;
