import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
	const secret = process.env.JWT_SECRET || "fallback-secret-key";
	return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};
