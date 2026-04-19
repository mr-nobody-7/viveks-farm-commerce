const API_URL = process.env.NEXT_PUBLIC_API_URL;

const requestJson = async <T>(
	path: string,
	init?: RequestInit,
): Promise<T> => {
	if (!API_URL) {
		throw new Error("NEXT_PUBLIC_API_URL is not configured");
	}

	let response: Response;

	try {
		response = await fetch(`${API_URL}${path}`, init);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown network error";
		throw new Error(`Network error calling ${path}: ${message}`);
	}

	if (!response.ok) {
		const text = await response.text();
		const details = text || response.statusText || "No response body";
		throw new Error(`API ${path} failed (${response.status}): ${details}`);
	}

	return response.json() as Promise<T>;
};

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
		return requestJson<Product[]>("/api/products");
	},

	// Get single product by slug
	async getProductBySlug(slug: string): Promise<Product> {
		return requestJson<Product>(`/api/products/${slug}`);
	},

	// Get all categories
	async getCategories(): Promise<Category[]> {
		return requestJson<Category[]>("/api/categories");
	},

	// Get products by category slug
	async getProductsByCategory(categorySlug: string): Promise<Product[]> {
		return requestJson<Product[]>(`/api/categories/${categorySlug}/products`);
	},

	// Auth endpoints
	async requestOTP(mobile: string): Promise<{ message: string; devOtp?: string }> {
		return requestJson<{ message: string; devOtp?: string }>("/api/auth/request-otp", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ mobile }),
		});
	},

	async verifyOTP(
		mobile: string,
		otp: string,
	): Promise<{ message: string; user: any }> {
		return requestJson<{ message: string; user: any }>("/api/auth/verify-otp", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ mobile, otp }),
		});
	},
};
