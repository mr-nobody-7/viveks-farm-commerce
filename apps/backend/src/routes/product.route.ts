import { Router } from "express";
import { Category } from "../models/category.model";
import { Product } from "../models/product.model";

const router = Router();

// GET all products
router.get("/products", async (_req, res) => {
	try {
		const products = await Product.find({ isActive: true })
			.populate("category")
			.lean();

		res.json(products);
	} catch (error) {
		console.error("Failed to fetch products:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch products",
		});
	}
});

// GET single product by slug
router.get("/products/:slug", async (req, res) => {
	try {
		const product = await Product.findOne({
			slug: req.params.slug,
			isActive: true,
		})
			.populate("category")
			.lean();

		if (!product) return res.status(404).json({ message: "Not found" });

		res.json(product);
	} catch (error) {
		console.error("Failed to fetch product by slug:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch product",
		});
	}
});

// GET all categories
router.get("/categories", async (_req, res) => {
	try {
		const categories = await Category.find({ isActive: true }).lean();
		res.json(categories);
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch categories",
		});
	}
});

// GET products by category slug
router.get("/categories/:slug/products", async (req, res) => {
	try {
		const category = await Category.findOne({
			slug: req.params.slug,
			isActive: true,
		});

		if (!category)
			return res.status(404).json({ message: "Category not found" });

		const products = await Product.find({
			category: category._id,
			isActive: true,
		})
			.populate("category")
			.lean();

		res.json(products);
	} catch (error) {
		console.error("Failed to fetch products by category:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch products for category",
		});
	}
});

export default router;
