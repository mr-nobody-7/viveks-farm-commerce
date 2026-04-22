"use client";

import { Button } from "@/components/ui/button";
import { AdminTableSkeleton } from "@/components/Skeletons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Category {
	_id: string;
	name: string;
}

interface Variant {
	label: string;
	price: number;
	originalPrice?: number;
	isActive: boolean;
}

interface Product {
	_id: string;
	name: string;
	description: string;
	category: {
		_id: string;
		name: string;
	};
	variants: Variant[];
	images: string[];
	isActive: boolean;
}

const getDiscountPercentage = (price: number, originalPrice?: number) => {
	if (!originalPrice || originalPrice <= 0 || originalPrice <= price) {
		return 0;
	}

	return Math.round(((originalPrice - price) / originalPrice) * 100);
};

export default function AdminProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("ALL");
	const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
	const [showModal, setShowModal] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [uploading, setUploading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		category: "",
		variants: [
			{ label: "", price: 0, originalPrice: undefined, isActive: true },
		] as Variant[],
		images: [] as string[],
	});
	const router = useRouter();

	const fetchProducts = async () => {
		try {
			const res = await fetch(`${API_URL}/api/admin/products`, {
				credentials: "include",
			});

			if (!res.ok) {
				if (res.status === 401) {
					router.push("/admin/login");
					return;
				}
				throw new Error("Failed to fetch products");
			}

			const data = await res.json();
			setProducts(data);
		} catch (err) {
			console.error("Error fetching products:", err);
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const res = await fetch(`${API_URL}/api/admin/categories`, {
				credentials: "include",
			});

			if (res.ok) {
				const data = await res.json();
				setCategories(
					data.filter((cat: Category & { isActive: boolean }) => cat.isActive),
				);
			}
		} catch (err) {
			console.error("Error fetching categories:", err);
		}
	};

	useEffect(() => {
		fetchProducts();
		fetchCategories();
	}, [router]);

	const handleOpenModal = (product?: Product) => {
		if (product) {
			setEditingProduct(product);
			setFormData({
				name: product.name,
				description: product.description,
				category: product.category._id,
				variants: product.variants,
				images: product.images,
			});
		} else {
			setEditingProduct(null);
			setFormData({
				name: "",
				description: "",
				category: "",
				variants: [
					{
						label: "",
						price: 0,
						originalPrice: undefined,
						isActive: true,
					},
				],
				images: [],
			});
		}
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingProduct(null);
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		try {
			const formDataUpload = new FormData();
			formDataUpload.append("image", file);

			const res = await fetch(`${API_URL}/api/admin/upload`, {
				method: "POST",
				credentials: "include",
				body: formDataUpload,
			});

			if (!res.ok) throw new Error("Upload failed");

			const data = await res.json();
			setFormData({ ...formData, images: [...formData.images, data.url] });
		} catch (err) {
			console.error("Error uploading image:", err);
			alert("Failed to upload image");
		} finally {
			setUploading(false);
		}
	};

	const handleRemoveImage = (index: number) => {
		const newImages = [...formData.images];
		newImages.splice(index, 1);
		setFormData({ ...formData, images: newImages });
	};

	const handleAddVariant = () => {
		setFormData({
			...formData,
			variants: [
				...formData.variants,
				{ label: "", price: 0, originalPrice: undefined, isActive: true },
			],
		});
	};

	const handleRemoveVariant = (index: number) => {
		const newVariants = [...formData.variants];
		newVariants.splice(index, 1);
		setFormData({ ...formData, variants: newVariants });
	};

	const handleVariantChange = (
		index: number,
		field: keyof Variant,
		value: string | number | boolean | undefined,
	) => {
		const newVariants = [...formData.variants];
		newVariants[index] = { ...newVariants[index], [field]: value };
		setFormData({ ...formData, variants: newVariants });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const sanitizedVariants = formData.variants.map((variant) => {
			const parsedPrice = Number(variant.price);
			const parsedOriginalPrice = Number(variant.originalPrice);

			const price = Number.isFinite(parsedPrice) ? parsedPrice : 0;
			const originalPrice =
				Number.isFinite(parsedOriginalPrice) && parsedOriginalPrice > price
					? parsedOriginalPrice
					: undefined;

			return {
				...variant,
				label: variant.label.trim(),
				price,
				originalPrice,
			};
		});

		if (sanitizedVariants.length === 0) {
			alert("Please add at least one variant");
			return;
		}

		if (
			sanitizedVariants.some((variant) => !variant.label || variant.price <= 0)
		) {
			alert("Each variant needs a label and a valid selling price");
			return;
		}

		try {
			const url = editingProduct
				? `${API_URL}/api/admin/products/${editingProduct._id}`
				: `${API_URL}/api/admin/products`;

			const res = await fetch(url, {
				method: editingProduct ? "PATCH" : "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					...formData,
					variants: sanitizedVariants,
				}),
			});

			if (!res.ok) throw new Error("Failed to save product");

			await fetchProducts();
			handleCloseModal();
		} catch (err) {
			console.error("Error saving product:", err);
			alert("Failed to save product");
		}
	};

	const handleToggleActive = async (productId: string, isActive: boolean) => {
		try {
			const res = await fetch(`${API_URL}/api/admin/products/${productId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ isActive: !isActive }),
			});

			if (!res.ok) throw new Error("Failed to update product");

			await fetchProducts();
		} catch (err) {
			console.error("Error toggling product:", err);
			alert("Failed to update product");
		}
	};

	if (loading) {
		return <AdminTableSkeleton rows={6} cols={5} />;
	}

	const q = searchQuery.trim().toLowerCase();
	const filteredProducts = products.filter((p) => {
		const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
		const matchesCategory = categoryFilter === "ALL" || p.category._id === categoryFilter;
		const matchesStatus = statusFilter === "ALL" || (statusFilter === "ACTIVE" ? p.isActive : !p.isActive);
		return matchesSearch && matchesCategory && matchesStatus;
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<h1 className="text-3xl font-bold">Products</h1>
				<Button onClick={() => handleOpenModal()}>Add Product</Button>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-wrap gap-3">
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search products..."
					className="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1 min-w-40"
				/>
				<select
					value={categoryFilter}
					onChange={(e) => setCategoryFilter(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded-md text-sm"
				>
					<option value="ALL">All Categories</option>
					{categories.map((cat) => (
						<option key={cat._id} value={cat._id}>{cat.name}</option>
					))}
				</select>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
					className="px-3 py-2 border border-gray-300 rounded-md text-sm"
				>
					<option value="ALL">All Statuses</option>
					<option value="ACTIVE">Active</option>
					<option value="INACTIVE">Inactive</option>
				</select>
				{(searchQuery || categoryFilter !== "ALL" || statusFilter !== "ALL") && (
					<button
						type="button"
						onClick={() => { setSearchQuery(""); setCategoryFilter("ALL"); setStatusFilter("ALL"); }}
						className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 hover:bg-gray-100"
					>
						Reset
					</button>
				)}
			</div>

			{/* Products Table */}
			<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-[1000px] divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Product
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Category
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Variants
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
						{filteredProducts.length === 0 && (
							<tr>
								<td colSpan={5} className="px-6 py-12 text-center text-gray-500">
									{products.length === 0
										? "No products yet. Click \"Add Product\" to create one."
										: "No products match your filters."}
								</td>
							</tr>
						)}
						{filteredProducts.map((product) => (
								<tr key={product._id}>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											{product.images[0] && (
												<img
													src={product.images[0]}
													alt={product.name}
													className="h-10 w-10 rounded object-cover mr-3"
												/>
											)}
											<div>
												<div className="text-sm font-medium text-gray-900">
													{product.name}
												</div>
												<div className="text-sm text-gray-500 truncate max-w-xs">
													{product.description}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{product.category.name}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">
										{product.variants.map((v, i) => (
											<div key={i}>
												{v.label}: ₹{v.price}
												{typeof v.originalPrice === "number" &&
												v.originalPrice > 0
													? ` (MRP ₹${v.originalPrice})`
													: ""}
													{getDiscountPercentage(v.price, v.originalPrice) > 0
														? ` - ${getDiscountPercentage(v.price, v.originalPrice)}% OFF`
														: ""}
												{v.isActive ? "" : " [Inactive]"}
											</div>
										))}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
												product.isActive
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{product.isActive ? "Active" : "Disabled"}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
										<button
											type="button"
											onClick={() => handleOpenModal(product)}
											className="text-blue-600 hover:text-blue-900"
										>
											Edit
										</button>
										<button
											type="button"
											onClick={() =>
												handleToggleActive(product._id, product.isActive)
											}
											className={
												product.isActive
													? "text-red-600 hover:text-red-900"
													: "text-green-600 hover:text-green-900"
											}
										>
											{product.isActive ? "Disable" : "Enable"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
					<div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
						<h2 className="text-xl font-bold mb-4">
							{editingProduct ? "Edit Product" : "Add Product"}
						</h2>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700"
								>
									Name
								</label>
								<input
									id="name"
									type="text"
									required
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
								/>
							</div>

							<div>
								<label
									htmlFor="description"
									className="block text-sm font-medium text-gray-700"
								>
									Description
								</label>
								<textarea
									id="description"
									required
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									rows={3}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
								/>
							</div>

							<div>
								<label
									htmlFor="category"
									className="block text-sm font-medium text-gray-700"
								>
									Category
								</label>
								<select
									id="category"
									required
									value={formData.category}
									onChange={(e) =>
										setFormData({ ...formData, category: e.target.value })
									}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
								>
									<option value="">Select a category</option>
									{categories.map((cat) => (
										<option key={cat._id} value={cat._id}>
											{cat.name}
										</option>
									))}
								</select>
							</div>

							{/* Variants */}
							<div>
								<div className="flex justify-between items-center mb-2">
									<label className="block text-sm font-medium text-gray-700">
										Variants
									</label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={handleAddVariant}
									>
										Add Variant
									</Button>
								</div>
								<p className="mb-3 text-xs text-gray-500">
									Set selling price in "Price". Add "MRP" only if you want discount
									to be shown automatically.
								</p>
								<div className="mb-2 hidden grid-cols-[minmax(220px,1fr)_128px_176px_auto] gap-2 px-1 text-xs font-medium text-gray-500 md:grid">
									<span>Variant Label</span>
									<span>Price</span>
									<span>MRP (Optional)</span>
									<span>Status</span>
								</div>
								{formData.variants.map((variant, index) => (
									<div
										key={index}
										className="mb-3 flex flex-wrap items-center gap-2"
									>
										<input
											type="text"
											placeholder="Label (e.g., 500g, 1kg, Small jar)"
											required
											value={variant.label}
											onChange={(e) =>
												handleVariantChange(index, "label", e.target.value)
											}
											className="flex-1 min-w-55 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
										/>
										<input
											type="number"
											placeholder="Price"
											required
											min="0"
											step="0.01"
											value={variant.price}
											onChange={(e) =>
												handleVariantChange(
													index,
													"price",
													e.target.value === "" ? 0 : Number(e.target.value),
												)
											}
											className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
										/>
										<input
											type="number"
											placeholder="MRP / Original Price"
											min="0"
											step="0.01"
											value={variant.originalPrice ?? ""}
											onChange={(e) =>
												handleVariantChange(
													index,
													"originalPrice",
													e.target.value ? Number(e.target.value) : undefined,
												)
											}
											className="w-44 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
										/>
										{getDiscountPercentage(variant.price, variant.originalPrice) > 0 && (
											<span className="text-xs font-medium text-green-700">
												{getDiscountPercentage(variant.price, variant.originalPrice)}% OFF
											</span>
										)}
										<label className="flex items-center gap-2 px-2 text-sm text-gray-700">
											<input
												type="checkbox"
												checked={variant.isActive}
												onChange={(e) =>
													handleVariantChange(
														index,
														"isActive",
														e.target.checked,
													)
												}
												className="h-4 w-4"
											/>
											Active
										</label>
										{formData.variants.length > 1 && (
											<button
												type="button"
												onClick={() => handleRemoveVariant(index)}
												className="text-red-600 hover:text-red-900 px-2"
											>
												Remove
											</button>
										)}
									</div>
								))}
							</div>

							{/* Images */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Images
								</label>
								<div className="flex flex-wrap gap-2 mb-2">
									{formData.images.map((url, index) => (
										<div key={index} className="relative">
											<img
												src={url}
												alt={`Product ${index + 1}`}
												className="h-20 w-20 object-cover rounded border"
											/>
											<button
												type="button"
												onClick={() => handleRemoveImage(index)}
												className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
											>
												×
											</button>
										</div>
									))}
								</div>
								<input
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
									disabled={uploading}
									className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
								/>
								{uploading && (
									<p className="text-sm text-gray-500 mt-1">Uploading...</p>
								)}
							</div>

							<div className="flex justify-end space-x-3 mt-6">
								<Button
									type="button"
									variant="outline"
									onClick={handleCloseModal}
								>
									Cancel
								</Button>
								<Button type="submit">
									{editingProduct ? "Update" : "Create"}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
