import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import userManagementRoutes from "./routes/userManagementRoutes";
import petRoutes from "./routes/petRoutes";
import postRoutes from "./routes/postRoutes";
import petWishlistRoutes from "./routes/petWishlistRoutes";
import blogRoutes from "./routes/blogRoutes";
import messageRoutes from "./routes/messageRoutes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/users", userManagementRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/wishlist", petWishlistRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Server is Running!");
});

setupSwagger(app);

export default app;
