import { Router } from "express";
import { getOrCreateAppConfig } from "../models/app-config.model";

const router = Router();

router.get("/settings", async (_req, res) => {
	const config = await getOrCreateAppConfig();

	res.json({
		allowCOD: config.allowCOD,
	});
});

export default router;
