import { Router } from "express";
import { Category } from "../models/category.model";
import { Product } from "../models/product.model";

const router = Router();

// GET all products
router.get("/products", async (_req, res) => {
	const products = await Product.find({ isActive: true })
		.populate("category")
		.lean();

	res.json(products);
});

// GET single product by slug
router.get("/products/:slug", async (req, res) => {
	const product = await Product.findOne({
		slug: req.params.slug,
		isActive: true,
	})
		.populate("category")
		.lean();

	if (!product) return res.status(404).json({ message: "Not found" });

	res.json(product);
});

// GET all categories
router.get("/categories", async (_req, res) => {
	const categories = await Category.find({ isActive: true }).lean();
	res.json(categories);
});

// GET products by category slug
router.get("/categories/:slug/products", async (req, res) => {
	const category = await Category.findOne({
		slug: req.params.slug,
		isActive: true,
	});

	if (!category) return res.status(404).json({ message: "Category not found" });

	const products = await Product.find({
		category: category._id,
		isActive: true,
	})
		.populate("category")
		.lean();

	res.json(products);
});

export default router;
