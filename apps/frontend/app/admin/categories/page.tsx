"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminTableSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Category {
	_id: string;
	name: string;
	slug: string;
	description: string;
	isActive: boolean;
}

export default function AdminCategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [formData, setFormData] = useState({ name: "", description: "" });
	const [submitting, setSubmitting] = useState(false);
	const [togglingId, setTogglingId] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const router = useRouter();

	const fetchCategories = useCallback(async () => {
		try {
			const res = await fetch(`${API_URL}/api/admin/categories`, {
				credentials: "include",
			});

			if (!res.ok) {
				if (res.status === 401) {
					router.push("/admin/login");
					return;
				}
				throw new Error("Failed to fetch categories");
			}

			const data = await res.json();
			setCategories(data);
		} catch (err) {
			console.error("Error fetching categories:", err);
		} finally {
			setLoading(false);
		}
	}, [router]);

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const handleOpenModal = (category?: Category) => {
		if (category) {
			setEditingCategory(category);
			setFormData({ name: category.name, description: category.description });
		} else {
			setEditingCategory(null);
			setFormData({ name: "", description: "" });
		}
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingCategory(null);
		setFormData({ name: "", description: "" });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			const url = editingCategory
				? `${API_URL}/api/admin/categories/${editingCategory._id}`
				: `${API_URL}/api/admin/categories`;

			const res = await fetch(url, {
				method: editingCategory ? "PATCH" : "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(formData),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message || "Failed to save category");
			}

			await fetchCategories();
			handleCloseModal();
			toast.success(
				editingCategory
					? "Category updated successfully"
					: "Category created successfully",
			);
		} catch (err) {
			console.error("Error saving category:", err);
			toast.error(
				err instanceof Error ? err.message : "Failed to save category",
			);
		} finally {
			setSubmitting(false);
		}
	};

	const handleToggleActive = async (categoryId: string, isActive: boolean) => {
		setTogglingId(categoryId);
		try {
			const res = await fetch(`${API_URL}/api/admin/categories/${categoryId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ isActive: !isActive }),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message || "Failed to update category");
			}

			await fetchCategories();
			toast.success(isActive ? "Category disabled" : "Category enabled");
		} catch (err) {
			console.error("Error toggling category:", err);
			toast.error(
				err instanceof Error ? err.message : "Failed to update category",
			);
		} finally {
			setTogglingId(null);
		}
	};

	if (loading) {
		return <AdminTableSkeleton rows={4} cols={5} />;
	}

	const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
	const paginatedCategories = categories.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE,
	);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<h1 className="text-3xl font-bold">Categories</h1>
				<Button onClick={() => handleOpenModal()}>Add Category</Button>
			</div>

			{/* Categories Table */}
			<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-225 divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Description
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Route
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
							{categories.length === 0 && (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-12 text-center text-gray-500"
									>
										No categories yet. Click "Add Category" to create one.
									</td>
								</tr>
							)}
							{paginatedCategories.map((category) => (
								<tr key={category._id}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{category.name}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">
										{category.description}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
										/shop/{category.slug}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
												category.isActive
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{category.isActive ? "Active" : "Disabled"}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
										<button
											type="button"
											onClick={() => handleOpenModal(category)}
											className="text-blue-600 hover:text-blue-900"
										>
											Edit
										</button>
										<button
											type="button"
											disabled={togglingId === category._id}
											onClick={() =>
												handleToggleActive(category._id, category.isActive)
											}
											className={`inline-flex items-center gap-1 ${
												category.isActive
													? "text-red-600 hover:text-red-900"
													: "text-green-600 hover:text-green-900"
											} disabled:opacity-50 disabled:cursor-not-allowed`}
										>
											{togglingId === category._id && (
												<Loader2 className="h-3 w-3 animate-spin" />
											)}
											{category.isActive ? "Disable" : "Enable"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{totalPages > 1 && (
					<div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
						<p className="text-sm text-gray-700">
							Showing{" "}
							<span className="font-medium">
								{(page - 1) * ITEMS_PER_PAGE + 1}
							</span>
							{" – "}
							<span className="font-medium">
								{Math.min(page * ITEMS_PER_PAGE, categories.length)}
							</span>{" "}
							of <span className="font-medium">{categories.length}</span>
						</p>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => p - 1)}
								disabled={page === 1}
							>
								Prev
							</Button>
							<span className="text-sm text-gray-600">
								{page} / {totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => p + 1)}
								disabled={page === totalPages}
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</div>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg p-6 w-full max-w-md">
						<h2 className="text-xl font-bold mb-4">
							{editingCategory ? "Edit Category" : "Add Category"}
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

							<div className="flex justify-end space-x-3 mt-6">
								<Button
									type="button"
									variant="outline"
									onClick={handleCloseModal}
									disabled={submitting}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={submitting}>
									{submitting ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Saving...
										</>
									) : editingCategory ? (
										"Update"
									) : (
										"Create"
									)}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
