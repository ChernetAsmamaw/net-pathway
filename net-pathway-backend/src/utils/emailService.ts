import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const emailService = {
  async sendVerificationCode(
    userId: string,
    email: string,
    username: string,
    code: string
  ) {
    try {
      // Email content
      const mailOptions = {
        from: process.env.EMAIL_FROM || "noreply@example.com",
        to: email,
        subject: "Net Pathway - Email Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 50px; margin-top: 30px;">
              <img src="https://res.cloudinary.com/datqh1mc9/image/upload/v1742629780/net-pathway/ifjj5fgmufgleyxfh4uk.png" alt="Net Pathway" style="max-width: 200px;">
            </div>
            <h1 style="color: #0369a1; font-size: 24px; margin-bottom: 20px;">Verify Your Email Address</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5; font-weight: bold; ">Hello ${username},</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Welcome to Net Pathway! Please verify your email address by entering the verification code below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #0369a1;">
                ${code}
              </div>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">This code will expire in 1 hour for security reasons.</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">If you didn't create an account with Net Pathway, please ignore this email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #9ca3af; font-size: 14px; text-align: center;">
              <p>Net Pathway 2025</p>
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

  // Keep password reset functionality
  async sendPasswordResetEmail(
    userId: string,
    email: string,
    username: string
  ) {
    // Existing implementation
  },
};
