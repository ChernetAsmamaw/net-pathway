import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const adminController = {
  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.find().select("-password");
      res.status(200).json({ users });
    } catch (error: any) {
      console.error("Get all users error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving users" });
    }
  },

  // Create admin user
  async createAdmin(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
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

  // Delete user (hard delete)
  async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: error.message || "Error deleting user" });
    }
  },
};
