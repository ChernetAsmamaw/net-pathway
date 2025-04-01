/**
 * Utility to combine all assessment data for API submission
 */

// Types for each assessment section
interface Subject {
  id?: string;
  name: string;
  percentage: number;
}

interface Activity {
  id?: string;
  name: string;
  position: string;
  description: string;
}

interface AcademicTranscriptData {
  subjects: Subject[];
  gpa: number;
  submittedAt?: string;
}

interface ExtracurricularData {
  activities: Activity[];
}

interface BehavioralData {
  responses: { [key: number]: number };
  results: {
    multiple_intelligence?: Record<string, number>;
    riasec?: Record<string, number>;
  };
}

// Combined data type
export interface CombinedAssessmentData {
  academicTranscript: AcademicTranscriptData;
  extracurricular: ExtracurricularData;
  behavioral: BehavioralData;
  submittedAt: string;
}

/**
 * Combines all assessment data into a single object for API submission
 * @returns Combined assessment data
 */
export const combineAssessmentData = (): CombinedAssessmentData | null => {
  try {
    console.log("Combining assessment data...");

    // Get academic data from localStorage
    const academicDataStr = localStorage.getItem("academic_assessment_data");
    if (!academicDataStr) {
      console.error("No academic data found");
      return null;
    }
    const academicData: AcademicTranscriptData = JSON.parse(academicDataStr);

    // Get extracurricular data from localStorage
    const extracurricularDataStr = localStorage.getItem(
      "extracurricular_assessment_data"
    );
    if (!extracurricularDataStr) {
      console.error("No extracurricular data found");
      return null;
    }
    const extracurricularData: ExtracurricularData = JSON.parse(
      extracurricularDataStr
    );

    // Get behavioral data from localStorage
    const behavioralDataStr = localStorage.getItem(
      "behavioral_assessment_progress"
    );
    if (!behavioralDataStr) {
      console.error("No behavioral data found");
      return null;
    }
    const behavioralData: BehavioralData = JSON.parse(behavioralDataStr);

    // Clean up the data before sending (remove unnecessary fields like ids)
    const cleanedAcademicData = {
      ...academicData,
      subjects: academicData.subjects.map(({ id, ...rest }) => rest),
    };

    const cleanedExtracurricularData = {
      activities: extracurricularData.activities.map(({ id, ...rest }) => rest),
    };

    // Combine all data
    const combinedData: CombinedAssessmentData = {
      academicTranscript: cleanedAcademicData,
      extracurricular: cleanedExtracurricularData,
      behavioral: behavioralData,
      submittedAt: new Date().toISOString(),
    };

    console.log("Combined Assessment Data:", combinedData);

    return combinedData;
  } catch (error) {
    console.error("Error combining assessment data:", error);
    return null;
  }
};

/**
 * Check if all assessments are completed
 * @returns Boolean indicating if all sections are completed
 */
export const areAllAssessmentsCompleted = (): boolean => {
  const academicCompleted =
    localStorage.getItem("academic_assessment_completed") === "true";
  const extracurricularCompleted =
    localStorage.getItem("extracurricular_assessment_completed") === "true";
  const behavioralDataStr = localStorage.getItem(
    "behavioral_assessment_progress"
  );

  let behavioralCompleted = false;
  if (behavioralDataStr) {
    try {
      const data = JSON.parse(behavioralDataStr);
      // Check if responses has at least 9 out of 11 questions answered
      behavioralCompleted =
        data.responses && Object.keys(data.responses).length >= 9;
    } catch (e) {
      console.error("Error parsing behavioral data", e);
    }
  }

  return academicCompleted && extracurricularCompleted && behavioralCompleted;
};
