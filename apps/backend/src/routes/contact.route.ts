import { Router } from "express";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { sendEmail } from "../lib/mailer";

const router = Router();

const contactSchema = z.object({
	name: z.string().min(1, "Name is required").max(100),
	email: z.string().email("Invalid email").optional().or(z.literal("")),
	mobile: z.string().regex(/^\d{10}$/, "Mobile must be 10 digits"),
	message: z.string().min(1, "Message is required").max(2000),
});

const sanitize = (str: string) =>
	sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} });

router.post("/", async (req, res) => {
	const result = contactSchema.safeParse(req.body);
	if (!result.success) {
		return res.status(400).json({
			success: false,
			message: result.error.issues[0]?.message ?? "Invalid input",
		});
	}

	const name = sanitize(result.data.name);
	const email = sanitize(result.data.email ?? "");
	const mobile = sanitize(result.data.mobile);
	const message = sanitize(result.data.message);

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
