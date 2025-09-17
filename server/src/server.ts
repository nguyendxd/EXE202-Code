import app from "./app";
import connectDB from "./config/database";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
