import {
	Bean,
	Bug,
	Candy,
	CircleDot,
	Cookie,
	Droplets,
	Flame,
	Leaf,
	Soup,
	Wheat,
} from "lucide-react";

export interface Category {
	id: string;
	name: string;
	icon: typeof Droplets;
	description: string;
	image: string;
}

export const categories: Category[] = [
	{
		id: "ghee",
		name: "Ghee",
		icon: Droplets,
		description: "Pure farm-fresh ghee made from desi cow milk",
		image: "/placeholder.svg",
	},
	{
		id: "sweets",
		name: "Sweets",
		icon: Candy,
		description: "Traditional homemade sweets with natural ingredients",
		image: "/placeholder.svg",
	},
	{
		id: "pickles",
		name: "Pickles",
		icon: Flame,
		description: "Authentic handmade pickles with family recipes",
		image: "/placeholder.svg",
	},
	{
		id: "powders",
		name: "Powders",
		icon: Soup,
		description: "Spice powders & rice mix powders for everyday meals",
		image: "/placeholder.svg",
	},
	{
		id: "honey",
		name: "Honey",
		icon: Bug,
		description: "Raw unprocessed honey straight from the hive",
		image: "/placeholder.svg",
	},
	{
		id: "oils",
		name: "Oils",
		icon: Droplets,
		description: "Cold-pressed natural oils — groundnut, coconut, sesame",
		image: "/placeholder.svg",
	},
	{
		id: "snacks",
		name: "Snacks",
		icon: Cookie,
		description: "Crispy traditional snacks made with farm ingredients",
		image: "/placeholder.svg",
	},
	{
		id: "rice",
		name: "Rice",
		icon: Wheat,
		description: "Organic rice varieties grown without chemicals",
		image: "/placeholder.svg",
	},
	{
		id: "millets",
		name: "Millets",
		icon: Leaf,
		description: "Nutritious millets — ragi, jowar, foxtail & more",
		image: "/placeholder.svg",
	},
	{
		id: "pulses",
		name: "Pulses",
		icon: Bean,
		description: "Farm-grown pulses rich in protein",
		image: "/placeholder.svg",
	},
	{
		id: "cereals",
		name: "Cereals",
		icon: CircleDot,
		description: "Wholesome cereals for a healthy start",
		image: "/placeholder.svg",
	},
];

export const getCategoryById = (id: string) =>
	categories.find((c) => c.id === id);
