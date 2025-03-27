// net-pathway-backend/src/controllers/program.matching.controller.ts
import { Request, Response } from "express";
import {
  TranscriptData,
  AssessmentResults,
  ProgramMatch,
} from "../types/matchingTypes";
import universitiesData from "../data/universities_and_programs.json";

export const programMatchingController = {
  /**
   * Generate a personalized career pathway
   */
  async generatePersonalizedPathway(req: Request, res: Response) {
    try {
      const { transcriptData, assessmentResults } = req.body;

      // Validate request
      if (!transcriptData || !assessmentResults) {
        return res.status(400).json({
          message: "Both transcript data and assessment results are required",
        });
      }

      // Log request for debugging
      console.log("Processing pathway request for user:", req.user?.userId);

      const matches = generateMatches(
        transcriptData as TranscriptData,
        assessmentResults as AssessmentResults
      );

      // Return matches
      res.status(200).json({
        matches,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Program matching error:", error);
      res.status(500).json({
        message: error.message || "Error generating personalized pathway",
      });
    }
  },
};

// Simple matching function
function generateMatches(
  transcriptData: TranscriptData,
  assessmentResults: AssessmentResults
): ProgramMatch[] {
  const universities = universitiesData.universities;
  const matches: ProgramMatch[] = [];

  // Extract top traits from assessment results
  const riasecTraits = assessmentResults.riasec
    ? Object.entries(assessmentResults.riasec)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([trait]) => trait.toLowerCase())
    : [];

  const topSubjects = transcriptData.courses
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((course) => course.name.toLowerCase());

  // Basic matching logic
  universities.forEach((university) => {
    university.departments.forEach((department) => {
      department.programs.forEach((program) => {
        let matchScore = 0;

        // Match based on top subjects
        topSubjects.forEach((subject) => {
          if (
            program.courses.some((course) =>
              course.toLowerCase().includes(subject)
            )
          ) {
            matchScore += 30;
          }
        });

        // Match based on RIASEC traits
        riasecTraits.forEach((trait) => {
          if (program.tags.some((tag) => tag.toLowerCase().includes(trait))) {
            matchScore += 20;
          }
        });

        // Match based on transcript strengths
        transcriptData.strengths.forEach((strength) => {
          if (
            program.highlights.some((highlight) =>
              highlight.toLowerCase().includes(strength.toLowerCase())
            )
          ) {
            matchScore += 15;
          }
        });

        // Capped match percentage
        const matchPercentage = Math.min(matchScore, 95);

        if (matchPercentage > 50) {
          matches.push({
            university,
            department,
            program,
            matchPercentage,
          });
        }
      });
    });
  });

  // Sort matches by match percentage
  return matches
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 5);
}
