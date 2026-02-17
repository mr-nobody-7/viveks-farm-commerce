import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
	userId?: string;
}

export const requireAuth = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const secret = process.env.JWT_SECRET || "fallback-secret-key";
		const decoded = jwt.verify(token, secret) as {
			userId: string;
		};

		req.userId = decoded.userId;
		next();
	} catch {
		return res.status(401).json({ message: "Invalid token" });
	}
};
