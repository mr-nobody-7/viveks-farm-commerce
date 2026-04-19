import { Router } from "express";
import { sendEmail } from "../lib/mailer";

const router = Router();

router.post("/", async (req, res) => {
	const { name, email, mobile, message } = req.body as {
		name?: string;
		email?: string;
		mobile?: string;
		message?: string;
	};

	if (!name || !mobile || !message) {
		return res.status(400).json({
			success: false,
			message: "Name, mobile, and message are required",
		});
	}

	const to = process.env.BREVO_SENDER_EMAIL;
	if (!to) {
		return res.status(500).json({
			success: false,
			message: "Contact service is not configured",
		});
	}

	const htmlContent = `
		<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
			<h2 style="margin-bottom: 12px;">New Contact Form Submission</h2>
			<p><strong>Name:</strong> ${name}</p>
			<p><strong>Email:</strong> ${email || "Not provided"}</p>
			<p><strong>Mobile:</strong> ${mobile}</p>
			<p><strong>Message:</strong></p>
			<p style="white-space: pre-wrap;">${message}</p>
		</div>
	`;

	await sendEmail(
		to,
		"New Contact Form Submission - Vivek's Farm",
		htmlContent,
	);

	res.json({ success: true, message: "We'll get back to you soon!" });
});

export default router;
