import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/db";
import { userRouter } from "./routes/user.routes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDatabase();

// Routes
app.use("/api/users", userRouter);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Net Pathway API", status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});
