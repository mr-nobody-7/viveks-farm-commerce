import "dotenv/config";
import { connectToDatabase } from "../db/connect";
import { AppConfig } from "../models/app-config.model";
import { Category } from "../models/category.model";
import { Coupon } from "../models/coupon.model";
import { Order } from "../models/order.model";
import { OTP } from "../models/otp.model";
import { Product } from "../models/product.model";
import { User } from "../models/user.model";

type SeedCategory = {
	name: string;
	slug: string;
	description: string;
	isActive: boolean;
};

type SeedProduct = {
	name: string;
	slug: string;
	description: string;
	categorySlug: string;
	images: string[];
	variants: Array<{
		label: string;
		price: number;
		originalPrice?: number;
		isActive: boolean;
	}>;
	isActive: boolean;
};

const categories: SeedCategory[] = [
	{
		name: "Ghee",
		slug: "ghee",
		description: "Traditional bilona and cultured ghee made in small batches.",
		isActive: true,
	},
	{
		name: "Pickles",
		slug: "pickles",
		description: "Sun-cured homemade pickles with farm-fresh ingredients.",
		isActive: true,
	},
	{
		name: "Honey",
		slug: "honey",
		description: "Raw and unprocessed honey sourced directly from apiaries.",
		isActive: true,
	},
	{
		name: "Sweets",
		slug: "sweets",
		description: "Handcrafted traditional sweets made with pure ingredients.",
		isActive: true,
	},
	{
		name: "Cold-Pressed Oils",
		slug: "cold-pressed-oils",
		description: "Wood-pressed oils preserving natural aroma and nutrients.",
		isActive: true,
	},
	{
		name: "Spices",
		slug: "spices",
		description: "Freshly ground spice blends with authentic farm flavor.",
		isActive: true,
	},
	{
		name: "Flours",
		slug: "flours",
		description: "Stone-ground flours for wholesome everyday cooking.",
		isActive: true,
	},
	{
		name: "Millets",
		slug: "millets",
		description: "Nutrient-rich millet staples for healthy meals.",
		isActive: true,
	},
];

const products: SeedProduct[] = [
	{
		name: "A2 Bilona Cow Ghee",
		slug: "a2-bilona-cow-ghee",
		description:
			"A2 bilona ghee prepared from cultured curd using traditional methods.",
		categorySlug: "ghee",
		images: [],
		variants: [
			{ label: "250 ml", price: 460, originalPrice: 520, isActive: true },
			{ label: "500 ml", price: 890, originalPrice: 980, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Desi Cow Ghee",
		slug: "desi-cow-ghee",
		description: "Slow-cooked ghee with rich aroma and granular texture.",
		categorySlug: "ghee",
		images: [],
		variants: [
			{ label: "500 ml", price: 760, originalPrice: 820, isActive: true },
			{ label: "1 L", price: 1450, originalPrice: 1580, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Buffalo Ghee",
		slug: "buffalo-ghee",
		description: "Dense and creamy buffalo ghee ideal for sweets and frying.",
		categorySlug: "ghee",
		images: [],
		variants: [
			{ label: "500 ml", price: 690, originalPrice: 760, isActive: true },
			{ label: "1 L", price: 1320, originalPrice: 1450, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Andhra Mango Pickle",
		slug: "andhra-mango-pickle",
		description: "Classic spicy mango pickle aged in sesame oil.",
		categorySlug: "pickles",
		images: [],
		variants: [
			{ label: "250 g", price: 180, originalPrice: 210, isActive: true },
			{ label: "500 g", price: 340, originalPrice: 390, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Lemon Ginger Pickle",
		slug: "lemon-ginger-pickle",
		description: "Tangy lemon pickle balanced with fresh ginger notes.",
		categorySlug: "pickles",
		images: [],
		variants: [
			{ label: "250 g", price: 165, originalPrice: 190, isActive: true },
			{ label: "500 g", price: 315, originalPrice: 360, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Garlic Red Chilli Pickle",
		slug: "garlic-red-chilli-pickle",
		description: "Bold garlic pickle blended with stone-ground red chilli.",
		categorySlug: "pickles",
		images: [],
		variants: [
			{ label: "250 g", price: 175, originalPrice: 205, isActive: true },
			{ label: "500 g", price: 330, originalPrice: 380, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Wild Forest Honey",
		slug: "wild-forest-honey",
		description: "Raw honey harvested from multi-floral forest regions.",
		categorySlug: "honey",
		images: [],
		variants: [
			{ label: "250 g", price: 260, originalPrice: 299, isActive: true },
			{ label: "500 g", price: 490, originalPrice: 560, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Jamun Honey",
		slug: "jamun-honey",
		description: "Single-origin jamun honey with naturally rich taste.",
		categorySlug: "honey",
		images: [],
		variants: [
			{ label: "250 g", price: 290, originalPrice: 335, isActive: true },
			{ label: "500 g", price: 550, originalPrice: 620, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Tulsi Honey",
		slug: "tulsi-honey",
		description: "Pure tulsi-infused honey with soothing aroma.",
		categorySlug: "honey",
		images: [],
		variants: [
			{ label: "250 g", price: 270, originalPrice: 310, isActive: true },
			{ label: "500 g", price: 510, originalPrice: 585, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Besan Laddu",
		slug: "besan-laddu",
		description: "Traditional besan laddus roasted in pure ghee.",
		categorySlug: "sweets",
		images: [],
		variants: [
			{ label: "250 g", price: 210, originalPrice: 245, isActive: true },
			{ label: "500 g", price: 400, originalPrice: 470, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Dry Fruit Laddu",
		slug: "dry-fruit-laddu",
		description: "Nutrient-rich laddus packed with premium dry fruits.",
		categorySlug: "sweets",
		images: [],
		variants: [
			{ label: "250 g", price: 280, originalPrice: 330, isActive: true },
			{ label: "500 g", price: 540, originalPrice: 620, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Bellam Ariselu",
		slug: "bellam-ariselu",
		description: "Festive jaggery rice sweet made with sesame and ghee.",
		categorySlug: "sweets",
		images: [],
		variants: [
			{ label: "250 g", price: 230, originalPrice: 270, isActive: true },
			{ label: "500 g", price: 440, originalPrice: 510, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Wood Pressed Groundnut Oil",
		slug: "wood-pressed-groundnut-oil",
		description: "Cold-pressed groundnut oil with natural nutty aroma.",
		categorySlug: "cold-pressed-oils",
		images: [],
		variants: [
			{ label: "500 ml", price: 260, originalPrice: 295, isActive: true },
			{ label: "1 L", price: 500, originalPrice: 570, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Wood Pressed Sesame Oil",
		slug: "wood-pressed-sesame-oil",
		description: "Traditional sesame oil ideal for cooking and pickling.",
		categorySlug: "cold-pressed-oils",
		images: [],
		variants: [
			{ label: "500 ml", price: 310, originalPrice: 360, isActive: true },
			{ label: "1 L", price: 595, originalPrice: 670, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Wood Pressed Coconut Oil",
		slug: "wood-pressed-coconut-oil",
		description: "Pure coconut oil extracted at low temperatures.",
		categorySlug: "cold-pressed-oils",
		images: [],
		variants: [
			{ label: "500 ml", price: 290, originalPrice: 340, isActive: true },
			{ label: "1 L", price: 560, originalPrice: 635, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Garam Masala",
		slug: "garam-masala",
		description: "Aromatic whole-spice blend roasted and freshly ground.",
		categorySlug: "spices",
		images: [],
		variants: [
			{ label: "100 g", price: 120, originalPrice: 145, isActive: true },
			{ label: "250 g", price: 280, originalPrice: 330, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Turmeric Powder",
		slug: "turmeric-powder",
		description: "Single-origin turmeric powder with high curcumin content.",
		categorySlug: "spices",
		images: [],
		variants: [
			{ label: "200 g", price: 130, originalPrice: 155, isActive: true },
			{ label: "500 g", price: 300, originalPrice: 355, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Red Chilli Powder",
		slug: "red-chilli-powder",
		description: "Sun-dried chilli powder for deep color and heat.",
		categorySlug: "spices",
		images: [],
		variants: [
			{ label: "200 g", price: 140, originalPrice: 170, isActive: true },
			{ label: "500 g", price: 325, originalPrice: 380, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Stone Ground Wheat Flour",
		slug: "stone-ground-wheat-flour",
		description: "Whole wheat flour stone-ground in small batches.",
		categorySlug: "flours",
		images: [],
		variants: [
			{ label: "1 kg", price: 85, originalPrice: 99, isActive: true },
			{ label: "5 kg", price: 395, originalPrice: 460, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Multi Millet Flour",
		slug: "multi-millet-flour",
		description: "Balanced flour blend using five traditional millets.",
		categorySlug: "flours",
		images: [],
		variants: [
			{ label: "1 kg", price: 150, originalPrice: 180, isActive: true },
			{ label: "5 kg", price: 710, originalPrice: 820, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Besan Flour",
		slug: "besan-flour",
		description: "Protein-rich gram flour for snacks and sweets.",
		categorySlug: "flours",
		images: [],
		variants: [
			{ label: "500 g", price: 90, originalPrice: 110, isActive: true },
			{ label: "1 kg", price: 170, originalPrice: 205, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Foxtail Millet",
		slug: "foxtail-millet",
		description: "Naturally gluten-free foxtail millet for daily meals.",
		categorySlug: "millets",
		images: [],
		variants: [
			{ label: "500 g", price: 95, originalPrice: 118, isActive: true },
			{ label: "1 kg", price: 180, originalPrice: 220, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Kodo Millet",
		slug: "kodo-millet",
		description: "Light and nutritious millet suitable for diabetic diets.",
		categorySlug: "millets",
		images: [],
		variants: [
			{ label: "500 g", price: 100, originalPrice: 124, isActive: true },
			{ label: "1 kg", price: 190, originalPrice: 235, isActive: true },
		],
		isActive: true,
	},
	{
		name: "Barnyard Millet",
		slug: "barnyard-millet",
		description: "High-fiber barnyard millet perfect for fasting recipes.",
		categorySlug: "millets",
		images: [],
		variants: [
			{ label: "500 g", price: 105, originalPrice: 130, isActive: true },
			{ label: "1 kg", price: 200, originalPrice: 245, isActive: true },
		],
		isActive: true,
	},
];

const runReseed = async () => {
	await connectToDatabase();

	await Promise.all([
		Order.deleteMany({}),
		Coupon.deleteMany({}),
		OTP.deleteMany({}),
		User.deleteMany({}),
		Product.deleteMany({}),
		Category.deleteMany({}),
		AppConfig.deleteMany({}),
	]);

	const createdCategories = await Category.insertMany(categories);
	const categoryIdBySlug = new Map(
		createdCategories.map((category) => [category.slug, category._id]),
	);

	const preparedProducts = products.map((product) => {
		const categoryId = categoryIdBySlug.get(product.categorySlug);

		if (!categoryId) {
			throw new Error(`Unknown category slug: ${product.categorySlug}`);
		}

		return {
			name: product.name,
			slug: product.slug,
			description: product.description,
			category: categoryId,
			images: product.images,
			variants: product.variants,
			isActive: product.isActive,
		};
	});

	await Product.insertMany(preparedProducts);

	console.log(
		`Reseed completed: ${createdCategories.length} categories, ${preparedProducts.length} products. Admin users preserved.`,
	);
	process.exit(0);
};

runReseed().catch((error) => {
	console.error("Reseed failed:", error);
	process.exit(1);
});
