export interface Course {
  name: string;
  grade: string;
  score: number;
  credits: number;
}

export interface TranscriptData {
  courses: Course[];
  gpa: number;
  strengths: string[];
  extracurriculars: string[];
}

export interface AssessmentResults {
  riasec?: Record<string, number>;
  multiple_intelligence?: Record<string, number>;
  career_anchors?: Record<string, number>;
  work_dimensions?: Record<string, number>;
}

export interface University {
  id: string;
  name: string;
  location: string;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  programs: Program[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  studyMode: string;
  tuitionFee: string;
  entryRequirements: string[];
  highlights: string[];
  courses: string[];
  careerOpportunities: string[];
  tags: string[];
  applicationDeadline?: string;
}

export interface ProgramMatch {
  university: University;
  department: Department;
  program: Program;
  matchPercentage: number;
}

export interface UniversityData {
  universities: University[];
}

export interface StudentProfile {
  grades: Record<string, number>;
  interests: string[];
  skills: string[];
  personalityTraits: string[];
  BehavioralAssessment: Record<string, number>;
}

export interface Subject {
  name: string;
  code: string;
  credits: number;
  description: string;
  prerequisites: string[];
  corequisites: string[];
}

export interface ProgramInfo {
  id: string;
  name: string;
  description: string;
  duration: string;
  studyMode: string;
  tuitionFee: string;
  entryRequirements: string[];
  highlights: string[];
  courses: Subject[];
  careerOpportunities: string[];
  tags: string[];
  applicationDeadline?: string;
  universityId: string;
}
