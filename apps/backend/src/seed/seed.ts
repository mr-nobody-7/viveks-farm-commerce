import "dotenv/config";
import { connectToDatabase } from "../db/connect";
import { Category } from "../models/category.model";
import { Product } from "../models/product.model";

const seed = async () => {
	await connectToDatabase();

	await Category.deleteMany({});
	await Product.deleteMany({});

	const pickles = await Category.create({
		name: "Pickles",
		slug: "pickles",
	});

	const sweets = await Category.create({
		name: "Sweets",
		slug: "sweets",
	});

	await Product.create([
		{
			name: "Mango Pickle",
			slug: "mango-pickle",
			description: "Traditional homemade mango pickle.",
			category: pickles._id,
			images: ["/images/mango-pickle.jpg"],
			variants: [
				{ label: "250g", price: 120, originalPrice: 150 },
				{ label: "500g", price: 220, originalPrice: 260 },
			],
		},
		{
			name: "Besan Laddu",
			slug: "besan-laddu",
			description: "Authentic desi ghee laddu.",
			category: sweets._id,
			images: ["/images/besan-laddu.jpg"],
			variants: [
				{ label: "250g", price: 150, originalPrice: 180 },
				{ label: "500g", price: 280, originalPrice: 320 },
			],
		},
	]);

	console.log("Seeding completed");
	process.exit(0);
};

seed();
