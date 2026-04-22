import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import adminRoutes from "./routes/admin.route";
import authRoutes from "./routes/auth.route";
import contactRoutes from "./routes/contact.route";
import orderRoutes from "./routes/order.route";
import paymentRoutes from "./routes/payment.route";
import productRoutes from "./routes/product.route";
import settingsRoutes from "./routes/settings.route";
import userRoutes from "./routes/user.route";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

const otpRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: {
		message: "Too many OTP requests, please try again after 15 minutes.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

const contactRateLimit = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 3,
	message: {
		message:
			"Too many contact form submissions, please try again after 1 hour.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(
	cors({
		origin: corsOrigin,
		credentials: true,
	}),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth/request-otp", otpRateLimit);
app.use("/api/contact", contactRateLimit);
app.use("/api", productRoutes);
app.use("/api", settingsRoutes);
app.use("/api", authRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api/contact", contactRoutes);

app.get("/health", (_req, res) => {
	const dbState = mongoose.connection.readyState;

	res.json({
		status: "ok",
		db: dbState === 1 ? "connected" : "not-connected",
	});
});

app.use(
	(
		error: unknown,
		_req: express.Request,
		res: express.Response,
		_next: express.NextFunction,
	) => {
		console.error(error);

		const message =
			error instanceof Error ? error.message : "Internal server error";

		res.status(500).json({
			success: false,
			message,
		});
	},
);

export default app;
