import nodemailer from "nodemailer";
import crypto from "crypto";
import VerificationToken from "../models/VerificationToken";

// Configure transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const emailService = {
  async sendVerificationEmail(userId: string, email: string, username: string) {
    try {
      // Generate token
      const token = crypto.randomBytes(32).toString("hex");

      // Save token to database
      await VerificationToken.create({
        userId,
        token,
      });

      // Verification link
      const verificationLink = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/verify-email?token=${token}`;

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_FROM || "noreply@example.com",
        to: email,
        subject: "Email Verification",
        html: `
          <h1>Email Verification</h1>
          <p>Hello ${username},</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>This link will expire in 1 hour.</p>
        `,
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  },

  async sendPasswordResetEmail(
    userId: string,
    email: string,
    username: string
  ) {
    try {
      // Generate token
      const token = crypto.randomBytes(32).toString("hex");

      // Save token to database
      await VerificationToken.create({
        userId,
        token,
      });

      // Reset link
      const resetLink = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/reset-password?token=${token}`;

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_FROM || "noreply@example.com",
        to: email,
        subject: "Password Reset",
        html: `
          <h1>Password Reset</h1>
          <p>Hello ${username},</p>
          <p>You requested a password reset. Please click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  },
};
