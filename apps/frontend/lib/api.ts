const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface Category {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	isActive: boolean;
	createdAt: string;
}

export interface ProductVariant {
	label: string;
	price: number;
	originalPrice?: number;
	isActive: boolean;
}

export interface Product {
	_id: string;
	name: string;
	slug: string;
	description: string;
	category: Category;
	images: string[];
	variants: ProductVariant[];
	isActive: boolean;
	createdAt: string;
}

export const api = {
	// Get all products
	async getProducts(): Promise<Product[]> {
		const res = await fetch(`${API_URL}/products`);
		if (!res.ok) throw new Error("Failed to fetch products");
		return res.json();
	},

	// Get single product by slug
	async getProductBySlug(slug: string): Promise<Product> {
		const res = await fetch(`${API_URL}/products/${slug}`);
		if (!res.ok) throw new Error("Product not found");
		return res.json();
	},

	// Get all categories
	async getCategories(): Promise<Category[]> {
		const res = await fetch(`${API_URL}/categories`);
		if (!res.ok) throw new Error("Failed to fetch categories");
		return res.json();
	},

	// Get products by category slug
	async getProductsByCategory(categorySlug: string): Promise<Product[]> {
		const res = await fetch(`${API_URL}/categories/${categorySlug}/products`);
		if (!res.ok) throw new Error("Failed to fetch products");
		return res.json();
	},

	// Auth endpoints
	async requestOTP(mobile: string): Promise<{ message: string; otp?: string }> {
		const res = await fetch(`${API_URL}/auth/request-otp`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ mobile }),
		});
		if (!res.ok) throw new Error("Failed to request OTP");
		return res.json();
	},

	async verifyOTP(
		mobile: string,
		otp: string,
	): Promise<{ message: string; user: any }> {
		const res = await fetch(`${API_URL}/auth/verify-otp`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ mobile, otp }),
		});
		if (!res.ok) throw new Error("Invalid OTP");
		return res.json();
	},
};
