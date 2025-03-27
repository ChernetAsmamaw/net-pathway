// net-pathway-backend/src/controllers/langchain.program.matching.controller.ts
import { Request, Response } from "express";
import { PineconeMatchingService } from "../services/pineconeMatchingService";
import { TranscriptData, AssessmentResults } from "../types/matchingTypes";
import universitiesData from "../data/universities_and_programs.json";

// Initialize service with university data
const matchingService = new PineconeMatchingService(universitiesData);

// Initialize service on startup
(async () => {
  try {
    await matchingService.initialize();
    console.log("✅ Pinecone matching service initialized on startup");
  } catch (error) {
    console.error("❌ Failed to initialize Pinecone matching service:", error);
  }
})();

export const langchainProgramMatchingController = {
  /**
   * Process program matching request using LangChain + Pinecone
   */
  async matchPrograms(req: Request, res: Response) {
    try {
      const { transcriptData, assessmentResults } = req.body;

      // Validate request
      if (!transcriptData || !assessmentResults) {
        return res.status(400).json({
          message: "Both transcript data and assessment results are required",
        });
      }

      // Log request for debugging
      console.log("Processing matching request for user:", req.user?.userId);

      // Perform matching using RAG
      const matches = await matchingService.matchStudentToPrograms(
        transcriptData as TranscriptData,
        assessmentResults as AssessmentResults
      );

      // Return matches
      res.status(200).json({
        matches,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("LangChain program matching error:", error);
      res.status(500).json({
        message: error.message || "Error matching programs",
      });
    }
  },

  /**
   * Handle transcript file upload and analysis using LLM
   */
  async analyzeTranscript(req: Request, res: Response) {
    try {
      // Check for file upload
      if (!req.file) {
        return res.status(400).json({ message: "No transcript file uploaded" });
      }

      // In a real implementation, you would:
      // 1. Convert the file to text using OCR if it's an image or PDF
      // 2. Use an LLM to extract course information, grades, etc.
      // 3. Return the structured data

      // For this example, we're simulating the process with sample data
      const transcriptData: TranscriptData = {
        courses: [
          { name: "Calculus I", grade: "A", score: 4.0, credits: 3 },
          {
            name: "Introduction to Computer Science",
            grade: "A-",
            score: 3.7,
            credits: 4,
          },
          { name: "Physics I", grade: "B+", score: 3.3, credits: 4 },
          { name: "English Composition", grade: "B", score: 3.0, credits: 3 },
          { name: "Chemistry", grade: "C+", score: 2.3, credits: 4 },
          { name: "History of Science", grade: "B", score: 3.0, credits: 3 },
          {
            name: "Data Structures and Algorithms",
            grade: "A",
            score: 4.0,
            credits: 4,
          },
        ],
        gpa: 3.3,
        strengths: [
          "Problem Solving",
          "Computer Programming",
          "Mathematics",
          "Analytical Thinking",
        ],
        extracurriculars: [
          "Robotics Club",
          "Math Team",
          "Student Government",
          "Volunteering at Science Museum",
        ],
      };

      // Send response with analyzed data
      res.status(200).json({
        message: "Transcript analysis complete",
        transcriptData,
      });
    } catch (error: any) {
      console.error("Transcript analysis error:", error);
      res.status(500).json({
        message: error.message || "Error analyzing transcript",
      });
    }
  },

  /**
   * Reinitialize the vector store (admin only endpoint)
   */
  async reinitializeVectorStore(req: Request, res: Response) {
    try {
      // Verify the user is an admin
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Reinitialize
      await matchingService.initialize();

      res.status(200).json({
        message: "Vector store reinitialized successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Reinitialization error:", error);
      res.status(500).json({
        message: error.message || "Error reinitializing vector store",
      });
    }
  },
};
