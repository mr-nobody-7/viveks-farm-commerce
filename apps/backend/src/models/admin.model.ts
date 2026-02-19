import bcrypt from "bcryptjs";
import mongoose, { type Document, Schema } from "mongoose";

export interface IAdmin extends Document {
	email: string;
	password: string;
	comparePassword: (password: string) => Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

adminSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

adminSchema.methods.comparePassword = function (password: string) {
	return bcrypt.compare(password, this.password);
};

export const Admin =
	mongoose.models.Admin || mongoose.model<IAdmin>("Admin", adminSchema);
