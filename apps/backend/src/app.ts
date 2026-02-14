import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import productRoutes from "./routes/product.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", productRoutes);

app.get("/health", (_req, res) => {
	const dbState = mongoose.connection.readyState;

	res.json({
		status: "ok",
		db: dbState === 1 ? "connected" : "not-connected",
	});
});

export default app;
