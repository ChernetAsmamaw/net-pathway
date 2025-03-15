import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/db";
import { userRouter } from "./routes/user.routes";
import { verificationRouter } from "./routes/email.varification.routes";
import { adminRouter } from "./routes/admin.routes";
import { blogRouter } from "./routes/blog.post.routes";
import { mentorRouter } from "./routes/mentor.routes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Important for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

// Set cookie parser before routes
app.use(cookieParser());
app.use(express.json());

// Check CORS preflight requests
app.options("*", cors());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDatabase();

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/api/users", userRouter);
app.use("/api/verification", verificationRouter);
app.use("/api/admin", adminRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/mentors", mentorRouter);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Net Pathway API", status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});
