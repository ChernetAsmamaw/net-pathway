export interface TranscriptData {
  courses: {
    name: string;
    score: number;
  }[];
  extracurriculars: {
    name: string;
    // Add other extracurricular properties if needed
  }[];
}

export interface AssessmentResults {
  riasec?: Record<string, number>;
  // Add other assessment result properties if needed
}
