import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`);
});
