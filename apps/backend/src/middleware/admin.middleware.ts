import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AdminRequest extends Request {
	adminId?: string;
}

export const requireAdmin = (
	req: AdminRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.cookies.adminToken;

	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	try {
		const secret = process.env.JWT_SECRET || "fallback-secret-key";
		const decoded = jwt.verify(token, secret) as {
			adminId: string;
		};

		req.adminId = decoded.adminId;
		next();
	} catch {
		return res.status(401).json({ message: "Invalid token" });
	}
};
