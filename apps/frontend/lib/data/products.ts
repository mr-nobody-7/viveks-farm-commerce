export interface ProductVariant {
	weight: string;
	actualPrice: number;
	sellingPrice: number;
}

export interface Product {
	id: string;
	name: string;
	category: string;
	description: string;
	ingredients: string;
	shelfLife: string;
	images: string[];
	variants: ProductVariant[];
	featured: boolean;
}

export const products: Product[] = [
	// Ghee
	{
		id: "ghee-desi-cow",
		name: "Desi Cow Ghee",
		category: "ghee",
		description:
			"Pure A2 desi cow ghee made using the traditional bilona method. Rich aroma and golden texture.",
		ingredients: "A2 Cow Milk",
		shelfLife: "12 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "250ml", actualPrice: 450, sellingPrice: 399 },
			{ weight: "500ml", actualPrice: 850, sellingPrice: 749 },
			{ weight: "1L", actualPrice: 1600, sellingPrice: 1399 },
		],
		featured: true,
	},
	{
		id: "ghee-buffalo",
		name: "Buffalo Ghee",
		category: "ghee",
		description:
			"Creamy buffalo ghee with a rich, buttery flavor. Perfect for sweets and everyday cooking.",
		ingredients: "Buffalo Milk",
		shelfLife: "12 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "250ml", actualPrice: 350, sellingPrice: 299 },
			{ weight: "500ml", actualPrice: 650, sellingPrice: 549 },
			{ weight: "1L", actualPrice: 1200, sellingPrice: 999 },
		],
		featured: false,
	},
	// Sweets
	{
		id: "sweet-mysorepak",
		name: "Mysore Pak",
		category: "sweets",
		description:
			"Melt-in-your-mouth Mysore Pak made with pure ghee and gram flour. A South Indian classic.",
		ingredients: "Gram Flour, Sugar, Ghee, Cardamom",
		shelfLife: "15 days",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "250g", actualPrice: 300, sellingPrice: 249 },
			{ weight: "500g", actualPrice: 550, sellingPrice: 469 },
		],
		featured: true,
	},
	{
		id: "sweet-laddu",
		name: "Boondi Laddu",
		category: "sweets",
		description:
			"Traditional boondi laddus made with farm-fresh ghee and aromatic cardamom.",
		ingredients: "Gram Flour, Sugar, Ghee, Cardamom, Cashews",
		shelfLife: "20 days",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "250g", actualPrice: 280, sellingPrice: 229 },
			{ weight: "500g", actualPrice: 520, sellingPrice: 429 },
		],
		featured: true,
	},
	// Pickles
	{
		id: "pickle-mango",
		name: "Mango Pickle",
		category: "pickles",
		description:
			"Tangy and spicy raw mango pickle made with cold-pressed oil and traditional spices.",
		ingredients: "Raw Mango, Mustard Oil, Red Chilli, Fenugreek, Salt",
		shelfLife: "12 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "250g", actualPrice: 200, sellingPrice: 169 },
			{ weight: "500g", actualPrice: 380, sellingPrice: 319 },
		],
		featured: true,
	},
	{
		id: "pickle-lemon",
		name: "Lemon Pickle",
		category: "pickles",
		description:
			"Zesty lemon pickle with a perfect balance of sour, spicy and savory flavors.",
		ingredients: "Lemon, Mustard Oil, Red Chilli, Turmeric, Salt",
		shelfLife: "12 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "250g", actualPrice: 180, sellingPrice: 149 },
			{ weight: "500g", actualPrice: 340, sellingPrice: 279 },
		],
		featured: false,
	},
	{
		id: "pickle-ginger",
		name: "Ginger Pickle",
		category: "pickles",
		description:
			"Crunchy ginger pickle, a unique and flavorful addition to any meal.",
		ingredients: "Ginger, Groundnut Oil, Red Chilli, Fenugreek, Salt",
		shelfLife: "10 months",
		images: ["/placeholder.svg"],
		variants: [{ weight: "250g", actualPrice: 220, sellingPrice: 189 }],
		featured: false,
	},
	// Powders
	{
		id: "powder-sambar",
		name: "Sambar Powder",
		category: "powders",
		description:
			"Aromatic sambar powder ground fresh from whole spices. Makes every sambar special.",
		ingredients: "Coriander, Red Chilli, Toor Dal, Fenugreek, Cumin, Turmeric",
		shelfLife: "6 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "100g", actualPrice: 120, sellingPrice: 99 },
			{ weight: "250g", actualPrice: 280, sellingPrice: 229 },
		],
		featured: true,
	},
	{
		id: "powder-rasam",
		name: "Rasam Powder",
		category: "powders",
		description:
			"Traditional rasam powder with a robust, peppery flavor. Perfect comfort food essential.",
		ingredients: "Black Pepper, Coriander, Red Chilli, Cumin, Toor Dal",
		shelfLife: "6 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "100g", actualPrice: 110, sellingPrice: 89 },
			{ weight: "250g", actualPrice: 250, sellingPrice: 199 },
		],
		featured: false,
	},
	// Honey
	{
		id: "honey-wildflower",
		name: "Wildflower Honey",
		category: "honey",
		description:
			"Raw unprocessed wildflower honey harvested from our farm apiaries. Packed with natural enzymes.",
		ingredients: "100% Raw Honey",
		shelfLife: "24 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "250g", actualPrice: 350, sellingPrice: 299 },
			{ weight: "500g", actualPrice: 650, sellingPrice: 549 },
		],
		featured: true,
	},
	// Oils
	{
		id: "oil-groundnut",
		name: "Cold-Pressed Groundnut Oil",
		category: "oils",
		description:
			"Traditional wood-pressed groundnut oil with rich nutty aroma. Zero chemicals.",
		ingredients: "100% Groundnuts",
		shelfLife: "6 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "500ml", actualPrice: 280, sellingPrice: 239 },
			{ weight: "1L", actualPrice: 520, sellingPrice: 449 },
		],
		featured: true,
	},
	{
		id: "oil-coconut",
		name: "Cold-Pressed Coconut Oil",
		category: "oils",
		description:
			"Pure virgin coconut oil extracted from farm-fresh coconuts. Great for cooking and skin.",
		ingredients: "100% Coconut",
		shelfLife: "12 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "500ml", actualPrice: 320, sellingPrice: 269 },
			{ weight: "1L", actualPrice: 600, sellingPrice: 499 },
		],
		featured: false,
	},
	// Snacks
	{
		id: "snack-murukku",
		name: "Rice Murukku",
		category: "snacks",
		description:
			"Crispy spiral murukku made with rice flour and cumin. A classic tea-time snack.",
		ingredients: "Rice Flour, Urad Dal Flour, Cumin, Sesame, Salt",
		shelfLife: "30 days",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "200g", actualPrice: 180, sellingPrice: 149 },
			{ weight: "500g", actualPrice: 420, sellingPrice: 349 },
		],
		featured: false,
	},
	{
		id: "snack-mixture",
		name: "South Indian Mixture",
		category: "snacks",
		description:
			"Spicy and crunchy mixture with sev, peanuts, curry leaves and a medley of dals.",
		ingredients: "Gram Flour, Rice Flakes, Peanuts, Curry Leaves, Spices",
		shelfLife: "30 days",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "200g", actualPrice: 160, sellingPrice: 129 },
			{ weight: "500g", actualPrice: 380, sellingPrice: 299 },
		],
		featured: true,
	},
	// Rice
	{
		id: "rice-sona-masoori",
		name: "Sona Masoori Rice",
		category: "rice",
		description:
			"Lightweight, aromatic Sona Masoori rice grown organically on our farm.",
		ingredients: "100% Organic Sona Masoori Rice",
		shelfLife: "12 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "1kg", actualPrice: 120, sellingPrice: 99 },
			{ weight: "5kg", actualPrice: 550, sellingPrice: 469 },
		],
		featured: false,
	},
	{
		id: "rice-brown",
		name: "Brown Rice",
		category: "rice",
		description:
			"Unpolished brown rice packed with fiber and nutrients. A healthier everyday choice.",
		ingredients: "100% Unpolished Brown Rice",
		shelfLife: "10 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "1kg", actualPrice: 140, sellingPrice: 119 },
			{ weight: "5kg", actualPrice: 650, sellingPrice: 549 },
		],
		featured: false,
	},
	// Millets
	{
		id: "millet-ragi",
		name: "Ragi (Finger Millet)",
		category: "millets",
		description:
			"Calcium-rich ragi grown naturally. Perfect for ragi mudde, porridge, and dosas.",
		ingredients: "100% Finger Millet",
		shelfLife: "12 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "500g", actualPrice: 100, sellingPrice: 79 },
			{ weight: "1kg", actualPrice: 180, sellingPrice: 149 },
		],
		featured: false,
	},
	{
		id: "millet-foxtail",
		name: "Foxtail Millet",
		category: "millets",
		description:
			"Nutritious foxtail millet, an excellent rice substitute for a balanced diet.",
		ingredients: "100% Foxtail Millet",
		shelfLife: "12 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "500g", actualPrice: 110, sellingPrice: 89 },
			{ weight: "1kg", actualPrice: 200, sellingPrice: 169 },
		],
		featured: false,
	},
	// Pulses
	{
		id: "pulse-toor-dal",
		name: "Toor Dal",
		category: "pulses",
		description:
			"Farm-fresh toor dal with a rich taste and quick cooking time.",
		ingredients: "100% Toor Dal",
		shelfLife: "12 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "500g", actualPrice: 110, sellingPrice: 89 },
			{ weight: "1kg", actualPrice: 200, sellingPrice: 169 },
		],
		featured: false,
	},
	{
		id: "pulse-moong-dal",
		name: "Moong Dal",
		category: "pulses",
		description:
			"Clean, polished moong dal perfect for khichdi, dal tadka, and more.",
		ingredients: "100% Moong Dal",
		shelfLife: "12 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "500g", actualPrice: 130, sellingPrice: 109 },
			{ weight: "1kg", actualPrice: 240, sellingPrice: 199 },
		],
		featured: false,
	},
	// Cereals
	{
		id: "cereal-multigrain",
		name: "Multigrain Health Mix",
		category: "cereals",
		description:
			"A nutritious blend of 7 grains roasted and ground fresh. Great for porridge or smoothies.",
		ingredients: "Ragi, Jowar, Wheat, Rice, Green Gram, Bengal Gram, Almonds",
		shelfLife: "3 months",
		images: ["/placeholder.svg"],
		variants: [
			{ weight: "250g", actualPrice: 200, sellingPrice: 169 },
			{ weight: "500g", actualPrice: 380, sellingPrice: 319 },
		],
		featured: true,
	},
];

export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getProductsByCategory = (category: string) =>
	products.filter((p) => p.category === category);
export const getFeaturedProducts = () => products.filter((p) => p.featured);
