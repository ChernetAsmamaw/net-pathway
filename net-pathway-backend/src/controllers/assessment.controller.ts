import { Request, Response } from "express";
import mongoose from "mongoose";
import Assessment from "../models/Assessment";

export const assessmentController = {
  // Save behavioral assessment responses
  async saveBehavioralAssessment(req: Request, res: Response) {
    try {
      const { responses } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Create or update assessment
      const assessment = await Assessment.findOneAndUpdate(
        {
          userId,
          type: "behavioral",
        },
        {
          userId,
          type: "behavioral",
          responses,
          completedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      res.status(200).json({
        message: "Assessment saved successfully",
        assessmentId: assessment._id,
      });
    } catch (error: any) {
      console.error("Save assessment error:", error);
      res.status(500).json({
        message: error.message || "Error saving assessment",
      });
    }
  },

  // Get user's behavioral assessment
  async getBehavioralAssessment(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const assessment = await Assessment.findOne({
        userId,
        type: "behavioral",
      });

      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      res.status(200).json({ assessment });
    } catch (error: any) {
      console.error("Get assessment error:", error);
      res.status(500).json({
        message: error.message || "Error retrieving assessment",
      });
    }
  },
};
