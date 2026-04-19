import "dotenv/config";
import app from "./app";
import { connectToDatabase } from "./db/connect";

const PORT = process.env.PORT || 4000;
const DB_RETRY_INTERVAL_MS = 5000;

const startServer = async () => {
	app.listen(PORT, () => {
		console.log(`Backend running on http://localhost:${PORT}`);
	});

	const connectWithRetry = async () => {
		try {
			await connectToDatabase();
		} catch {
			console.error(
				`Retrying database connection in ${DB_RETRY_INTERVAL_MS / 1000}s...`,
			);
			setTimeout(() => {
				void connectWithRetry();
			}, DB_RETRY_INTERVAL_MS);
		}
	};

	await connectWithRetry();
};

startServer();
