import * as brevo from "@getbrevo/brevo";

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
		const apiInstance = new brevo.TransactionalEmailsApi();
		apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

		const email = new brevo.SendSmtpEmail();
		email.subject = subject;
		email.htmlContent = htmlContent;
		email.sender = {
			email: senderEmail,
			name: senderName,
		};
		email.to = [{ email: to }];

		await apiInstance.sendTransacEmail(email);
	} catch (error) {
		console.error("Failed to send email via Brevo:", error);
	}
};
