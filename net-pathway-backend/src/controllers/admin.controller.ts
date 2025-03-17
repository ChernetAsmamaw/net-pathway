import { Request, Response } from "express";
import User from "../models/User";
import Mentor from "../models/Mentor";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Allowed email domains for admin creation
const ALLOWED_ADMIN_DOMAINS =
  process.env.ALLOWED_ADMIN_DOMAINS?.split(",") || [];

export const adminController = {
  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = (req.query.search as string) || "";

      // Create search filter
      const searchFilter = search
        ? {
            $or: [
              { username: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      const users = await User.find(searchFilter)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(searchFilter);

      res.status(200).json({
        users,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error("Get all users error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving users" });
    }
  },

  // Get single user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
    } catch (error: any) {
      console.error("Get user error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving user" });
    }
  },

  // Create admin user with domain restriction
  async createAdmin(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check email domain
      const emailDomain = email.split("@")[1]?.toLowerCase();
      if (!emailDomain || !ALLOWED_ADMIN_DOMAINS.includes(emailDomain)) {
        return res.status(403).json({
          message: "Only authorized email domains can create admin accounts",
        });
      }

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          message:
            existingUser.email === email
              ? "Email already in use"
              : "Username already taken",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin user
      const adminUser = await User.create({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "admin",
        isActive: true,
        isEmailVerified: true, // Admins are verified by default
      });

      res.status(201).json({
        message: "Admin user created successfully",
        user: {
          id: adminUser._id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
    } catch (error: any) {
      console.error("Create admin error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error creating admin user" });
    }
  },

  // Update user role
  async updateUserRole(req: Request, res: Response) {
    try {
      const { userId, role } = req.body;

      if (!userId || !role) {
        return res
          .status(400)
          .json({ message: "User ID and role are required" });
      }

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      // Validate role
      if (!["user", "admin", "mentor"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Update user role
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User role updated successfully",
        user: updatedUser,
      });
    } catch (error: any) {
      console.error("Update user role error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error updating user role" });
    }
  },

  // Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      // Validate userId
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // First check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If user is a mentor, delete mentor profile first
      if (user.role === "mentor") {
        const mentorProfile = await Mentor.findOne({ user: userId });
        if (mentorProfile) {
          await Mentor.findByIdAndDelete(mentorProfile._id);
        }
      }

      // Now delete the user
      await User.findByIdAndDelete(userId);

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: error.message || "Error deleting user" });
    }
  },
};
