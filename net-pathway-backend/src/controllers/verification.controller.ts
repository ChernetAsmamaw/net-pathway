import { Request, Response } from "express";
import User from "../models/User";
import VerificationToken from "../models/VerificationToken";
import { emailService } from "../utils/emailService";
import crypto from "crypto";

export const verificationController = {
  // Send verification email
  async sendVerificationEmail(req: Request, res: Response) {
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

      // Generate token
      const token = crypto.randomBytes(32).toString("hex");

      // Save token to database
      await VerificationToken.create({
        userId,
        token,
      });

      // Send email
      await emailService.sendVerificationEmail(
        userId,
        user.email,
        user.username
      );

      res.status(200).json({ message: "Verification email sent" });
    } catch (error: any) {
      console.error("Send verification email error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error sending verification email" });
    }
  },

  // Verify email with token
  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.params;

      // Find token in database
      const verificationToken = await VerificationToken.findOne({ token });
      if (!verificationToken) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Find and update user
      const user = await User.findById(verificationToken.userId);
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

  // Check verification status (useful for polling)
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
