// net-pathway-backend/src/scripts/ingestUniversityData.ts
import { vectorDbService } from "../services/vectorDbService";
import fs from "fs";
import path from "path";
import { UniversityData } from "../types/matchingTypes";
import dotenv from "dotenv";

dotenv.config();

/**
 * Script to ingest university data into vector database
 * This should be run once to populate the vector database with program data
 */
async function ingestUniversityData() {
  try {
    console.log("Starting university data ingestion...");

    // Read universities data from JSON file
    const dataPath = path.join(
      __dirname,
      "../../data/universities_and_programs.json"
    );
    const rawData = fs.readFileSync(dataPath, "utf8");
    const universitiesData: UniversityData = JSON.parse(rawData);

    console.log(
      `Found ${universitiesData.universities.length} universities in data file.`
    );

    // Initialize vector database service
    await vectorDbService.initialize();

    // Clear previous data (optional, depending on your use case)
    console.log("Clearing previous data from vector database...");
    await vectorDbService.clearIndex();

    // Load university programs data into vector database
    console.log("Loading university programs data into vector database...");
    await vectorDbService.loadProgramsData(universitiesData);

    console.log("University data ingestion completed successfully!");
  } catch (error) {
    console.error("Error ingesting university data:", error);
    process.exit(1);
  }
}

// Run the script
ingestUniversityData().then(() => {
  console.log("Data ingestion script completed.");
  process.exit(0);
});
