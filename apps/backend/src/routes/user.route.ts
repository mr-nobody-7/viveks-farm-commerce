import { Router } from "express";
import { type AuthRequest, requireAuth } from "../middleware/auth.middleware";
import { User } from "../models/user.model";

const router = Router();

router.get("/users/me", requireAuth, async (req: AuthRequest, res) => {
	const user = await User.findById(req.userId).lean();
	res.json(user);
});

router.patch("/users/profile", requireAuth, async (req: AuthRequest, res) => {
	const { name } = req.body;

	const user = await User.findByIdAndUpdate(
		req.userId,
		{ name },
		{ new: true },
	).lean();

	res.json(user);
});

export default router;
