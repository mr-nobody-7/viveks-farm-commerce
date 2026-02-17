import { Router } from "express";
import { type AuthRequest, requireAuth } from "../middleware/auth.middleware";
import { Order } from "../models/order.model";

const router = Router();

router.post("/orders", requireAuth, async (req: AuthRequest, res) => {
	const { items, address } = req.body;

	if (!items || items.length === 0) {
		return res.status(400).json({ message: "Cart is empty" });
	}

	const totalAmount = items.reduce(
		(sum: number, item: { price: number; quantity: number }) =>
			sum + item.price * item.quantity,
		0,
	);

	const order = await Order.create({
		user: req.userId,
		items,
		totalAmount,
		address,
		status: "PLACED",
	});

	res.status(201).json({
		message: "Order created",
		orderId: order._id,
	});
});

export default router;
