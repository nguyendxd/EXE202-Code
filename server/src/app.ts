import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import userManagementRoutes from "./routes/userManagementRoutes";
import petRoutes from "./routes/petRoutes";
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/users", userManagementRoutes);
app.use("/api/pets", petRoutes); 

app.get("/", (req, res) => {
  res.send("Server is Running!");
});

setupSwagger(app);

export default app;
