import mongoose, { type Document, Schema } from "mongoose";

export interface ISavedAddress {
	fullName: string;
	phone: string;
	addressLine: string;
	city: string;
	state: string;
	pincode: string;
}

export interface IUser extends Document {
	mobile: string;
	name?: string;
	role: "customer";
	savedAddress?: ISavedAddress;
}

const savedAddressSchema = new Schema<ISavedAddress>(
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

const userSchema = new Schema<IUser>(
	{
		mobile: {
			type: String,
			required: true,
			unique: true,
		},
		name: String,
		role: {
			type: String,
			default: "customer",
		},
		savedAddress: savedAddressSchema,
	},
	{ timestamps: true },
);

export const User =
	mongoose.models.User || mongoose.model<IUser>("User", userSchema);
