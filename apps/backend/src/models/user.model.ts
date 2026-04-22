import mongoose, { type Document, Schema } from "mongoose";

export interface ISavedAddress {
	_id?: string;
	label?: string;
	fullName: string;
	phone: string;
	addressLine: string;
	city: string;
	state: string;
	pincode: string;
	isDefault: boolean;
}

export interface IUser extends Document {
	mobile: string;
	name?: string;
	role: "customer";
	addresses: ISavedAddress[];
}

const savedAddressSchema = new Schema<ISavedAddress>({
	label: String,
	fullName: String,
	phone: String,
	addressLine: String,
	city: String,
	state: String,
	pincode: String,
	isDefault: { type: Boolean, default: false },
});

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
		addresses: [savedAddressSchema],
	},
	{ timestamps: true },
);

export const User =
	mongoose.models.User || mongoose.model<IUser>("User", userSchema);
