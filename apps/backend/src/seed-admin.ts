import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Admin } from "./models/admin.model";

const ADMIN_EMAIL = "vivekanandagodi@gmail.com";
const ADMIN_PASSWORD = "Vivek.734@farm";

const seedAdmin = async () => {
	const mongoUri = process.env.MONGODB_URI;

	if (!mongoUri) {
		console.error("MONGODB_URI is not set");
		process.exit(1);
	}

	try {
		await mongoose.connect(mongoUri);

		const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL }).lean();

		if (existingAdmin) {
			console.log("Admin already exists");
			return;
		}

		const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
		await Admin.insertMany([
			{
				email: ADMIN_EMAIL,
				password: hashedPassword,
			},
		]);

		console.log("Admin created successfully");
	} catch (error) {
		console.error("Failed to seed admin:", error);
		process.exitCode = 1;
	} finally {
		await mongoose.disconnect();
	}
};

void seedAdmin();
