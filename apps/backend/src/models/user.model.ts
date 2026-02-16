import mongoose, { type Document, Schema } from "mongoose";

export interface IUser extends Document {
	mobile: string;
	name?: string;
	role: "customer";
}

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
	},
	{ timestamps: true },
);

export const User =
	mongoose.models.User || mongoose.model<IUser>("User", userSchema);
