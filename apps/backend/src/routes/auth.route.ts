import { Router } from "express";
import { z } from "zod";
import { type AuthRequest, requireAuth } from "../middleware/auth.middleware";
import { OTP } from "../models/otp.model";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";

const router = Router();

const requestOtpSchema = z.object({
	mobile: z.string().regex(/^\d{10}$/, "Mobile must be a 10-digit number"),
});

const verifyOtpSchema = z.object({
	mobile: z.string().regex(/^\d{10}$/, "Mobile must be a 10-digit number"),
	otp: z.string().length(6, "OTP must be 6 digits"),
});

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
	httpOnly: true,
	secure: isProduction,
	sameSite: isProduction ? ("none" as const) : ("lax" as const),
	maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.get("/users/me", requireAuth, async (req: AuthRequest, res) => {
	const user = await User.findById(req.userId)
		.select("_id mobile name role addresses")
		.lean();

	if (!user) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	res.json(user);
});

router.post("/auth/request-otp", async (req, res) => {
	const result = requestOtpSchema.safeParse(req.body);
	if (!result.success) {
		return res
			.status(400)
			.json({ message: result.error.issues[0]?.message ?? "Invalid input" });
	}

	const { mobile } = result.data;

	const otp = Math.floor(100000 + Math.random() * 900000).toString();

	await OTP.deleteMany({ mobile });

	await OTP.create({
		mobile,
		otp,
		expiresAt: new Date(Date.now() + 5 * 60 * 1000),
	});

	console.log(`OTP for ${mobile}: ${otp}`);

	res.json({
		message: "OTP sent",
		...(process.env.NODE_ENV !== "production" && { devOtp: otp }),
	});
});

router.post("/auth/verify-otp", async (req, res) => {
	const result = verifyOtpSchema.safeParse(req.body);
	if (!result.success) {
		return res
			.status(400)
			.json({ message: result.error.issues[0]?.message ?? "Invalid input" });
	}
	const { mobile, otp } = result.data;

	const existing = await OTP.findOne({ mobile });

	if (!existing || existing.otp !== otp || existing.expiresAt < new Date()) {
		return res.status(400).json({ message: "Invalid OTP" });
	}

	await OTP.deleteMany({ mobile });

	let user = await User.findOne({ mobile });

	if (!user) {
		user = await User.create({ mobile });
	}

	const token = generateToken(user._id.toString());

	res.cookie("token", token, cookieOptions);

	res.json({ message: "Login successful", user });
});

router.post("/auth/logout", (_req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? "none" : "lax",
	});

	res.json({ message: "Logged out" });
});

export default router;
