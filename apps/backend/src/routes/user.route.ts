import { Router } from "express";
import { type AuthRequest, requireAuth } from "../middleware/auth.middleware";
import { User } from "../models/user.model";

const router = Router();

router.patch("/users/profile", requireAuth, async (req: AuthRequest, res) => {
	const { name } = req.body;

	const user = await User.findByIdAndUpdate(
		req.userId,
		{ name },
		{ new: true },
	).lean();

	res.json(user);
});

router.patch("/users/address", requireAuth, async (req: AuthRequest, res) => {
	const { fullName, phone, addressLine, city, state, pincode } = req.body as {
		fullName?: string;
		phone?: string;
		addressLine?: string;
		city?: string;
		state?: string;
		pincode?: string;
	};

	const user = await User.findByIdAndUpdate(
		req.userId,
		{ savedAddress: { fullName, phone, addressLine, city, state, pincode } },
		{ new: true },
	).lean();

	res.json(user);
});

export default router;
