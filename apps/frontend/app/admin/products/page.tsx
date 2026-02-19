"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
	_id: string;
	name: string;
}

interface Variant {
	size: string;
	price: number;
	stock: number;
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

export default function AdminProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [uploading, setUploading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		category: "",
		variants: [{ size: "", price: 0, stock: 0 }] as Variant[],
		images: [] as string[],
	});
	const router = useRouter();

	const fetchProducts = async () => {
		try {
			const res = await fetch("http://localhost:4000/api/admin/products", {
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
			const res = await fetch("http://localhost:4000/api/admin/categories", {
				credentials: "include",
			});

			if (res.ok) {
				const data = await res.json();
				setCategories(data.filter((cat: Category & { isActive: boolean }) => cat.isActive));
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
				variants: [{ size: "", price: 0, stock: 0 }],
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

			const res = await fetch("http://localhost:4000/api/admin/upload", {
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
			variants: [...formData.variants, { size: "", price: 0, stock: 0 }],
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
		value: string | number,
	) => {
		const newVariants = [...formData.variants];
		newVariants[index] = { ...newVariants[index], [field]: value };
		setFormData({ ...formData, variants: newVariants });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const url = editingProduct
				? `http://localhost:4000/api/admin/products/${editingProduct._id}`
				: "http://localhost:4000/api/admin/products";

			const res = await fetch(url, {
				method: editingProduct ? "PATCH" : "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(formData),
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
			const res = await fetch(
				`http://localhost:4000/api/admin/products/${productId}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ isActive: !isActive }),
				},
			);

			if (!res.ok) throw new Error("Failed to update product");

			await fetchProducts();
		} catch (err) {
			console.error("Error toggling product:", err);
			alert("Failed to update product");
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-gray-500">Loading products...</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">Products</h1>
				<Button onClick={() => handleOpenModal()}>Add Product</Button>
			</div>

			{/* Products Table */}
			<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
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
						{products.map((product) => (
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
											{v.size}: ₹{v.price} ({v.stock} in stock)
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
								{formData.variants.map((variant, index) => (
									<div key={index} className="flex gap-2 mb-2">
										<input
											type="text"
											placeholder="Size (e.g., 250g)"
											required
											value={variant.size}
											onChange={(e) =>
												handleVariantChange(index, "size", e.target.value)
											}
											className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
										/>
										<input
											type="number"
											placeholder="Price"
											required
											value={variant.price}
											onChange={(e) =>
												handleVariantChange(
													index,
													"price",
													Number(e.target.value),
												)
											}
											className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
										/>
										<input
											type="number"
											placeholder="Stock"
											required
											value={variant.stock}
											onChange={(e) =>
												handleVariantChange(
													index,
													"stock",
													Number(e.target.value),
												)
											}
											className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
										/>
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
