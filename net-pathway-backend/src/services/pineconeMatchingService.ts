import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

import {
  UniversityData,
  Program,
  University,
  Department,
  TranscriptData,
  AssessmentResults,
  ProgramMatch,
} from "../types/matchingTypes";
import dotenv from "dotenv";

dotenv.config();

export class PineconeMatchingService {
  private pinecone: Pinecone;
  private embeddings: OpenAIEmbeddings;
  private llm: ChatOpenAI;
  private indexName: string;
  private namespace: string;
  private initialized: boolean = false;
  private universitiesData: UniversityData;
  createStudentProfile: any;

  constructor(universitiesData: UniversityData) {
    this.universitiesData = universitiesData;

    // Initialize Pinecone
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || "",
    });

    // Initialize Embeddings
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      model: "text-embedding-ada-002",
    });

    // Initialize Chat Model
    this.llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      modelName: "gpt-4-turbo-preview",
    });

    this.indexName = process.env.PINECONE_INDEX_NAME || "net-pathway-programs";
    this.namespace = "programs";
  }

  /**
   * Initialize Pinecone client and ensure index exists
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Check if our index exists
      const indexList = await this.pinecone.listIndexes();
      const existingIndexes =
        indexList.indexes?.map((index) => index.name) || [];

      if (!existingIndexes.includes(this.indexName)) {
        console.log(`Index ${this.indexName} does not exist, creating...`);

        await this.pinecone.createIndex({
          name: this.indexName,
          dimension: 1536, // OpenAI embedding dimension
          metric: "cosine",
          spec: {
            pod: {
              environment: process.env.PINECONE_ENVIRONMENT || "gcp-starter",
              podType: "",
            },
          },
        });

        // Wait for index to be ready
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      this.initialized = true;
      console.log("Pinecone Matching Service initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize Pinecone Matching Service:", error);
      throw error;
    }
  }

  /**
   * Match student to programs using a RAG approach
   */
  public async matchStudentToPrograms(
    transcriptData: TranscriptData,
    assessmentResults: AssessmentResults
  ): Promise<ProgramMatch[]> {
    try {
      // Ensure service is initialized
      await this.initialize();

      // Create student profile
      const studentProfile createStudentProfile(
        transcriptData,
        assessmentResults
      );
      console.log("Created student profile for matching");

      // Perform semantic search
      const pineconeIndex = this.pinecone.index(this.indexName);
      const vectorStore = await PineconeStore.fromExistingIndex(
        this.embeddings,
        {
          pineconeIndex,
          namespace: this.namespace,
          textKey: "text",
        }
      );

      // Create a query that will find relevant programs
      const query = `Find suitable university programs for a student with the following profile:
${studentProfile}

The ideal program should match their academic strengths, interests, and personality type.`;

      // Retrieve similar programs
      const retrievalResults = await vectorStore.similaritySearch(query, 15);
      console.log(`Retrieved ${retrievalResults.length} relevant programs`);

      // Create a prompt template for program matching
      const prompt = ChatPromptTemplate.fromTemplate(`
You are a university admissions consultant. Your task is to match the student profile below with the most suitable university programs.

Student Profile:
{studentProfile}

Available Programs:
{programs}

Based on this student profile and the provided program information, rank the top 10 most suitable programs for this student. 
For each program, assign a match percentage (0-100%) based on how well it aligns with the student's academic strengths, 
personality type, and career interests.

Return your results in the following JSON format:
[
  {
    "universityId": "university_id",
    "departmentId": "department_id",
    "programId": "program_id",
    "matchPercentage": 95
  },
  ...
]

Sort the results by match percentage in descending order. Provide detailed reasoning for each match.
`);

      // Prepare programs text from retrieval results
      const programsText = retrievalResults
        .map((doc, index) => `Program ${index + 1}:\n${doc.pageContent}`)
        .join("\n\n");

      // Create a chain to process the matching
      const chain = RunnableSequence.from([
        prompt,
        this.llm,
        new StringOutputParser(),
      ]);

      // Run the chain
      const ragResponse = await chain.invoke({
        studentProfile,
        programs: programsText,
      });

      console.log("Generated RAG recommendations");

      // Parse the program matches from the RAG response
      let programMatches: Array<{
        universityId: string;
        departmentId: string;
        programId: string;
        matchPercentage: number;
      }> = [];

      try {
        // Extract JSON from response
        const jsonMatch = ragResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          programMatches = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (error) {
        console.error("Failed to parse program matches:", error);
        console.log("RAG response:", ragResponse);

        // Fallback to retrievalResults if parsing fails
        programMatches = retrievalResults.map((doc, index) => ({
          universityId: doc.metadata.universityId,
          departmentId: doc.metadata.departmentId,
          programId: doc.metadata.programId,
          matchPercentage: Math.round(95 - index * 5),
        }));
      }

      // Convert to ProgramMatch objects
      const matches: ProgramMatch[] = programMatches
        .map((match) => {
          const university = this.findUniversity(match.universityId);
          const department = this.findDepartment(
            university,
            match.departmentId
          );
          const program = this.findProgram(department, match.programId);

          return {
            university,
            department,
            program,
            matchPercentage: match.matchPercentage,
          };
        })
        .filter((match) => match.program !== null); // Filter out any not found

      return matches;
    } catch (error) {
      console.error("Error in RAG matching:", error);
      throw error;
    }
  }

  /**
   * Find university by ID
   */
  private findUniversity(universityId: string): University {
    const university = this.universitiesData.universities.find(
      (u) => u.id === universityId
    );
    if (!university) {
      throw new Error(`University with ID ${universityId} not found`);
    }
    return university;
  }

  /**
   * Find department by ID within a university
   */
  private findDepartment(
    university: University,
    departmentId: string
  ): Department {
    const department = university.departments.find(
      (d) => d.id === departmentId
    );
    if (!department) {
      throw new Error(
        `Department with ID ${departmentId} not found in university ${university.id}`
      );
    }
    return department;
  }

  /**
   * Find program by ID within a department
   */
  private findProgram(department: Department, programId: string): Program {
    const program = department.programs.find((p) => p.id === programId);
    if (!program) {
      throw new Error(
        `Program with ID ${programId} not found in department ${department.id}`
      );
    }
    return program;
  }
}
