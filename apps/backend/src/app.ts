import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import adminRoutes from "./routes/admin.route";
import authRoutes from "./routes/auth.route";
import contactRoutes from "./routes/contact.route";
import orderRoutes from "./routes/order.route";
import paymentRoutes from "./routes/payment.route";
import productRoutes from "./routes/product.route";
import userRoutes from "./routes/user.route";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(
	cors({
		origin: corsOrigin,
		credentials: true,
	}),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", productRoutes);
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

export default app;
