import mongoose, { type Document, Schema, type Types } from "mongoose";

export interface ICoupon extends Document {
	code: string;
	description?: string;
	discountType: "PERCENTAGE" | "FIXED";
	discountValue: number;
	minOrderAmount?: number;
	maxDiscountAmount?: number;
	applicableProducts: Types.ObjectId[];
	isActive: boolean;
	expiresAt?: Date;
	usageLimit?: number;
	usedCount: number;
	createdAt: Date;
}

const couponSchema = new Schema<ICoupon>(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true,
		},
		description: { type: String },
		discountType: {
			type: String,
			enum: ["PERCENTAGE", "FIXED"],
			required: true,
		},
		discountValue: {
			type: Number,
			required: true,
			min: 0,
		},
		minOrderAmount: {
			type: Number,
			min: 0,
		},
		maxDiscountAmount: {
			type: Number,
			min: 0,
		},
		applicableProducts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		isActive: {
			type: Boolean,
			default: true,
		},
		expiresAt: {
			type: Date,
		},
		usageLimit: {
			type: Number,
			min: 1,
		},
		usedCount: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{ timestamps: { createdAt: true, updatedAt: true } },
);

export const Coupon =
	mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", couponSchema);
