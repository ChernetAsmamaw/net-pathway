// src/controllers/mentor.controller.ts

import { Request, Response } from "express";
import Mentor from "../models/Mentor";
import User from "../models/User";
import mongoose from "mongoose";

// Define interface for the mentor data to fix type errors
interface MentorData {
  _id?: mongoose.Types.ObjectId | string; // Accept both ObjectId and string
  user: mongoose.Types.ObjectId | string;
  title: string;
  company: string;
  location: string;
  bio: string;
  expertise?: string[];
  experience: string;
  education: string;
  languages?: string[];
  achievements?: string[];
  availability?: string;
  isActive?: boolean;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any; // Allow for additional properties
}

export const mentorController = {
  // Create a new mentor profile
  async createMentor(req: Request, res: Response) {
    try {
      const {
        userId,
        title,
        company,
        location,
        bio,
        expertise, // Array of strings
        experience,
        education,
        languages, // Array of strings
        achievements, // Array of strings
        availability,
      } = req.body;

      // Check if userId is provided for admin creating mentor
      const targetUserId = userId || req.user?.userId;

      if (!targetUserId) {
        return res.status(400).json({ message: "User ID is required" });
      }

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
      // Ensure arrays are properly initialized even if they come in as null or undefined
      const newMentor = await Mentor.create({
        user: targetUserId,
        title,
        company,
        location,
        bio,
        expertise: Array.isArray(expertise) ? expertise : [], // Ensure it's an array
        experience,
        education,
        languages: Array.isArray(languages) ? languages : [], // Ensure it's an array
        achievements: Array.isArray(achievements) ? achievements : [], // Ensure it's an array
        availability: availability || "available",
      });

      res.status(201).json({
        message: "Mentor profile created successfully",
        mentor: newMentor,
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

      // Filter options
      const filterOptions: any = { isActive: true };

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

      // For each mentor, ensure arrays are properly formatted before sending to client
      const formattedMentors = mentors.map((mentor) => {
        // First convert to unknown, then to our interface to bypass type checking
        const mentorObj = mentor.toObject() as unknown as MentorData;
        return {
          ...mentorObj,
          expertise: Array.isArray(mentorObj.expertise)
            ? mentorObj.expertise
            : [],
          languages: Array.isArray(mentorObj.languages)
            ? mentorObj.languages
            : [],
          achievements: Array.isArray(mentorObj.achievements)
            ? mentorObj.achievements
            : [],
        };
      });

      res.status(200).json({
        mentors: formattedMentors,
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

      const mentor = await Mentor.findById(mentorId).populate(
        "user",
        "username email profilePicture isEmailVerified"
      );

      if (!mentor) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      // Ensure arrays are properly formatted before sending to client
      // First convert to unknown, then to our interface to bypass type checking
      const mentorData = mentor.toObject() as unknown as MentorData;
      const formattedMentor = {
        ...mentorData,
        expertise: Array.isArray(mentorData.expertise)
          ? mentorData.expertise
          : [],
        languages: Array.isArray(mentorData.languages)
          ? mentorData.languages
          : [],
        achievements: Array.isArray(mentorData.achievements)
          ? mentorData.achievements
          : [],
      };

      res.status(200).json({ mentor: formattedMentor });
    } catch (error: any) {
      console.error("Get mentor error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving mentor" });
    }
  },

  // Updated updateMentor method that properly persists arrays to the database

  async updateMentor(req: Request, res: Response) {
    try {
      const { mentorId } = req.params;
      const updateData = req.body;

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

      // Update fields (excluding user field)
      delete updateData.user;

      // IMPORTANT: Directly set array fields to ensure they persist
      // This is crucial for arrays to be properly saved

      // Handle expertise array
      if (updateData.expertise !== undefined) {
        // Ensure it's an array
        const expertiseArray = Array.isArray(updateData.expertise)
          ? updateData.expertise
          : [];

        // Set it directly - this is important!
        mentor.expertise = expertiseArray;
      }

      // Handle languages array
      if (updateData.languages !== undefined) {
        // Ensure it's an array
        const languagesArray = Array.isArray(updateData.languages)
          ? updateData.languages
          : [];

        // Set it directly - this is important!
        mentor.languages = languagesArray;
      }

      // Handle achievements array
      if (updateData.achievements !== undefined) {
        // Ensure it's an array
        const achievementsArray = Array.isArray(updateData.achievements)
          ? updateData.achievements
          : [];

        // Set it directly - this is important!
        mentor.achievements = achievementsArray;
      }

      // Update other non-array fields
      if (updateData.title) mentor.title = updateData.title;
      if (updateData.company) mentor.company = updateData.company;
      if (updateData.location) mentor.location = updateData.location;
      if (updateData.bio) mentor.bio = updateData.bio;
      if (updateData.experience) mentor.experience = updateData.experience;
      if (updateData.education) mentor.education = updateData.education;
      if (updateData.availability)
        mentor.availability = updateData.availability;

      // Save the updated mentor
      await mentor.save();

      // Populate user data
      await mentor.populate(
        "user",
        "username email profilePicture isEmailVerified"
      );

      // Format the response to ensure arrays are properly handled
      const mentorData = mentor.toObject() as unknown as MentorData;
      const formattedMentor = {
        ...mentorData,
        expertise: Array.isArray(mentorData.expertise)
          ? mentorData.expertise
          : [],
        languages: Array.isArray(mentorData.languages)
          ? mentorData.languages
          : [],
        achievements: Array.isArray(mentorData.achievements)
          ? mentorData.achievements
          : [],
      };

      res.status(200).json({
        message: "Mentor profile updated successfully",
        mentor: formattedMentor,
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

      await Mentor.deleteOne({ _id: mentorId });

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

      // Ensure arrays are properly formatted before sending to client
      // First convert to unknown, then to our interface to bypass type checking
      const mentorData = mentor.toObject() as unknown as MentorData;
      const formattedMentor = {
        ...mentorData,
        expertise: Array.isArray(mentorData.expertise)
          ? mentorData.expertise
          : [],
        languages: Array.isArray(mentorData.languages)
          ? mentorData.languages
          : [],
        achievements: Array.isArray(mentorData.achievements)
          ? mentorData.achievements
          : [],
      };

      res.status(200).json({ mentor: formattedMentor });
    } catch (error: any) {
      console.error("Get current mentor profile error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving mentor profile" });
    }
  },
};
