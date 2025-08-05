import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/lib/db.js";
dotenv.config();
import authRoutes from "./src/routes/authRoute.js";
import userRoutes from "./src/routes/userRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5001;

connectDB();

app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`);
});
