import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/db";
import { userRouter } from "./routes/user.routes";
import { verificationRouter } from "./routes/email.varification.routes";
import { adminRouter } from "./routes/admin.routes";
import { blogRouter } from "./routes/blog.post.routes";
import { mentorRouter } from "./routes/mentor.routes";
import { adminStatisticsRouter } from "./routes/admin.statistics.routes";
import { profileImageRouter } from "./routes/profile.image.routes";
import { discussionRouter } from "./routes/discussion.routes";
import { chatRouter } from "./routes/chat.routes";

// import { assessmentRouter } from "./routes/assessment.routes";
// import { langchainProgramMatchingRouter } from "./routes/langchain.program.matching.routes";

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
// app.use(express.json());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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
app.use("/api/admin/statistics", adminStatisticsRouter);
app.use("/api/profile/image", profileImageRouter);
app.use("/api/discussions", discussionRouter);
app.use("/api/chat", chatRouter);

// app.use("/api/assessment", assessmentRouter);
// app.use("/api/langchain-matching", langchainProgramMatchingRouter);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Net Pathway API", status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});
