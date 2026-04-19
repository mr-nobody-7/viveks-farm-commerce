import { v2 as cloudinary } from "cloudinary";
import { Router } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import { sendEmail } from "../lib/mailer";
import { requireAdmin } from "../middleware/admin.middleware";
import { Admin } from "../models/admin.model";
import { Category } from "../models/category.model";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";

const router = Router();

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Admin Login
router.post("/admin/login", async (req, res) => {
	const { email, password } = req.body;

	const admin = await Admin.findOne({ email });

	if (!admin) {
		return res.status(400).json({ message: "Invalid credentials" });
	}

	const isMatch = await admin.comparePassword(password);

	if (!isMatch) {
		return res.status(400).json({ message: "Invalid credentials" });
	}

	const token = jwt.sign(
		{ adminId: admin._id },
		process.env.JWT_SECRET || "fallback-secret-key",
		{ expiresIn: "7d" },
	);
	const isProduction = process.env.NODE_ENV === "production";

	res.cookie("adminToken", token, {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? "none" : "lax",
	});

	const loginTime = new Date().toLocaleString("en-IN", {
		dateStyle: "medium",
		timeStyle: "short",
	});

	void sendEmail(
		admin.email,
		"New login to Vivek's Farm Admin",
		`<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
			<h2 style="margin:0 0 12px;">New Admin Login Detected</h2>
			<p style="margin:0 0 8px;">A new login to your Vivek's Farm Admin account was detected.</p>
			<p style="margin:0 0 8px;"><strong>Login time:</strong> ${loginTime}</p>
			<p style="margin:0;">If this wasn't you, please contact support immediately and reset your password.</p>
		</div>`,
	);

	res.json({ message: "Admin login successful" });
});

// Admin Logout
router.post("/admin/logout", (_req, res) => {
	res.clearCookie("adminToken");
	res.json({ message: "Logged out" });
});

// Dashboard Metrics
router.get("/admin/dashboard", requireAdmin, async (_req, res) => {
	const totalOrders = await Order.countDocuments();
	const totalRevenueAgg = await Order.aggregate([
		{ $match: { paymentStatus: "PAID" } },
		{ $group: { _id: null, total: { $sum: "$totalAmount" } } },
	]);

	const totalRevenue = totalRevenueAgg[0]?.total || 0;

	const pendingOrders = await Order.countDocuments({
		status: { $ne: "DELIVERED" },
	});

	res.json({
		totalOrders,
		totalRevenue,
		pendingOrders,
	});
});

// Category CRUD
router.get("/admin/categories", requireAdmin, async (_req, res) => {
	const categories = await Category.find().lean();
	res.json(categories);
});

router.post("/admin/categories", requireAdmin, async (req, res) => {
	const category = await Category.create(req.body);
	res.json(category);
});

router.patch("/admin/categories/:id", requireAdmin, async (req, res) => {
	const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.json(category);
});

router.delete("/admin/categories/:id", requireAdmin, async (req, res) => {
	await Category.findByIdAndUpdate(req.params.id, { isActive: false });
	res.json({ message: "Category disabled" });
});

// Product CRUD
router.get("/admin/products", requireAdmin, async (_req, res) => {
	const products = await Product.find().populate("category").lean();
	res.json(products);
});

router.post("/admin/products", requireAdmin, async (req, res) => {
	const product = await Product.create(req.body);
	res.json(product);
});

router.patch("/admin/products/:id", requireAdmin, async (req, res) => {
	const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.json(product);
});

router.delete("/admin/products/:id", requireAdmin, async (req, res) => {
	await Product.findByIdAndUpdate(req.params.id, { isActive: false });
	res.json({ message: "Product disabled" });
});

// Order Management
router.get("/admin/orders", requireAdmin, async (_req, res) => {
	const orders = await Order.find()
		.populate("user", "mobile name")
		.sort({ createdAt: -1 })
		.lean();

	res.json(orders);
});

router.get("/admin/orders/:id", requireAdmin, async (req, res) => {
	const order = await Order.findById(req.params.id)
		.populate("user", "mobile name")
		.lean();

	if (!order) {
		return res.status(404).json({ message: "Order not found" });
	}

	res.json(order);
});

router.patch("/admin/orders/:id/status", requireAdmin, async (req, res) => {
	const { status } = req.body;

	const allowedStatuses = ["PLACED", "PACKED", "SHIPPED", "DELIVERED"];

	if (!allowedStatuses.includes(status)) {
		return res.status(400).json({ message: "Invalid status" });
	}

	const order = await Order.findByIdAndUpdate(
		req.params.id,
		{ status },
		{ new: true },
	);

	res.json(order);
});

// Image Upload
router.post(
	"/admin/upload",
	requireAdmin,
	upload.single("image"),
	async (req, res) => {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		// Upload to Cloudinary using upload_stream
		const uploadStream = cloudinary.uploader.upload_stream(
			{ folder: "viveks-farm" },
			(error, result) => {
				if (error) {
					return res.status(500).json({ error: error.message });
				}
				res.json({ url: result?.secure_url });
			},
		);

		uploadStream.end(req.file.buffer);
	},
);

export default router;
