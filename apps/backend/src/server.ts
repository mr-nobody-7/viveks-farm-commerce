import app from "./app";
import { connectToDatabase } from "./db/connect";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
};

startServer();