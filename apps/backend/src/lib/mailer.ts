export const sendEmail = async (
	to: string,
	subject: string,
	htmlContent: string,
): Promise<void> => {
	const apiKey = process.env.BREVO_API_KEY;
	const senderEmail = process.env.BREVO_SENDER_EMAIL;
	const senderName = process.env.BREVO_SENDER_NAME || "Vivek's Farm";

	if (!apiKey || !senderEmail) {
		console.error("Brevo mailer is not configured (missing API key or sender email)");
		return;
	}

	try {
		const response = await fetch("https://api.brevo.com/v3/smtp/email", {
			method: "POST",
			headers: {
				accept: "application/json",
				"api-key": apiKey,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				sender: {
					email: senderEmail,
					name: senderName,
				},
				to: [{ email: to }],
				subject,
				htmlContent,
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Failed to send email via Brevo:", errorText);
		}
	} catch (error) {
		console.error("Failed to send email via Brevo:", error);
	}
};
