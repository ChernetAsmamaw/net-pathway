import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/net-pathway";

// Create a dedicated MongoDB client for better-auth
export const client = new MongoClient(MONGODB_URI);

export const connectDatabase = async () => {
  try {
    await client.connect();
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the process with a non-zero status code
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("❗MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});
