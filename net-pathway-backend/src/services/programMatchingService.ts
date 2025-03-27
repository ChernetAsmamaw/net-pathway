// net-pathway-backend/src/services/programMatchingService.ts
import { 
  UniversityData, 
  Program, 
  Department, 
  TranscriptData, 
  AssessmentResults,
  StudentProfile,
  Subject,
  ProgramInfo,
  ProgramMatch
} from '../types/matchingTypes';
import universitiesData from '../data/universities.json';

export class ProgramMatchingService {
  private universitiesData: UniversityData;
  
  constructor() {
    this.universitiesData = universitiesData as UniversityData;
  }
  
  /**
   * Process student profile and match with suitable programs
   * @param transcriptData Student's academic transcript data
   * @param assessmentResults Results from behavioral assessment
   * @returns Array of program matches with match percentages
   */
  public matchStudentToPrograms(
    transcriptData: TranscriptData,
    assessmentResults: AssessmentResults
  ): ProgramMatch[] {
    // Extract student profile from inputs
    const studentProfile = this.createStudentProfile(transcriptData, assessmentResults);
    
    // Get all available programs from universities
    const allPrograms = this.getAllPrograms();
    
    // Score each program based on student profile
    const scoredPrograms = allPrograms.map(program => {
      const matchScore = this.calculateMatchScore(studentProfile, program);
      return {
        university: program.university,
        department: program.department,
        program: program.program,
        matchPercentage: matchScore
      };
    });
    
    // Sort by match score (descending)
    const sortedMatches = scoredPrograms.sort((a, b) => 
      b.matchPercentage - a.matchPercentage
    );
    
    return sortedMatches.slice(0, 10); // Return top 10 matches
  }
  
  /**
   * Creates a student profile from transcript and assessment data
   */
  private createStudentProfile(
    transcriptData: TranscriptData,
    assessmentResults: AssessmentResults
  ): StudentProfile {
    // Map course grades to subject strengths
    const subjects = this.mapCoursesToSubjects(transcriptData.courses);
    
    // Create subject strength map
    const subjectStrengths = this.calculateSubjectStrengths(subjects);
    
    // Extract career preferences from assessment results
    const careerPreferences = this.extractCareerPreferences(assessmentResults);
    
    // Map personality traits from assessment results
    const personalityTraits = this.mapPersonalityTraits(assessmentResults);
    
    return {
      gpa: transcriptData.gpa,
      subjectStrengths,
      academicStrengths: transcriptData.strengths,
      extracurriculars: transcriptData.extracurriculars,
      careerPreferences,
      personalityTraits
    };
  }
  
  /**
   * Maps courses to general subject areas
   */
  private mapCoursesToSubjects(courses: Array<{name: string; grade: string; score: number}>): Subject[] {
    // Map of course name keywords to subject areas
    const subjectKeywords: {[key: string]: string} = {
      'math': 'Mathematics',
      'algebra': 'Mathematics',
      'calculus': 'Mathematics',
      'physics': 'Physics',
      'chemistry': 'Chemistry',
      'biology': 'Biology',
      'history': 'History',
      'geography': 'Geography',
      'english': 'English',
      'literature': 'English',
      'language': 'Languages',
      'computer': 'Computer Science',
      'programming': 'Computer Science',
      'economics': 'Economics',
      'business': 'Business',
      'accounting': 'Business',
      'psychology': 'Psychology',
      'sociology': 'Sociology',
      'art': 'Arts',
      'music': 'Arts',
      // Add more mappings as needed
    };
    
    // Process each course
    const subjects: Subject[] = courses.map(course => {
      // Find matching subject based on course name
      let subjectName = 'Other';
      const courseLower = course.name.toLowerCase();
      
      for (const [keyword, subject] of Object.entries(subjectKeywords)) {
        if (courseLower.includes(keyword)) {
          subjectName = subject;
          break;
        }
      }
      
      // Convert letter grade to numeric score if not already provided
      const gradeScore = course.score || this.letterGradeToScore(course.grade);
      
      return {
        name: subjectName,
        score: gradeScore
      };
    });
    
    return subjects;
  }
  
  /**
   * Convert letter grades to numeric scores
   */
  private letterGradeToScore(grade: string): number {
    const gradeMap: {[key: string]: number} = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0
    };
    
    return gradeMap[grade.toUpperCase()] || 0;
  }
  
  /**
   * Calculate strength scores for each subject area
   */
  private calculateSubjectStrengths(subjects: Subject[]): {[key: string]: number} {
    const subjectStrengths: {[key: string]: {total: number; count: number}} = {};
    
    // Calculate average score for each subject
    subjects.forEach(subject => {
      if (!subjectStrengths[subject.name]) {
        subjectStrengths[subject.name] = { total: 0, count: 0 };
      }
      
      subjectStrengths[subject.name].total += subject.score;
      subjectStrengths[subject.name].count += 1;
    });
    
    // Convert to average scores
    const averageScores: {[key: string]: number} = {};
    for (const [subject, data] of Object.entries(subjectStrengths)) {
      averageScores[subject] = data.total / data.count;
    }
    
    return averageScores;
  }
  
  /**
   * Extract career preferences from assessment results
   */
  private extractCareerPreferences(assessmentResults: AssessmentResults): string[] {
    const preferences: string[] = [];
    
    // Extract preferences based on career anchors
    if (assessmentResults.careerAnchors) {
      // Get top career anchor categories
      const sortedAnchors = Object.entries(assessmentResults.careerAnchors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
      
      // Map anchors to career areas
      sortedAnchors.forEach(anchor => {
        if (anchor === 'technical') preferences.push('Engineering', 'Technology');
        if (anchor === 'managerial') preferences.push('Management', 'Business');
        if (anchor === 'autonomy') preferences.push('Entrepreneurship', 'Research');
        if (anchor === 'security') preferences.push('Finance', 'Public Service');
        if (anchor === 'creativity') preferences.push('Arts', 'Design', 'Innovation');
        if (anchor === 'service') preferences.push('Healthcare', 'Education', 'Social Work');
        if (anchor === 'challenge') preferences.push('Science', 'Law', 'Consulting');
        if (anchor === 'lifestyle') preferences.push('Hospitality', 'Wellness');
      });
    }
    
    // Extract preferences based on RIASEC model
    if (assessmentResults.riasec) {
      const sortedRiasec = Object.entries(assessmentResults.riasec)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
      
      sortedRiasec.forEach(code => {
        if (code === 'realistic') preferences.push('Engineering', 'Agriculture', 'Construction');
        if (code === 'investigative') preferences.push('Science', 'Medicine', 'Research');
        if (code === 'artistic') preferences.push('Arts', 'Design', 'Writing');
        if (code === 'social') preferences.push('Education', 'Counseling', 'Healthcare');
        if (code === 'enterprising') preferences.push('Business', 'Law', 'Politics');
        if (code === 'conventional') preferences.push('Finance', 'Administration', 'Information Technology');
      });
    }
    
    // Return unique preferences
    return [...new Set(preferences)];
  }
  
  /**
   * Map assessment results to personality traits
   */
  private mapPersonalityTraits(assessmentResults: AssessmentResults): {[key: string]: number} {
    const traits: {[key: string]: number} = {};
    
    // Map RIASEC scores
    if (assessmentResults.riasec) {
      traits.realistic = assessmentResults.riasec.realistic || 0;
      traits.investigative = assessmentResults.riasec.investigative || 0;
      traits.artistic = assessmentResults.riasec.artistic || 0;
      traits.social = assessmentResults.riasec.social || 0;
      traits.enterprising = assessmentResults.riasec.enterprising || 0;
      traits.conventional = assessmentResults.riasec.conventional || 0;
    }
    
    // Map multiple intelligences
    if (assessmentResults.multiple_intelligence) {
      traits.logical = assessmentResults.multiple_intelligence.logical_mathematical || 0;
      traits.spatial = assessmentResults.multiple_intelligence.visual_spatial || 0;
      traits.linguistic = assessmentResults.multiple_intelligence.verbal_linguistic || 0;
      traits.interpersonal = assessmentResults.multiple_intelligence.interpersonal || 0;
      traits.intrapersonal = assessmentResults.multiple_intelligence.intrapersonal || 0;
      traits.musical = assessmentResults.multiple_intelligence.musical || 0;
      traits.bodily = assessmentResults.multiple_intelligence.bodily_kinesthetic || 0;
      traits.naturalistic = assessmentResults.multiple_intelligence.naturalistic || 0;
    }
    
    // Normalize trait values to 0-1 range
    const maxValue = Math.max(...Object.values(traits));
    if (maxValue > 0) {
      for (const trait in traits) {
        traits[trait] = traits[trait] / maxValue;
      }
    }
    
    return traits;
  }
  
  /**
   * Get all programs from all universities
   */
  private getAllPrograms(): ProgramInfo[] {
    const allPrograms: ProgramInfo[] = [];
    
    this.universitiesData.universities.forEach(university => {
      university.departments.forEach(department => {
        department.programs.forEach(program => {
          allPrograms.push({
            university: university,
            department: department,
            program: program
          });
        });
      });
    });
    
    return allPrograms;
  }
  
  /**
   * Calculate match score between student profile and program
   */
  private calculateMatchScore(studentProfile: StudentProfile, programInfo: ProgramInfo): number {
    const { university, department, program } = programInfo;
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    // Calculate academic match (GPA and subject strengths)
    const academicMatch = this.calculateAcademicMatch(studentProfile, program);
    totalScore += academicMatch.score;
    maxPossibleScore += academicMatch.maxScore;
    
    // Calculate interest/personality match
    const personalityMatch = this.calculatePersonalityMatch(studentProfile, program);
    totalScore += personalityMatch.score;
    maxPossibleScore += personalityMatch.maxScore;
    
    // Calculate extracurricular match
    const extracurricularMatch = this.calculateExtracurricularMatch(studentProfile, program);
    totalScore += extracurricularMatch.score;
    maxPossibleScore += extracurricularMatch.maxScore;
    
    // Calculate career alignment
    const careerMatch = this.calculateCareerMatch(studentProfile, program);
    totalScore += careerMatch.score;
    maxPossibleScore += careerMatch.maxScore;
    
    // Return percentage match
    const matchPercentage = Math.round((totalScore / maxPossibleScore) * 100);
    return Math.min(100, Math.max(0, matchPercentage)); // Ensure within 0-100 range
  }
  
  /**
   * Calculate academic match between student and program
   */
  private calculateAcademicMatch(
    studentProfile: StudentProfile, 
    program: Program
  ): { score: number; maxScore: number } {
    let score = 0;
    const maxScore = 40; // Academic factors worth 40% of total
    
    // Match GPA against program requirements
    const minGpaRequirement = 3.0; // Default if not specified
    const gpaScore = Math.min(10, (studentProfile.gpa / minGpaRequirement) * 10);
    score += gpaScore;
    
    // Match subject strengths with program-relevant subjects
    const relevantSubjects = this.getRelevantSubjects(program);
    let subjectScore = 0;
    
    relevantSubjects.forEach(subject => {
      const studentStrength = studentProfile.subjectStrengths[subject] || 0;
      subjectScore += (studentStrength / 4.0) * (30 / relevantSubjects.length); // Scale to portion of 30 points
    });
    
    score += subjectScore;
    
    return { score, maxScore };