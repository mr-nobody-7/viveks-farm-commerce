import { Router } from "express";
import { OTP } from "../models/otp.model";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";


const router = Router();

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

  res.json({ message: "OTP sent", otp }); // Remove otp from response in production
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

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({ message: "Login successful", user });
});


export default router;