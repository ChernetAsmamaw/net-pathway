import { Request, Response } from "express";
import User from "../models/User";
import VerificationToken from "../models/VerificationToken";
import { emailService } from "../utils/emailService";

export const verificationController = {
  // Send verification code
  async sendVerificationCode(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if already verified
      if (user.isEmailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      // Delete any existing tokens for this user
      await VerificationToken.deleteMany({ userId });

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Save code to database
      await VerificationToken.create({
        userId,
        token: code,
      });

      // Send email with code
      await emailService.sendVerificationCode(
        userId,
        user.email,
        user.username,
        code
      );

      res.status(200).json({ message: "Verification code sent" });
    } catch (error: any) {
      console.error("Send verification code error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error sending verification code" });
    }
  },

  // Verify email with code
  async verifyCode(req: Request, res: Response) {
    try {
      const { code } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!code) {
        return res
          .status(400)
          .json({ message: "Verification code is required" });
      }

      // Find token in database
      const verificationToken = await VerificationToken.findOne({
        userId,
        token: code,
      });

      if (!verificationToken) {
        return res.status(400).json({ message: "Invalid or expired code" });
      }

      // Find and update user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Mark email as verified
      user.isEmailVerified = true;
      await user.save();

      // Delete the token
      await VerificationToken.deleteOne({ _id: verificationToken._id });

      res.status(200).json({
        message: "Email verified successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isEmailVerified: true,
          profilePicture: user.profilePicture || null,
        },
      });
    } catch (error: any) {
      console.error("Email verification error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error verifying email" });
    }
  },

  // Check verification status
  async checkVerificationStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        isVerified: user.isEmailVerified,
      });
    } catch (error: any) {
      console.error("Check verification status error:", error);
      res.status(500).json({
        message: error.message || "Error checking verification status",
      });
    }
  },
};
