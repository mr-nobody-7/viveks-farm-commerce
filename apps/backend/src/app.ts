import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route";
import orderRoutes from "./routes/order.route";
import paymentRoutes from "./routes/payment.route";
import productRoutes from "./routes/product.route";

const app = express();

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	}),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", productRoutes);
app.use("/api", authRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);

app.get("/health", (_req, res) => {
	const dbState = mongoose.connection.readyState;

	res.json({
		status: "ok",
		db: dbState === 1 ? "connected" : "not-connected",
	});
});

export default app;
