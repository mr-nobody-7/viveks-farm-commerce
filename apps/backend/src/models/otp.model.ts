import mongoose, { type Document, Schema } from "mongoose";

export interface IOTP extends Document {
	mobile: string;
	otp: string;
	expiresAt: Date;
}

const otpSchema = new Schema<IOTP>({
	mobile: { type: String, required: true },
	otp: { type: String, required: true },
	expiresAt: { type: Date, required: true },
});

export const OTP =
	mongoose.models.OTP || mongoose.model<IOTP>("OTP", otpSchema);
