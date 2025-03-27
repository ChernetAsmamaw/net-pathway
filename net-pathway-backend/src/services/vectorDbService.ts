// net-pathway-backend/src/services/vectorDbService.ts
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {
  UniversityData,
  Program,
  Department,
  University,
} from "../types/matchingTypes";
import dotenv from "dotenv";

dotenv.config();

// Configure environment variables
const PINECONE_API_KEY = process.env.PINECONE_API_KEY || "";
const PINECONE_INDEX_NAME =
  process.env.PINECONE_INDEX_NAME || "net-pathway-programs";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

/**
 * VectorDB Service for RAG functionality
 */
export class VectorDbService {
  private pinecone: Pinecone;
  private embeddings: OpenAIEmbeddings;
  private initialized: boolean = false;

  constructor() {
    // Initialize Pinecone client
    this.pinecone = new Pinecone({
      apiKey: PINECONE_API_KEY,
    });

    // Initialize OpenAI embeddings with API key
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: OPENAI_API_KEY,
      modelName: "text-embedding-ada-002", // using Ada for embeddings
    });
  }

  /**
   * Initialize the Pinecone client and ensure index exists
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Check if our index exists
      const indexList = await this.pinecone.listIndexes();
      const existingIndexes =
        indexList.indexes?.map((index) => index.name) || [];

      if (!existingIndexes.includes(PINECONE_INDEX_NAME)) {
        console.log(`Index ${PINECONE_INDEX_NAME} does not exist, creating...`);
        // Create index if it doesn't exist
        await this.pinecone.createIndex({
          name: PINECONE_INDEX_NAME,
          dimension: 1536, // OpenAI embedding dimension
          metric: "cosine",
          spec: {
            pod: {
              environment: process.env.PINECONE_ENVIRONMENT || "us-east-1",
              podType: "",
            },
          },
        });

        // Wait for index to be ready
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      this.initialized = true;
      console.log("VectorDB Service initialized successfully.");
    } catch (error) {
      console.error("Failed to initialize VectorDB Service:", error);
      throw error;
    }
  }

  /**
   * Load university programs data into Pinecone
   * @param universitiesData University data object
   */
  async loadProgramsData(universitiesData: UniversityData): Promise<void> {
    await this.initialize();

    try {
      const pineconeIndex = this.pinecone.index(PINECONE_INDEX_NAME);

      // Extract all programs from universities
      const documents: Document[] = [];

      universitiesData.universities.forEach((university) => {
        university.departments.forEach((department) => {
          department.programs.forEach((program) => {
            // Create a rich text representation of the program
            const programText = `
            University: ${university.name}
            Department: ${department.name}
            Program: ${program.name}
            Description: ${program.description}
            Duration: ${program.duration}
            Tuition Fee: ${program.tuitionFee}
            Study Mode: ${program.studyMode}
            Entry Requirements: ${program.entryRequirements.join(", ")}
            Highlights: ${program.highlights.join(", ")}
            Courses: ${program.courses.join(", ")}
            Career Opportunities: ${program.careerOpportunities.join(", ")}
            Tags: ${program.tags.join(", ")}
            `;

            // Create metadata for filtering/retrieval
            const metadata = {
              universityId: university.id,
              universityName: university.name,
              departmentId: department.id,
              departmentName: department.name,
              programId: program.id,
              programName: program.name,
              tags: program.tags.join(","),
            };

            documents.push(
              new Document({
                pageContent: programText,
                metadata,
              })
            );
          });
        });
      });

      // Text splitter to chunk documents
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const splitDocs = await textSplitter.splitDocuments(documents);
      console.log(
        `Splitting ${documents.length} programs into ${splitDocs.length} chunks.`
      );

      // Store documents in Pinecone
      await PineconeStore.fromDocuments(splitDocs, this.embeddings, {
        pineconeIndex,
        namespace: "university-programs",
      });

      console.log(
        `Successfully loaded ${splitDocs.length} program chunks into Pinecone.`
      );
    } catch (error) {
      console.error("Error loading program data into Pinecone:", error);
      throw error;
    }
  }

  /**
   * Search programs based on student profile query
   * @param query The generated query based on student profile
   * @param numResults Number of results to return
   * @returns Array of matching document chunks
   */
  async searchPrograms(
    query: string,
    numResults: number = 10
  ): Promise<Document[]> {
    await this.initialize();

    try {
      const pineconeIndex = this.pinecone.index(PINECONE_INDEX_NAME);

      // Create vector store from existing index
      const vectorStore = await PineconeStore.fromExistingIndex(
        this.embeddings,
        {
          pineconeIndex,
          namespace: "university-programs",
        }
      );

      // Search for similar documents
      const results = await vectorStore.similaritySearch(query, numResults);

      return results;
    } catch (error) {
      console.error("Error searching programs:", error);
      throw error;
    }
  }

  /**
   * Clear all data from the vector database
   */
  async clearIndex(): Promise<void> {
    await this.initialize();

    try {
      const pineconeIndex = this.pinecone.index(PINECONE_INDEX_NAME);
      await pineconeIndex.deleteMany({
        filter: {},
        namespace: "university-programs",
      });

      console.log("Cleared all data from the index.");
    } catch (error) {
      console.error("Error clearing Pinecone index:", error);
      throw error;
    }
  }
}

// Singleton instance
export const vectorDbService = new VectorDbService();
