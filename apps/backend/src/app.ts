import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  const dbState = mongoose.connection.readyState;

  res.json({
    status: "ok",
    db: dbState === 1 ? "connected" : "not-connected",
  });
});

export default app;
