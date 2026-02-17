import mongoose, { type Document, Schema, type Types } from "mongoose";

export interface IOrderItem {
	productId: Types.ObjectId;
	name: string;
	image: string;
	variantLabel: string;
	price: number;
	quantity: number;
}

export interface IAddress {
	fullName: string;
	phone: string;
	addressLine: string;
	city: string;
	state: string;
	pincode: string;
}

export interface IOrder extends Document {
	user: Types.ObjectId;
	items: IOrderItem[];
	totalAmount: number;
	address: IAddress;
	status: "PLACED" | "PACKED" | "SHIPPED" | "DELIVERED";
	paymentMethod: "ONLINE" | "COD";
	paymentStatus: "PENDING" | "PAID" | "FAILED";
	razorpayOrderId?: string;
	razorpayPaymentId?: string;
	createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
	{
		productId: { type: Schema.Types.ObjectId, required: true },
		name: { type: String, required: true },
		image: { type: String },
		variantLabel: { type: String, required: true },
		price: { type: Number, required: true },
		quantity: { type: Number, required: true },
	},
	{ _id: false },
);

const addressSchema = new Schema<IAddress>(
	{
		fullName: String,
		phone: String,
		addressLine: String,
		city: String,
		state: String,
		pincode: String,
	},
	{ _id: false },
);

const orderSchema = new Schema<IOrder>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		items: [orderItemSchema],
		totalAmount: { type: Number, required: true },
		address: addressSchema,
		status: {
			type: String,
			enum: ["PLACED", "PACKED", "SHIPPED", "DELIVERED"],
			default: "PLACED",
		},
		paymentMethod: {
			type: String,
			enum: ["ONLINE", "COD"],
			required: true,
		},
		paymentStatus: {
			type: String,
			enum: ["PENDING", "PAID", "FAILED"],
			default: "PENDING",
		},
		razorpayOrderId: String,
		razorpayPaymentId: String,
	},
	{ timestamps: true },
);

export const Order =
	mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
