// net-pathway-backend/src/controllers/profile.image.controller.ts
import { Request, Response } from "express";
import User from "../models/User";
import cloudinaryService from "../utils/cloudinaryService";

// Extend Express Request to include file from multer
declare module "express" {
  interface Request {
    file?: Express.Multer.File;
  }
}

export const profileImageController = {
  // Upload profile image
  async uploadProfileImage(req: Request, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Check if file exists in request
      if (!req.file && !req.body.image) {
        return res.status(400).json({ message: "No image provided" });
      }

      // Find user
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let imageData: string | Buffer;

      // Handle base64 image data from request body
      if (req.body.image) {
        imageData = req.body.image;
      }
      // Handle file upload via multer
      else if (req.file) {
        imageData = req.file.buffer;
      } else {
        return res.status(400).json({ message: "Invalid image format" });
      }

      // Generate a unique public_id for the image
      const publicId = `profile_${req.user.userId}_${Date.now()}`;

      // Upload to Cloudinary
      const uploadResult = await cloudinaryService.uploadImage(imageData, {
        public_id: publicId,
        folder: "net-pathway/profiles",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
        ],
      });

      // If user had a previous profile image, delete it
      if (user.profilePicture && user.profilePicture.includes("cloudinary")) {
        try {
          // Extract public_id from URL or stored value
          const oldPublicId = extractPublicId(user.profilePicture);
          if (oldPublicId) {
            await cloudinaryService.deleteImage(oldPublicId);
          }
        } catch (error) {
          console.error("Error deleting old profile image", error);
          // Continue even if deletion fails
        }
      }

      // Update user profile picture URL
      user.profilePicture = uploadResult.url;
      await user.save();

      res.status(200).json({
        message: "Profile image updated successfully",
        imageUrl: uploadResult.url,
      });
    } catch (error: any) {
      console.error("Upload profile image error:", error);
      res.status(500).json({
        message: error.message || "Error uploading profile image",
      });
    }
  },

  // Delete profile image
  async deleteProfileImage(req: Request, res: Response) {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Find user
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // If user has a profile image
      if (user.profilePicture && user.profilePicture.includes("cloudinary")) {
        // Extract public_id from URL
        const publicId = extractPublicId(user.profilePicture);
        if (publicId) {
          await cloudinaryService.deleteImage(publicId);
        }
      }

      // Reset user profile picture
      user.profilePicture = "";
      await user.save();

      res.status(200).json({
        message: "Profile image deleted successfully",
      });
    } catch (error: any) {
      console.error("Delete profile image error:", error);
      res.status(500).json({
        message: error.message || "Error deleting profile image",
      });
    }
  },
};

// Helper function to extract public_id from Cloudinary URL
function extractPublicId(url: string): string | null {
  try {
    // Example: https://res.cloudinary.com/datqh1mc9/image/upload/v1638123456/net-pathway/profiles/profile_123456789
    const regex = /\/v\d+\/(.+?)(?:\.[^.]+)?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
}
