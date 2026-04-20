import mongoose, { type Document, Schema } from "mongoose";

export interface IAppConfig extends Document {
	key: "default";
	allowCOD: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const appConfigSchema = new Schema<IAppConfig>(
	{
		key: {
			type: String,
			enum: ["default"],
			required: true,
			default: "default",
			unique: true,
		},
		allowCOD: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

export const AppConfig =
	mongoose.models.AppConfig ||
	mongoose.model<IAppConfig>("AppConfig", appConfigSchema);

export const getOrCreateAppConfig = () =>
	AppConfig.findOneAndUpdate(
		{ key: "default" },
		{ $setOnInsert: { key: "default", allowCOD: true } },
		{ new: true, upsert: true, setDefaultsOnInsert: true },
	);
