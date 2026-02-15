import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import productRoutes from "./routes/product.route";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";



const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api", productRoutes);
app.use("/api", authRoutes);

app.get("/health", (_req, res) => {
	const dbState = mongoose.connection.readyState;

	res.json({
		status: "ok",
		db: dbState === 1 ? "connected" : "not-connected",
	});
});

export default app;
