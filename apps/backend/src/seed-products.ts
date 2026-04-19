import "dotenv/config";
import mongoose from "mongoose";
import { Category } from "./models/category.model";
import { Product } from "./models/product.model";

const MONGODB_URI = process.env.MONGODB_URI;
const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=Product+Image";

const categories = [
	{ name: "Ghee", slug: "ghee" },
	{ name: "Pickles", slug: "pickles" },
	{ name: "Sweets", slug: "sweets" },
	{ name: "Honey", slug: "honey" },
] as const;

const productsByCategory = {
	ghee: [
		{
			name: "Pure Desi Cow Ghee",
			slug: "pure-desi-cow-ghee",
			description: "Traditional cow ghee made using farm-fresh milk.",
			variants: [
				{ label: "250g", price: 299 },
				{ label: "500g", price: 549 },
				{ label: "1kg", price: 999 },
			],
		},
		{
			name: "Buffalo Ghee",
			slug: "buffalo-ghee",
			description: "Rich and aromatic buffalo ghee for daily cooking.",
			variants: [
				{ label: "500g", price: 449 },
				{ label: "1kg", price: 849 },
			],
		},
		{
			name: "Bilona Ghee",
			slug: "bilona-ghee",
			description: "Hand-churned bilona ghee made in small batches.",
			variants: [
				{ label: "250g", price: 499 },
				{ label: "500g", price: 899 },
			],
		},
	],
	pickles: [
		{
			name: "Mango Pickle",
			slug: "mango-pickle",
			description: "Classic spicy mango pickle with authentic farm flavors.",
			variants: [
				{ label: "250g", price: 149 },
				{ label: "500g", price: 269 },
			],
		},
		{
			name: "Lemon Pickle",
			slug: "lemon-pickle",
			description: "Tangy lemon pickle prepared with traditional spices.",
			variants: [
				{ label: "250g", price: 129 },
				{ label: "500g", price: 239 },
			],
		},
		{
			name: "Mixed Vegetable Pickle",
			slug: "mixed-vegetable-pickle",
			description: "A vibrant blend of seasonal vegetables in aromatic masala.",
			variants: [
				{ label: "500g", price: 199 },
				{ label: "1kg", price: 369 },
			],
		},
	],
	sweets: [
		{
			name: "Besan Ladoo",
			slug: "besan-ladoo",
			description: "Homemade besan ladoos prepared in pure ghee.",
			variants: [
				{ label: "250g", price: 199 },
				{ label: "500g", price: 379 },
			],
		},
		{
			name: "Coconut Barfi",
			slug: "coconut-barfi",
			description: "Soft coconut barfi with rich, traditional sweetness.",
			variants: [
				{ label: "250g", price: 219 },
				{ label: "500g", price: 409 },
			],
		},
		{
			name: "Dry Fruit Ladoo",
			slug: "dry-fruit-ladoo",
			description:
				"Nutritious dry fruit ladoos packed with premium ingredients.",
			variants: [
				{ label: "250g", price: 349 },
				{ label: "500g", price: 649 },
			],
		},
	],
	honey: [
		{
			name: "Wild Forest Honey",
			slug: "wild-forest-honey",
			description: "Raw wild forest honey with natural floral aroma.",
			variants: [
				{ label: "250g", price: 299 },
				{ label: "500g", price: 549 },
			],
		},
		{
			name: "Tulsi Honey",
			slug: "tulsi-honey",
			description:
				"Tulsi-infused honey known for soothing flavor and wellness.",
			variants: [
				{ label: "250g", price: 249 },
				{ label: "500g", price: 459 },
			],
		},
		{
			name: "Multifloral Honey",
			slug: "multifloral-honey",
			description: "Pure multifloral honey collected from diverse blossoms.",
			variants: [
				{ label: "250g", price: 199 },
				{ label: "500g", price: 369 },
			],
		},
	],
} as const;

const seedProducts = async () => {
	if (!MONGODB_URI) {
		console.error("MONGODB_URI is not set");
		process.exit(1);
	}

	try {
		await mongoose.connect(MONGODB_URI);

		const categoryMap = new Map<string, string>();

		for (const categoryData of categories) {
			let category = await Category.findOne({ slug: categoryData.slug });

			if (!category) {
				category = await Category.create(categoryData);
			}

			categoryMap.set(categoryData.slug, category._id.toString());
		}

		for (const category of categories) {
			const categoryId = categoryMap.get(category.slug);
			if (!categoryId) continue;

			for (const productData of productsByCategory[category.slug]) {
				const existingProduct = await Product.findOne({
					slug: productData.slug,
				}).lean();
				if (existingProduct) {
					continue;
				}

				await Product.create({
					name: productData.name,
					slug: productData.slug,
					description: productData.description,
					category: categoryId,
					images: [PLACEHOLDER_IMAGE],
					variants: productData.variants,
				});
			}
		}

		console.log("Products seed completed");
	} catch (error) {
		console.error("Failed to seed products:", error);
		process.exitCode = 1;
	} finally {
		await mongoose.disconnect();
	}
};

void seedProducts();
