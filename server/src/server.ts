import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/database";
import logger from "./utils/logger";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
