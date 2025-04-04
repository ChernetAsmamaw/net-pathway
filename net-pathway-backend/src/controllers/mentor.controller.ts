import { Request, Response } from "express";
import Mentor from "../models/Mentor";
import User from "../models/User";
import mongoose from "mongoose";

export const mentorController = {
  // Create a new mentor profile
  async createMentor(req: Request, res: Response) {
    try {
      const {
        userId, // For admin creating mentor
        title,
        company,
        location,
        bio,
        expertise,
        experience,
        education,
        languages,
        achievements,
        availability,
        email,
        phone,
      } = req.body;

      // Check if userId is provided for admin or use current user's ID
      const targetUserId = userId || req.user?.userId;

      if (!targetUserId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      console.log("Creating mentor for userId:", targetUserId);

      // Check required fields
      if (
        !title ||
        !company ||
        !location ||
        !bio ||
        !experience ||
        !education
      ) {
        return res.status(400).json({
          message:
            "Title, company, location, bio, experience, and education are required",
        });
      }

      // Check if user exists
      const user = await User.findById(targetUserId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if mentor profile already exists
      const existingMentor = await Mentor.findOne({ user: targetUserId });
      if (existingMentor) {
        return res
          .status(400)
          .json({ message: "Mentor profile already exists for this user" });
      }

      // Update user role to mentor if needed
      if (user.role !== "mentor") {
        user.role = "mentor";
        await user.save();
      }

      // Create mentor profile
      const newMentor = await Mentor.create({
        user: targetUserId,
        title,
        company,
        location,
        bio,
        expertise: expertise || [],
        experience,
        education,
        languages: languages || [],
        achievements: achievements || [],
        availability: availability || "available",
        email: email || user.email,
        phone: phone || "",
      });

      // Populate the user data in the response
      const populatedMentor = await Mentor.findById(newMentor._id).populate(
        "user",
        "username email profilePicture isEmailVerified"
      );

      res.status(201).json({
        message: "Mentor profile created successfully",
        mentor: populatedMentor,
      });
    } catch (error: any) {
      console.error("Create mentor error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error creating mentor profile" });
    }
  },

  // Get all active mentors
  async getAllMentors(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const includeInactive = req.query.includeInactive === "true";

      // Filter options
      const filterOptions: any = {};

      // Only filter by active status if we're not explicitly including inactive
      if (!includeInactive) {
        filterOptions.isActive = true;
      }

      // Apply expertise filter if provided
      if (req.query.expertise) {
        filterOptions.expertise = { $in: [req.query.expertise] };
      }

      // Apply availability filter if provided
      if (req.query.availability) {
        filterOptions.availability = req.query.availability;
      }

      const mentors = await Mentor.find(filterOptions)
        .sort({ rating: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username email profilePicture isEmailVerified");

      const total = await Mentor.countDocuments(filterOptions);

      res.status(200).json({
        mentors,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error("Get mentors error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving mentors" });
    }
  },

  // Get mentor by ID
  async getMentorById(req: Request, res: Response) {
    try {
      const { mentorId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        return res.status(400).json({ message: "Invalid mentor ID format" });
      }

      const mentor = await Mentor.findById(mentorId).populate(
        "user",
        "username email profilePicture isEmailVerified"
      );

      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      res.status(200).json({ mentor });
    } catch (error: any) {
      console.error("Get mentor error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving mentor" });
    }
  },

  // Update mentor profile
  async updateMentor(req: Request, res: Response) {
    try {
      const { mentorId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        return res.status(400).json({ message: "Invalid mentor ID format" });
      }

      const updateData = req.body;

      // Exclude user field for security
      delete updateData.user;

      // Find mentor
      const mentor = await Mentor.findById(mentorId);

      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      // Check ownership or admin status
      if (
        mentor.user.toString() !== req.user?.userId &&
        req.user?.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this profile" });
      }

      // Update the mentor with all fields at once
      const updatedMentor = await Mentor.findByIdAndUpdate(
        mentorId,
        { $set: updateData },
        { new: true }
      ).populate("user", "username email profilePicture isEmailVerified");

      if (!updatedMentor) {
        return res.status(500).json({ message: "Failed to update mentor" });
      }

      res.status(200).json({
        message: "Mentor profile updated successfully",
        mentor: updatedMentor,
      });
    } catch (error: any) {
      console.error("Update mentor error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error updating mentor profile" });
    }
  },

  // Delete mentor profile
  async deleteMentor(req: Request, res: Response) {
    try {
      const { mentorId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        return res.status(400).json({ message: "Invalid mentor ID format" });
      }

      const mentor = await Mentor.findById(mentorId);

      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      // Check admin status
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Find the user and update role back to user
      const user = await User.findById(mentor.user);
      if (user && user.role === "mentor") {
        user.role = "user";
        await user.save();
      }

      await Mentor.findByIdAndDelete(mentorId);

      res.status(200).json({ message: "Mentor profile deleted successfully" });
    } catch (error: any) {
      console.error("Delete mentor error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error deleting mentor profile" });
    }
  },

  // Toggle mentor active status
  async toggleMentorStatus(req: Request, res: Response) {
    try {
      const { mentorId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        return res.status(400).json({ message: "Invalid mentor ID format" });
      }

      const mentor = await Mentor.findById(mentorId);

      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      // Check ownership or admin status
      if (
        mentor.user.toString() !== req.user?.userId &&
        req.user?.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this profile" });
      }

      // Toggle status
      mentor.isActive = !mentor.isActive;
      await mentor.save();

      res.status(200).json({
        message: `Mentor profile ${
          mentor.isActive ? "activated" : "deactivated"
        } successfully`,
        status: mentor.isActive,
      });
    } catch (error: any) {
      console.error("Toggle mentor status error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error updating mentor status" });
    }
  },

  // Get mentor profile for logged in user
  async getCurrentMentorProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const mentor = await Mentor.findOne({ user: userId }).populate(
        "user",
        "username email profilePicture isEmailVerified"
      );

      if (!mentor) {
        return res.status(404).json({ message: "Mentor profile not found" });
      }

      res.status(200).json({ mentor });
    } catch (error: any) {
      console.error("Get current mentor profile error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving mentor profile" });
    }
  },
};
