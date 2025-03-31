// net-pathway-backend/src/controllers/unified.assessment.controller.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Assessment from "../models/Assessment";
import User from "../models/User";

// Define proper TypeScript interfaces
interface Subject {
  name: string;
  percentage: number;
}

interface Activity {
  name: string;
  position: string;
  description: string;
}

interface Course {
  name: string;
  grade: string;
  score: number;
  credits: number;
}

interface Extracurricular {
  name: string;
  role: string;
  description: string;
}

interface TranscriptData {
  courses: Course[];
  gpa: number;
  strengths: string[];
  extracurriculars: Extracurricular[];
}

interface AssessmentResults {
  riasec?: Record<string, number>;
  multiple_intelligence?: Record<string, number>;
  career_anchors?: Record<string, number>;
  work_dimensions?: Record<string, number>;
}

interface AssessmentStatus {
  transcript?: boolean;
  extracurricular?: boolean;
  behavioral?: boolean;
}

interface UserDocument extends mongoose.Document {
  assessmentStatus?: AssessmentStatus;
}

export const unifiedAssessmentController = {
  // Save academic transcript data
  async saveAcademicTranscript(req: Request, res: Response) {
    try {
      const { subjects, gpa } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ message: "Subject data is required" });
      }

      if (typeof gpa !== "number" || gpa < 0 || gpa > 4) {
        return res
          .status(400)
          .json({ message: "Valid GPA between 0-4 is required" });
      }

      // Transform the data to match the expected schema
      const transcriptData: TranscriptData = {
        courses: subjects.map((subject: Subject) => ({
          name: subject.name,
          grade: "", // Not using letter grades directly
          score: subject.percentage,
          credits: 1, // Default value since we don't collect credits
        })),
        gpa,
        strengths: calculateStrengthAreas(subjects),
        extracurriculars: [], // Will be filled by the extracurricular assessment
      };

      // Create or update assessment
      const assessment = await Assessment.findOneAndUpdate(
        {
          userId,
          type: "transcript",
        },
        {
          userId,
          type: "transcript",
          responses: transcriptData,
          completedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      // Update user's assessment completion status
      await User.findByIdAndUpdate(userId, {
        $set: {
          "assessmentStatus.transcript": true,
          updatedAt: new Date(),
        },
      });

      res.status(200).json({
        message: "Academic transcript saved successfully",
        assessmentId: assessment._id,
        transcriptData,
      });
    } catch (error: any) {
      console.error("Save academic transcript error:", error);
      res.status(500).json({
        message: error.message || "Error saving academic transcript",
      });
    }
  },

  // Save extracurricular activities
  async saveExtracurriculars(req: Request, res: Response) {
    try {
      const { activities } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (
        !activities ||
        !Array.isArray(activities) ||
        activities.length === 0
      ) {
        return res.status(400).json({ message: "Activity data is required" });
      }

      // Transform activities data
      const extracurriculars: Extracurricular[] = activities.map(
        (activity: Activity) => ({
          name: activity.name,
          role: activity.position,
          description: activity.description,
        })
      );

      // Update transcript assessment to include extracurriculars
      const transcriptAssessment = await Assessment.findOne({
        userId,
        type: "transcript",
      });

      if (transcriptAssessment) {
        const transcriptData = transcriptAssessment.responses as TranscriptData;
        transcriptData.extracurriculars = extracurriculars;

        await Assessment.findByIdAndUpdate(transcriptAssessment._id, {
          responses: transcriptData,
          updatedAt: new Date(),
        });
      }

      // Create or update extracurricular assessment
      const assessment = await Assessment.findOneAndUpdate(
        {
          userId,
          type: "extracurricular",
        },
        {
          userId,
          type: "extracurricular",
          responses: { activities: extracurriculars },
          completedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      // Update user's assessment completion status
      await User.findByIdAndUpdate(userId, {
        $set: {
          "assessmentStatus.extracurricular": true,
          updatedAt: new Date(),
        },
      });

      res.status(200).json({
        message: "Extracurricular activities saved successfully",
        assessmentId: assessment._id,
        extracurriculars,
      });
    } catch (error: any) {
      console.error("Save extracurriculars error:", error);
      res.status(500).json({
        message: error.message || "Error saving extracurricular activities",
      });
    }
  },

  // Save behavioral assessment results
  async saveBehavioralAssessment(req: Request, res: Response) {
    try {
      const { categories, riasec } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!riasec) {
        return res.status(400).json({ message: "RIASEC data is required" });
      }

      // Create assessment results object
      const assessmentResults: AssessmentResults = {
        riasec,
        multiple_intelligence: categories || {},
      };

      // Create or update behavioral assessment
      const assessment = await Assessment.findOneAndUpdate(
        {
          userId,
          type: "behavioral",
        },
        {
          userId,
          type: "behavioral",
          responses: req.body,
          results: assessmentResults,
          completedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      // Update user's assessment completion status
      await User.findByIdAndUpdate(userId, {
        $set: {
          "assessmentStatus.behavioral": true,
          updatedAt: new Date(),
        },
      });

      res.status(200).json({
        message: "Behavioral assessment saved successfully",
        assessmentId: assessment._id,
        assessmentResults,
      });
    } catch (error: any) {
      console.error("Save behavioral assessment error:", error);
      res.status(500).json({
        message: error.message || "Error saving behavioral assessment",
      });
    }
  },

  // Get user's assessment status
  async getAssessmentStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const user = (await User.findById(userId).select(
        "assessmentStatus"
      )) as UserDocument;

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Default status if not defined
      const assessmentStatus: AssessmentStatus = user.assessmentStatus || {
        transcript: false,
        extracurricular: false,
        behavioral: false,
      };

      res.status(200).json({ assessmentStatus });
    } catch (error: any) {
      console.error("Get assessment status error:", error);
      res.status(500).json({
        message: error.message || "Error retrieving assessment status",
      });
    }
  },

  // Get combined assessment data for path generation
  async getCombinedAssessmentData(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Get user to check assessment completion status
      const user = (await User.findById(userId).select(
        "assessmentStatus"
      )) as UserDocument;

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if all assessments are completed
      const assessmentStatus: AssessmentStatus = user.assessmentStatus || {};
      const allCompleted =
        assessmentStatus.transcript === true &&
        assessmentStatus.extracurricular === true &&
        assessmentStatus.behavioral === true;

      if (!allCompleted) {
        return res.status(400).json({
          message: "All assessments must be completed before generating path",
          status: assessmentStatus,
        });
      }

      // Get all assessment data
      const transcriptAssessment = await Assessment.findOne({
        userId,
        type: "transcript",
      });

      const behavioralAssessment = await Assessment.findOne({
        userId,
        type: "behavioral",
      });

      if (!transcriptAssessment || !behavioralAssessment) {
        return res.status(404).json({ message: "Assessment data not found" });
      }

      // Combine data for path generation
      const transcriptData = transcriptAssessment.responses as TranscriptData;
      const assessmentResults =
        behavioralAssessment.results as AssessmentResults;

      res.status(200).json({
        transcriptData,
        assessmentResults,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Get combined assessment data error:", error);
      res.status(500).json({
        message: error.message || "Error retrieving assessment data",
      });
    }
  },
};

// Helper function to calculate strength areas based on subject grades
function calculateStrengthAreas(subjects: Subject[]): string[] {
  const strengths: string[] = [];
  const subjectThreshold = 85; // Percentage threshold to consider a subject a strength

  // Map of subject names to broader categories
  const subjectCategories: { [key: string]: string } = {
    Mathematics: "Mathematics",
    Physics: "Science",
    Chemistry: "Science",
    Biology: "Science",
    English: "Language",
    Amharic: "Language",
    History: "Humanities",
    Geography: "Humanities",
    Civics: "Humanities",
    Economics: "Business",
    "Business Studies": "Business",
    Accounting: "Business",
    "Information Technology": "Technology",
    Art: "Arts",
    Music: "Arts",
    "Physical Education": "Athletics",
  };

  // Count high grades by category
  const categoryScores: { [key: string]: { total: number; count: number } } =
    {};

  subjects.forEach((subject) => {
    const category = subjectCategories[subject.name] || "Other";

    if (!categoryScores[category]) {
      categoryScores[category] = { total: 0, count: 0 };
    }

    categoryScores[category].total += subject.percentage;
    categoryScores[category].count++;
  });

  // Calculate average scores by category and identify strengths
  Object.entries(categoryScores).forEach(([category, data]) => {
    const averageScore = data.total / data.count;
    if (averageScore >= subjectThreshold) {
      strengths.push(category);
    }
  });

  // Add original subjects with high scores
  subjects.forEach((subject) => {
    if (subject.percentage >= subjectThreshold) {
      strengths.push(subject.name);
    }
  });

  // Return unique strengths
  return [...new Set(strengths)];
}
