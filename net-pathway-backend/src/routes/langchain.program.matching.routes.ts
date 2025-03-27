// net-pathway-backend/src/routes/langchain.program.matching.routes.ts
import express, { Router, RequestHandler } from "express";
import multer from "multer";
import { langchainProgramMatchingController } from "../controllers/langchain.program.matching.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router: Router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept common document formats
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, Word, and image files are allowed."
        ) as any
      );
    }
  },
});

// Cast controller methods to RequestHandler type
const matchProgramsHandler =
  langchainProgramMatchingController.matchPrograms as RequestHandler;
const analyzeTranscriptHandler =
  langchainProgramMatchingController.analyzeTranscript as RequestHandler;
const reinitializeVectorStoreHandler =
  langchainProgramMatchingController.reinitializeVectorStore as RequestHandler;

// Routes - all protected with authentication
router.use(requireAuth as RequestHandler);

// Program matching endpoint
router.post("/match", matchProgramsHandler);

// Transcript analysis endpoint
router.post(
  "/transcript/analyze",
  upload.single("transcript"),
  analyzeTranscriptHandler
);

// Admin-only endpoint to reinitialize vector store
router.post(
  "/reinitialize",
  requireAdmin as RequestHandler,
  reinitializeVectorStoreHandler
);

export { router as langchainProgramMatchingRouter };
