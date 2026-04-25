"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminTableSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ITEMS_PER_PAGE = 10;

type DiscountType = "PERCENTAGE" | "FIXED";

interface Coupon {
	_id: string;
	code: string;
	description?: string;
	discountType: DiscountType;
	discountValue: number;
	minOrderAmount?: number;
	maxDiscountAmount?: number;
	isActive: boolean;
	expiresAt?: string;
	usageLimit?: number;
	usedCount: number;
}

interface Product {
	_id: string;
	name: string;
}

export default function AdminCouponsPage() {
	const router = useRouter();
	const [coupons, setCoupons] = useState<Coupon[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
	const [page, setPage] = useState(1);
	const [formData, setFormData] = useState({
		code: "",
		description: "",
		discountType: "PERCENTAGE" as DiscountType,
		discountValue: 0,
		minOrderAmount: "",
		maxDiscountAmount: "",
		usageLimit: "",
		expiresAt: "",
		isActive: true,
		applicableProducts: [] as string[],
	});

	const fetchData = useCallback(async () => {
		try {
			const [couponsRes, productsRes] = await Promise.all([
				fetch(`${API_URL}/api/admin/coupons`, { credentials: "include" }),
				fetch(`${API_URL}/api/admin/products`, { credentials: "include" }),
			]);

			if (couponsRes.status === 401 || productsRes.status === 401) {
				router.push("/admin/login");
				return;
			}

			if (!couponsRes.ok || !productsRes.ok) {
				throw new Error("Failed to fetch coupon data");
			}

			const [couponsData, productsData] = await Promise.all([
				couponsRes.json(),
				productsRes.json(),
			]);

			setCoupons(couponsData);
			setProducts(productsData);
		} catch (error) {
			console.error("Coupon data fetch failed:", error);
		} finally {
			setLoading(false);
		}
	}, [router]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const resetForm = () => {
		setFormData({
			code: "",
			description: "",
			discountType: "PERCENTAGE",
			discountValue: 0,
			minOrderAmount: "",
			maxDiscountAmount: "",
			usageLimit: "",
			expiresAt: "",
			isActive: true,
			applicableProducts: [],
		});
	};

	const openCreateModal = () => {
		setEditingCoupon(null);
		resetForm();
		setShowModal(true);
	};

	const openEditModal = (coupon: Coupon) => {
		setEditingCoupon(coupon);
		setFormData({
			code: coupon.code,
			description: coupon.description || "",
			discountType: coupon.discountType,
			discountValue: coupon.discountValue,
			minOrderAmount:
				typeof coupon.minOrderAmount === "number"
					? String(coupon.minOrderAmount)
					: "",
			maxDiscountAmount:
				typeof coupon.maxDiscountAmount === "number"
					? String(coupon.maxDiscountAmount)
					: "",
			usageLimit:
				typeof coupon.usageLimit === "number" ? String(coupon.usageLimit) : "",
			expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
			isActive: coupon.isActive,
			applicableProducts: [],
		});
		setShowModal(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);

		try {
			const payload = {
				code: formData.code,
				description: formData.description || undefined,
				discountType: formData.discountType,
				discountValue: Number(formData.discountValue),
				minOrderAmount: formData.minOrderAmount
					? Number(formData.minOrderAmount)
					: undefined,
				maxDiscountAmount: formData.maxDiscountAmount
					? Number(formData.maxDiscountAmount)
					: undefined,
				usageLimit: formData.usageLimit
					? Number(formData.usageLimit)
					: undefined,
				expiresAt: formData.expiresAt || undefined,
				isActive: formData.isActive,
				applicableProducts: formData.applicableProducts,
			};

			const url = editingCoupon
				? `${API_URL}/api/admin/coupons/${editingCoupon._id}`
				: `${API_URL}/api/admin/coupons`;
			const method = editingCoupon ? "PATCH" : "POST";

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				throw new Error("Failed to save coupon");
			}

			await fetchData();
			setShowModal(false);
			toast.success(
				editingCoupon
					? "Coupon updated successfully"
					: "Coupon created successfully",
			);
		} catch (error) {
			console.error("Coupon save failed:", error);
			toast.error(
				error instanceof Error ? error.message : "Failed to save coupon",
			);
		} finally {
			setSaving(false);
		}
	};

	const activeCouponsCount = useMemo(
		() => coupons.filter((coupon) => coupon.isActive).length,
		[coupons],
	);

	if (loading) {
		return <AdminTableSkeleton rows={5} cols={6} />;
	}

	const totalPages = Math.ceil(coupons.length / ITEMS_PER_PAGE);
	const paginatedCoupons = coupons.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE,
	);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div>
					<h1 className="text-3xl font-bold">Coupons</h1>
					<p className="text-sm text-gray-500 mt-1">
						{activeCouponsCount} active of {coupons.length} total
					</p>
				</div>
				<Button onClick={openCreateModal}>Create Coupon</Button>
			</div>

			<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-250 divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Code
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Discount
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Minimum Cart
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Usage
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
							{coupons.length === 0 && (
								<tr>
									<td
										colSpan={6}
										className="px-6 py-12 text-center text-gray-500"
									>
										No coupons yet. Click "Create Coupon" to add one.
									</td>
								</tr>
							)}
							{paginatedCoupons.map((coupon) => (
								<tr key={coupon._id}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
										{coupon.code}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
										{coupon.discountType === "PERCENTAGE"
											? `${coupon.discountValue}%`
											: `₹${coupon.discountValue}`}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
										{coupon.minOrderAmount ? `₹${coupon.minOrderAmount}` : "-"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
										{coupon.usedCount}
										{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
												coupon.isActive
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{coupon.isActive ? "Active" : "Inactive"}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
										<button
											type="button"
											onClick={() => openEditModal(coupon)}
											className="text-blue-600 hover:text-blue-900"
										>
											Edit
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{totalPages > 1 && (
				<div className="flex flex-col sm:flex-row items-center justify-between gap-3 border border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
					<p className="text-sm text-gray-700">
						Showing{" "}
						<span className="font-medium">
							{(page - 1) * ITEMS_PER_PAGE + 1}
						</span>
						{" – "}
						<span className="font-medium">
							{Math.min(page * ITEMS_PER_PAGE, coupons.length)}
						</span>{" "}
						of <span className="font-medium">{coupons.length}</span>
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

			{showModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg p-6 w-full max-w-lg">
						<h2 className="text-xl font-bold mb-4">
							{editingCoupon ? "Edit Coupon" : "Create Coupon"}
						</h2>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label
									htmlFor="coupon-code"
									className="block text-sm font-medium text-gray-700"
								>
									Code
								</label>
								<input
									id="coupon-code"
									required
									value={formData.code}
									onChange={(e) =>
										setFormData({
											...formData,
											code: e.target.value.toUpperCase(),
										})
									}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
								/>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="coupon-discount-type"
										className="block text-sm font-medium text-gray-700"
									>
										Discount Type
									</label>
									<select
										id="coupon-discount-type"
										onChange={(e) =>
											setFormData({
												...formData,
												discountType: e.target.value as DiscountType,
											})
										}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
									>
										<option value="PERCENTAGE">Percentage (%)</option>
										<option value="FIXED">Fixed Amount (₹)</option>
									</select>
								</div>
								<div>
									<label
										htmlFor="coupon-discount-value"
										className="block text-sm font-medium text-gray-700"
									>
										Discount Value
									</label>
									<input
										id="coupon-discount-value"
										type="number"
										required
										min={1}
										value={formData.discountValue}
										onChange={(e) =>
											setFormData({
												...formData,
												discountValue: Number(e.target.value),
											})
										}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="coupon-min-order"
										className="block text-sm font-medium text-gray-700"
									>
										Minimum Order Amount
									</label>
									<input
										id="coupon-min-order"
										type="number"
										min={0}
										value={formData.minOrderAmount}
										onChange={(e) =>
											setFormData({
												...formData,
												minOrderAmount: e.target.value,
											})
										}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
									/>
								</div>
								<div>
									<label
										htmlFor="coupon-max-discount"
										className="block text-sm font-medium text-gray-700"
									>
										Maximum Discount
									</label>
									<input
										id="coupon-max-discount"
										type="number"
										min={0}
										value={formData.maxDiscountAmount}
										onChange={(e) =>
											setFormData({
												...formData,
												maxDiscountAmount: e.target.value,
											})
										}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="coupon-products"
									className="block text-sm font-medium text-gray-700"
								>
									Applicable Products (optional)
								</label>
								<select
									id="coupon-products"
									multiple
									value={formData.applicableProducts}
									onChange={(e) => {
										const selected = Array.from(e.target.selectedOptions).map(
											(option) => option.value,
										);
										setFormData({ ...formData, applicableProducts: selected });
									}}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md h-32"
								>
									{products.map((product) => (
										<option key={product._id} value={product._id}>
											{product.name}
										</option>
									))}
								</select>
							</div>

							<div className="flex justify-end gap-3">
								<Button
									type="button"
									variant="outline"
									onClick={() => setShowModal(false)}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={saving}>
									{saving
										? "Saving..."
										: editingCoupon
											? "Update Coupon"
											: "Create Coupon"}
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
