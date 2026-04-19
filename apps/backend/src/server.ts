import "dotenv/config";
import app from "./app";
import { connectToDatabase } from "./db/connect";

const PORT = process.env.PORT || 4000;
const DB_RETRY_INTERVAL_MS = 5000;

const startServer = async () => {
	while (true) {
		try {
			await connectToDatabase();
			break;
		} catch {
			console.error(
				`Retrying database connection in ${DB_RETRY_INTERVAL_MS / 1000}s...`,
			);
			await new Promise((resolve) => {
				setTimeout(resolve, DB_RETRY_INTERVAL_MS);
			});
		}
	}

	app.listen(PORT, () => {
		console.log(`Backend running on http://localhost:${PORT}`);
	});
};

startServer();
