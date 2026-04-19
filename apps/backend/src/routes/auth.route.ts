import { Router } from "express";
import { type AuthRequest, requireAuth } from "../middleware/auth.middleware";
import { OTP } from "../models/otp.model";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";

const router = Router();

router.get("/users/me", requireAuth, async (req: AuthRequest, res) => {
	const user = await User.findById(req.userId)
		.select("_id mobile name role")
		.lean();

	if (!user) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	res.json(user);
});

router.post("/auth/request-otp", async (req, res) => {
	const { mobile } = req.body;

	if (!mobile) {
		return res.status(400).json({ message: "Mobile required" });
	}

	const otp = Math.floor(100000 + Math.random() * 900000).toString();

	await OTP.deleteMany({ mobile });

	await OTP.create({
		mobile,
		otp,
		expiresAt: new Date(Date.now() + 5 * 60 * 1000),
	});

	console.log(`OTP for ${mobile}: ${otp}`); // Replace with SMS later

	if (process.env.NODE_ENV !== "production") {
		return res.json({ message: "OTP sent", devOtp: otp });
	}

	res.json({ message: "OTP sent" });
});

router.post("/auth/verify-otp", async (req, res) => {
	const { mobile, otp } = req.body;

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
	const isProduction = process.env.NODE_ENV === "production";

	res.cookie("token", token, {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? "none" : "lax",
	});

	res.json({ message: "Login successful", user });
});

export default router;
