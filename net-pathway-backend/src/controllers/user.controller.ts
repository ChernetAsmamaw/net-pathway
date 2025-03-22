import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const userController = {
  // Refresh token
  async refreshToken(req: Request, res: Response) {
    try {
      // Get the current token from cookies
      const currentToken = req.cookies.token;

      if (!currentToken) {
        return res.status(401).json({ message: "No token found" });
      }

      // Verify the current token
      let decoded;
      try {
        decoded = jwt.verify(currentToken, process.env.JWT_SECRET!) as {
          userId: string;
          role: string;
        };
      } catch (err) {
        // If token is expired or invalid, return 401
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      // Get user from database to ensure they still exist and are active
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "User not found or inactive" });
      }

      // Generate a new token
      const newToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "48h" }
      );

      // Set the new token as a cookie
      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });

      // Return success with token
      return res.status(200).json({
        message: "Token refreshed",
        token: newToken,
      });
    } catch (error: any) {
      console.error("Token refresh error:", error);
      return res.status(500).json({ message: "Error refreshing token" });
    }
  },

  // Check for admin domain during regular signup
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

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

      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if email domain is in the allowed admin domains
      const emailDomain = email.split("@")[1]?.toLowerCase();
      const ALLOWED_ADMIN_DOMAINS =
        process.env.ALLOWED_ADMIN_DOMAINS?.split(",") || [];
      const isAdminDomain =
        emailDomain && ALLOWED_ADMIN_DOMAINS.includes(emailDomain);

      // Assign role based on email domain
      const role = isAdminDomain ? "admin" : "user";

      const user = await User.create({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        isActive: true,
        isEmailVerified: false,
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "48h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });

      res.status(201).json({
        message: `User created successfully${
          isAdminDomain ? " with admin privileges" : ""
        }`,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message || "Error creating user" });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await User.findOne({
        email: email.toLowerCase(),
        isActive: true,
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.password || ""
      );
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "48h" }
      );

      // Set more permissive cookie settings for development
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only secure in production
        sameSite: "lax", // Changed from 'strict' to 'lax'
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });

      // Return user data without sensitive information
      const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || null,
        isEmailVerified: user.isEmailVerified || false,
      };

      res.status(200).json({
        message: "Login successful",
        token,
        user: userData,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: error.message || "Error logging in" });
    }
  },

  // Logout by clearing the token cookie
  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("token");
      res.json({ message: "Logout successful" });
    } catch (error: any) {
      console.error("Logout error:", error);
      res.status(500).json({ message: error.message || "Error logging out" });
    }
  },

  // Get user profile
  async getProfile(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user?.userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (error: any) {
      console.error("Profile error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving profile" });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const { username, email } = req.body;
      const userId = req.user?.userId;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          username,
          email,
          updatedAt: new Date(),
        },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error: any) {
      console.error("Update error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error updating profile" });
    }
  },

  async deleteAccount(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      const deletedUser = await User.findByIdAndUpdate(
        userId,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Account deactivated successfully" });
    } catch (error: any) {
      console.error("Delete error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error deleting account" });
    }
  },
};
