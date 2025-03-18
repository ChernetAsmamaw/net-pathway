// net-pathway-backend/src/utils/emailService.ts
import nodemailer from "nodemailer";
import crypto from "crypto";
import VerificationToken from "../models/VerificationToken";

// Configure transporter (use environment variables in production)
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
      // Generate token if not provided (although token is now generated in the controller)
      let token = crypto.randomBytes(32).toString("hex");

      // Verification link
      const verificationLink = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/verify-email?token=${token}`;

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_FROM || "noreply@example.com",
        to: email,
        subject: "Net Pathway - Email Verification",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${
                process.env.FRONTEND_URL || "http://localhost:3000"
              }/logo-large.png" alt="Net Pathway" style="max-width: 200px;">
            </div>
            <h1 style="color: #0369a1; font-size: 24px; margin-bottom: 20px;">Verify Your Email Address</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hello ${username},</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Welcome to Net Pathway! Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #0369a1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email</a>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Or copy and paste this link in your browser:</p>
            <p style="background-color: #f3f4f6; padding: 10px; border-radius: 5px; word-break: break-all;">${verificationLink}</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">This link will expire in 1 hour for security reasons.</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">If you didn't create an account with Net Pathway, please ignore this email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #9ca3af; font-size: 14px; text-align: center;">
              <p>The Net Pathway Team</p>
            </div>
          </div>
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
        subject: "Net Pathway - Password Reset",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${
                process.env.FRONTEND_URL || "http://localhost:3000"
              }/logo-large.png" alt="Net Pathway" style="max-width: 200px;">
            </div>
            <h1 style="color: #0369a1; font-size: 24px; margin-bottom: 20px;">Password Reset</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hello ${username},</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">You requested a password reset. Please click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #0369a1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Or copy and paste this link in your browser:</p>
            <p style="background-color: #f3f4f6; padding: 10px; border-radius: 5px; word-break: break-all;">${resetLink}</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">This link will expire in 1 hour for security reasons.</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">If you didn't request this password reset, please ignore this email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #9ca3af; font-size: 14px; text-align: center;">
              <p>The Net Pathway Team</p>
            </div>
          </div>
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
