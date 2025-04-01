// lib/careerPathGenerator.ts
import { TranscriptData, AssessmentResults } from "../types/assessmentTypes";

// Use these interfaces if not already defined
interface Subject {
  name: string;
  percentage: number;
}

interface Program {
  id: number;
  name: string;
  duration: string;
  studyMode: string;
  tuitionFee: string;
  description: string;
  highlights: string[];
}

interface University {
  id: number;
  name: string;
  location: string;
  logo: string;
  description: string;
  admissionDeadline: string;
  programs: Program[];
}

interface PathData {
  id: string;
  title: string;
  description: string;
  matchPercentage: number;
  requirements: string[];
  universities: University[];
  aiRecommendation?: string;
}

// University data for different career paths
const universityDatabase = {
  engineering: [
    {
      id: 1,
      name: "Adama Science and Technology University",
      location: "Adama, Ethiopia",
      logo: "/logos/astu-logo.png",
      description:
        "A leading technical institution focused on science and engineering education.",
      admissionDeadline: "May 15, 2025",
      programs: [
        {
          id: 1,
          name: "Bachelor of Science in Software Engineering",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "45,000 ETB per year",
          description:
            "A comprehensive program covering software development principles, programming languages, database management, and software project management.",
          highlights: [
            "Practical programming skills",
            "Industry-focused curriculum",
            "Internship opportunities",
            "Modern computing facilities",
          ],
        },
        {
          id: 2,
          name: "Bachelor of Science in Computer Science",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "42,000 ETB per year",
          description:
            "Focus on theoretical and practical aspects of computing including algorithms, data structures, artificial intelligence, and computer architecture.",
          highlights: [
            "Research opportunities",
            "Advanced mathematics training",
            "Computing laboratory access",
            "AI and machine learning specialization available",
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Addis Ababa University",
      location: "Addis Ababa, Ethiopia",
      logo: "/logos/aau-logo.png",
      description:
        "Ethiopia's oldest and most prestigious higher education institution with a strong engineering program.",
      admissionDeadline: "April 30, 2025",
      programs: [
        {
          id: 3,
          name: "Bachelor of Science in Electrical Engineering",
          duration: "5 years",
          studyMode: "Full-time",
          tuitionFee: "38,000 ETB per year",
          description:
            "A comprehensive program focused on electrical systems, power generation, electronics, and telecommunications.",
          highlights: [
            "Well-equipped laboratories",
            "Industry partnerships",
            "Research opportunities",
            "Specialization tracks available",
          ],
        },
        {
          id: 4,
          name: "Bachelor of Science in Civil Engineering",
          duration: "5 years",
          studyMode: "Full-time",
          tuitionFee: "36,000 ETB per year",
          description:
            "Study of structural engineering, construction management, hydrology, and environmental engineering.",
          highlights: [
            "Field work opportunities",
            "Industry-standard software training",
            "Structural testing facilities",
            "Sustainable design focus",
          ],
        },
      ],
    },
  ],
  business: [
    {
      id: 3,
      name: "Addis Ababa University College of Business and Economics",
      location: "Addis Ababa, Ethiopia",
      logo: "/logos/aau-business-logo.png",
      description:
        "The premier business school in Ethiopia with a strong focus on entrepreneurship and management.",
      admissionDeadline: "June 1, 2025",
      programs: [
        {
          id: 5,
          name: "Bachelor of Business Administration",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "38,000 ETB per year",
          description:
            "Core business fundamentals with specializations in marketing, finance, or management.",
          highlights: [
            "Business incubation center",
            "Industry partnerships",
            "Internship placements",
            "Case-based learning approach",
          ],
        },
        {
          id: 6,
          name: "Bachelor of Accounting and Finance",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "37,000 ETB per year",
          description:
            "Specialized program focused on accounting principles, auditing, taxation, and financial management.",
          highlights: [
            "Professional certification preparation",
            "Financial software training",
            "Industry guest speakers",
            "Career services support",
          ],
        },
      ],
    },
    {
      id: 4,
      name: "Unity University",
      location: "Addis Ababa, Ethiopia",
      logo: "/logos/unity-logo.png",
      description:
        "A private university known for its business and entrepreneurship programs.",
      admissionDeadline: "May 15, 2025",
      programs: [
        {
          id: 7,
          name: "Bachelor of Marketing Management",
          duration: "3 years",
          studyMode: "Full-time/Part-time",
          tuitionFee: "42,000 ETB per year",
          description:
            "Specialized program in marketing principles, consumer behavior, digital marketing, and brand management.",
          highlights: [
            "Digital marketing lab",
            "Industry projects",
            "Marketing competitions",
            "International exchange opportunities",
          ],
        },
        {
          id: 8,
          name: "Bachelor of Entrepreneurship",
          duration: "3 years",
          studyMode: "Full-time",
          tuitionFee: "45,000 ETB per year",
          description:
            "Innovative program focused on business creation, innovation, and startup management.",
          highlights: [
            "Startup incubator access",
            "Seed funding competitions",
            "Mentorship program",
            "Hands-on business creation",
          ],
        },
      ],
    },
  ],
  healthSciences: [
    {
      id: 5,
      name: "Addis Ababa University College of Health Sciences",
      location: "Addis Ababa, Ethiopia",
      logo: "/logos/aau-health-logo.png",
      description:
        "Ethiopia's leading institution for medical and health sciences education.",
      admissionDeadline: "April 30, 2025",
      programs: [
        {
          id: 9,
          name: "Doctor of Medicine (MD)",
          duration: "6 years",
          studyMode: "Full-time",
          tuitionFee: "55,000 ETB per year",
          description:
            "Comprehensive medical program covering all aspects of human medicine and clinical practice.",
          highlights: [
            "Modern teaching hospital",
            "Research opportunities",
            "International exchange programs",
            "Rural medicine exposure",
          ],
        },
        {
          id: 10,
          name: "Bachelor of Science in Nursing",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "40,000 ETB per year",
          description:
            "Training program for professional nurses covering medical care, patient management, and healthcare systems.",
          highlights: [
            "Clinical rotations",
            "Simulation laboratories",
            "Community health projects",
            "Specialized nursing tracks",
          ],
        },
      ],
    },
    {
      id: 6,
      name: "St. Paul's Hospital Millennium Medical College",
      location: "Addis Ababa, Ethiopia",
      logo: "/logos/stpauls-logo.png",
      description:
        "A specialized medical college with a focus on practical training and community health.",
      admissionDeadline: "May 15, 2025",
      programs: [
        {
          id: 11,
          name: "Bachelor of Pharmacy",
          duration: "5 years",
          studyMode: "Full-time",
          tuitionFee: "45,000 ETB per year",
          description:
            "Professional program covering pharmaceutical sciences, medication management, and pharmacy practice.",
          highlights: [
            "Pharmaceutical laboratories",
            "Hospital pharmacy rotations",
            "Drug manufacturing exposure",
            "Research opportunities",
          ],
        },
        {
          id: 12,
          name: "Bachelor of Public Health",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "38,000 ETB per year",
          description:
            "Program focused on public health principles, epidemiology, health promotion, and healthcare management.",
          highlights: [
            "Community health projects",
            "Field epidemiology training",
            "Health policy focus",
            "Data analysis skills",
          ],
        },
      ],
    },
  ],
  socialSciences: [
    {
      id: 7,
      name: "Addis Ababa University College of Social Sciences",
      location: "Addis Ababa, Ethiopia",
      logo: "/logos/aau-social-logo.png",
      description:
        "Leading institution for social sciences research and education in Ethiopia.",
      admissionDeadline: "June 1, 2025",
      programs: [
        {
          id: 13,
          name: "Bachelor of Psychology",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "35,000 ETB per year",
          description:
            "Comprehensive program covering human behavior, mental processes, psychological assessment, and counseling.",
          highlights: [
            "Psychology lab access",
            "Clinical psychology exposure",
            "Research methods training",
            "Counseling practicum",
          ],
        },
        {
          id: 14,
          name: "Bachelor of Sociology",
          duration: "3 years",
          studyMode: "Full-time",
          tuitionFee: "32,000 ETB per year",
          description:
            "Study of social structures, relationships, and phenomena with focus on Ethiopian context.",
          highlights: [
            "Community-based research",
            "Policy analysis training",
            "Field research opportunities",
            "Social impact assessment",
          ],
        },
      ],
    },
    {
      id: 8,
      name: "Bahir Dar University",
      location: "Bahir Dar, Ethiopia",
      logo: "/logos/bahirdar-logo.png",
      description:
        "A comprehensive university known for its strong social sciences and education programs.",
      admissionDeadline: "May 15, 2025",
      programs: [
        {
          id: 15,
          name: "Bachelor of Social Work",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "34,000 ETB per year",
          description:
            "Professional program focused on social welfare, community development, and social intervention.",
          highlights: [
            "Field placements",
            "Case management training",
            "Community development projects",
            "Social policy analysis",
          ],
        },
        {
          id: 16,
          name: "Bachelor of Education",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "30,000 ETB per year",
          description:
            "Teacher training program with specializations in various subject areas and grade levels.",
          highlights: [
            "Teaching practicum",
            "Curriculum development training",
            "Educational technology focus",
            "Student assessment methods",
          ],
        },
      ],
    },
  ],
  agriculture: [
    {
      id: 9,
      name: "Haramaya University",
      location: "Haramaya, Ethiopia",
      logo: "/logos/haramaya-logo.png",
      description:
        "A pioneer agricultural university with a long history of excellence in agricultural education and research.",
      admissionDeadline: "May 15, 2025",
      programs: [
        {
          id: 17,
          name: "Bachelor of Science in Agricultural Economics",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "35,000 ETB per year",
          description:
            "Program combining agricultural science with economic principles and market analysis.",
          highlights: [
            "Farm management training",
            "Agricultural policy analysis",
            "Market research methods",
            "Rural development focus",
          ],
        },
        {
          id: 18,
          name: "Bachelor of Science in Crop Science",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "33,000 ETB per year",
          description:
            "Specialized program focused on crop production, plant breeding, pest management, and soil science.",
          highlights: [
            "Experimental farm access",
            "Plant breeding techniques",
            "Sustainable agriculture focus",
            "Field research opportunities",
          ],
        },
      ],
    },
    {
      id: 10,
      name: "Jimma University",
      location: "Jimma, Ethiopia",
      logo: "/logos/jimma-logo.png",
      description:
        "A comprehensive university known for its agricultural and environmental science programs.",
      admissionDeadline: "June 1, 2025",
      programs: [
        {
          id: 19,
          name: "Bachelor of Science in Animal Production",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "34,000 ETB per year",
          description:
            "Program focused on livestock management, animal health, breeding, and nutrition.",
          highlights: [
            "University farm access",
            "Livestock management training",
            "Veterinary science basics",
            "Practical production systems",
          ],
        },
        {
          id: 20,
          name: "Bachelor of Science in Natural Resource Management",
          duration: "4 years",
          studyMode: "Full-time",
          tuitionFee: "33,000 ETB per year",
          description:
            "Multidisciplinary program covering forestry, watershed management, conservation, and sustainable resource use.",
          highlights: [
            "Field ecology training",
            "GIS and remote sensing",
            "Conservation projects",
            "Environmental impact assessment",
          ],
        },
      ],
    },
  ],
};

// Generate requirements based on career path
function generateRequirements(
  careerPath: string,
  matchPercentage: number
): string[] {
  const baseRequirements = [
    "High school diploma or equivalent",
    "English language proficiency",
    "Entrance examination qualification",
  ];

  const specificRequirements: Record<string, string[]> = {
    engineering: [
      "Minimum GPA of 3.0 in science subjects",
      "Strong background in Mathematics and Physics",
      "Problem-solving aptitude",
    ],
    business: [
      "Minimum GPA of 2.8",
      "Strong communication skills",
      "Basic mathematics proficiency",
    ],
    healthSciences: [
      "Minimum GPA of 3.5 in science subjects",
      "Strong background in Biology and Chemistry",
      "Commitment to patient care",
    ],
    socialSciences: [
      "Minimum GPA of 3.0",
      "Strong reading and writing skills",
      "Interest in human behavior and society",
    ],
    agriculture: [
      "Minimum GPA of 3.0 in science subjects",
      "Background in Biology and Chemistry",
      "Interest in sustainable development",
    ],
  };

  // Add special recommendation for high matches
  if (matchPercentage > 85) {
    return [
      ...baseRequirements,
      ...specificRequirements[careerPath],
      "Highly recommended for students with your profile",
    ];
  }

  return [...baseRequirements, ...specificRequirements[careerPath]];
}

// Generate AI recommendation based on assessment data
function generateAIRecommendation(
  careerPath: string,
  transcriptData: TranscriptData,
  riasecData: Record<string, number>
): string {
  // Get top subjects and RIASEC traits
  const topSubjects = [...transcriptData.courses]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((course) => course.name);

  // Get top RIASEC traits
  const topTraits = Object.entries(riasecData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([trait]) => trait);

  // Map career paths to related subjects and traits
  const careerPathInfo: Record<
    string,
    { subjects: string[]; traits: string[]; strengths: string[] }
  > = {
    engineering: {
      subjects: ["Mathematics", "Physics", "Computer Science"],
      traits: ["investigative", "realistic", "conventional"],
      strengths: ["Problem Solving", "Analytical Thinking", "Technical Skills"],
    },
    business: {
      subjects: ["Economics", "Business Studies", "Mathematics"],
      traits: ["enterprising", "conventional", "social"],
      strengths: ["Leadership", "Communication", "Organization"],
    },
    healthSciences: {
      subjects: ["Biology", "Chemistry", "Mathematics"],
      traits: ["social", "investigative", "realistic"],
      strengths: ["Attention to Detail", "Empathy", "Scientific Knowledge"],
    },
    socialSciences: {
      subjects: ["History", "English", "Civics"],
      traits: ["social", "artistic", "investigative"],
      strengths: ["Communication", "Empathy", "Critical Thinking"],
    },
    agriculture: {
      subjects: ["Biology", "Chemistry", "Geography"],
      traits: ["realistic", "investigative", "conventional"],
      strengths: [
        "Practical Skills",
        "Scientific Knowledge",
        "Environmental Awareness",
      ],
    },
  };

  // Generate personalized recommendation
  const pathInfo = careerPathInfo[careerPath];
  const subjectMatch = topSubjects.filter((subject) =>
    pathInfo.subjects.some((s) => subject.includes(s))
  );

  const traitMatch = topTraits.filter((trait) =>
    pathInfo.traits.includes(trait)
  );

  const extracurricular = transcriptData.extracurriculars
    .slice(0, 2)
    .map((item) => item.name);

  // Construct recommendation
  let recommendation = `Based on your assessment results, ${careerPath} is a strong match for your profile. `;

  if (subjectMatch.length > 0) {
    recommendation += `Your strong performance in ${subjectMatch.join(
      " and "
    )} aligns well with the academic requirements for this field. `;
  }

  if (traitMatch.length > 0) {
    recommendation += `Your ${traitMatch.join(
      " and "
    )} personality traits indicate you would thrive in ${careerPath}-related roles. `;
  }

  if (extracurricular.length > 0) {
    recommendation += `Your involvement in ${extracurricular.join(
      " and "
    )} demonstrates relevant skills and interests that would benefit you in this career path. `;
  }

  recommendation += `Students with your profile typically excel in developing ${pathInfo.strengths.join(
    ", "
  )}.`;

  return recommendation;
}

// Main function to analyze assessment data and generate career path
export function generateCareerPath(
  transcriptData: TranscriptData,
  assessmentResults: AssessmentResults
): PathData {
  // 1. Analyze academic strengths
  const subjectScores: Record<string, number> = {};

  // Group subjects into categories and calculate average scores
  transcriptData.courses.forEach((course) => {
    // Map similar subjects to categories
    let category = course.name;

    if (course.name.includes("Math")) category = "Mathematics";
    else if (["Physics", "Chemistry", "Biology"].includes(course.name))
      category = course.name;
    else if (["History", "Geography", "Civics"].includes(course.name))
      category = "Humanities";
    else if (
      course.name.includes("English") ||
      course.name.includes("Language")
    )
      category = "Languages";
    else if (course.name.includes("Computer")) category = "Computer Science";
    else if (
      course.name.includes("Business") ||
      course.name.includes("Economics")
    )
      category = "Business";

    if (!subjectScores[category]) {
      subjectScores[category] = 0;
      subjectScores[`${category}_count`] = 0;
    }

    subjectScores[category] += course.score;
    subjectScores[`${category}_count`] =
      (subjectScores[`${category}_count`] || 0) + 1;
  });

  // Calculate averages
  const categoryAverages: Record<string, number> = {};
  Object.keys(subjectScores).forEach((key) => {
    if (!key.includes("_count")) {
      const count = subjectScores[`${key}_count`];
      categoryAverages[key] = subjectScores[key] / count;
    }
  });

  // 2. Calculate career matches based on subject strengths and RIASEC
  const careerMatches: Record<string, number> = {
    engineering: 0,
    business: 0,
    healthSciences: 0,
    socialSciences: 0,
    agriculture: 0,
  };

  // Subject-based matching (60% of total score)
  if (
    categoryAverages["Mathematics"] &&
    categoryAverages["Mathematics"] > 3.5
  ) {
    careerMatches.engineering += 30;
    careerMatches.business += 15;
  }

  if (categoryAverages["Physics"] && categoryAverages["Physics"] > 3.2) {
    careerMatches.engineering += 20;
  }

  if (
    categoryAverages["Computer Science"] &&
    categoryAverages["Computer Science"] > 3.0
  ) {
    careerMatches.engineering += 25;
  }

  if (categoryAverages["Biology"] && categoryAverages["Biology"] > 3.3) {
    careerMatches.healthSciences += 30;
    careerMatches.agriculture += 20;
  }

  if (categoryAverages["Chemistry"] && categoryAverages["Chemistry"] > 3.3) {
    careerMatches.healthSciences += 25;
    careerMatches.agriculture += 15;
  }

  if (categoryAverages["Business"] && categoryAverages["Business"] > 3.2) {
    careerMatches.business += 35;
  }

  if (categoryAverages["Humanities"] && categoryAverages["Humanities"] > 3.2) {
    careerMatches.socialSciences += 30;
    careerMatches.business += 10;
  }

  if (categoryAverages["Languages"] && categoryAverages["Languages"] > 3.5) {
    careerMatches.socialSciences += 20;
    careerMatches.business += 15;
  }

  // RIASEC-based matching (40% of total score)
  const riasec = assessmentResults.riasec || {};

  // Normalize RIASEC scores to 0-100
  const maxRiasecScore = Math.max(...Object.values(riasec));
  const normalizedRiasec: Record<string, number> = {};

  Object.entries(riasec).forEach(([trait, score]) => {
    normalizedRiasec[trait] = (score / maxRiasecScore) * 100;
  });

  // Apply RIASEC matches
  if (normalizedRiasec.realistic) {
    careerMatches.engineering += normalizedRiasec.realistic * 0.15;
    careerMatches.agriculture += normalizedRiasec.realistic * 0.15;
  }

  if (normalizedRiasec.investigative) {
    careerMatches.engineering += normalizedRiasec.investigative * 0.15;
    careerMatches.healthSciences += normalizedRiasec.investigative * 0.15;
    careerMatches.agriculture += normalizedRiasec.investigative * 0.1;
  }

  if (normalizedRiasec.artistic) {
    careerMatches.socialSciences += normalizedRiasec.artistic * 0.15;
  }

  if (normalizedRiasec.social) {
    careerMatches.healthSciences += normalizedRiasec.social * 0.15;
    careerMatches.socialSciences += normalizedRiasec.social * 0.2;
    careerMatches.business += normalizedRiasec.social * 0.05;
  }

  if (normalizedRiasec.enterprising) {
    careerMatches.business += normalizedRiasec.enterprising * 0.2;
    careerMatches.agriculture += normalizedRiasec.enterprising * 0.05;
  }

  if (normalizedRiasec.conventional) {
    careerMatches.business += normalizedRiasec.conventional * 0.1;
    careerMatches.engineering += normalizedRiasec.conventional * 0.05;
  }

  // 3. Find top match
  const topMatch = Object.entries(careerMatches).sort((a, b) => b[1] - a[1])[0];

  const careerPath = topMatch[0];

  // Cap match percentage at 95%
  const matchPercentage = Math.min(Math.round(topMatch[1]), 95);

  // 4. Generate title and description
  const titles: Record<string, string> = {
    engineering: "Engineering & Technology",
    business: "Business Administration & Management",
    healthSciences: "Health Sciences & Medicine",
    socialSciences: "Social Sciences & Humanities",
    agriculture: "Agricultural Sciences & Natural Resources",
  };

  const descriptions: Record<string, string> = {
    engineering:
      "A career path focused on designing, building, and optimizing systems, structures, and technologies to solve practical problems.",
    business:
      "A career path centered on business operations, management, entrepreneurship, and organizational leadership.",
    healthSciences:
      "A career path dedicated to healthcare, medicine, public health, and improving human wellbeing.",
    socialSciences:
      "A career path exploring human behavior, society, education, and cultural systems.",
    agriculture:
      "A career path focused on agricultural production, natural resource management, and sustainable development.",
  };

  // 5. Generate the full result
  const result: PathData = {
    id: careerPath,
    title: titles[careerPath],
    description: descriptions[careerPath],
    matchPercentage,
    requirements: generateRequirements(careerPath, matchPercentage),
    universities: universityDatabase[careerPath],
    aiRecommendation: generateAIRecommendation(
      careerPath,
      transcriptData,
      normalizedRiasec
    ),
  };

  return result;
}
