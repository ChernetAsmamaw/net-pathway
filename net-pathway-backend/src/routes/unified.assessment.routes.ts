// net-pathway-backend/src/routes/unified.assessment.routes.ts
import express, { Router, RequestHandler } from "express";
import { unifiedAssessmentController } from "../controllers/unified.assessment.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router: Router = express.Router();

// Cast controller methods to RequestHandler type
const saveAcademicTranscriptHandler =
  unifiedAssessmentController.saveAcademicTranscript as RequestHandler;
const saveExtracurricularsHandler =
  unifiedAssessmentController.saveExtracurriculars as RequestHandler;
const saveBehavioralAssessmentHandler =
  unifiedAssessmentController.saveBehavioralAssessment as RequestHandler;
const getAssessmentStatusHandler =
  unifiedAssessmentController.getAssessmentStatus as RequestHandler;
const getCombinedAssessmentDataHandler =
  unifiedAssessmentController.getCombinedAssessmentData as RequestHandler;

// Routes that require authentication
router.use(requireAuth as RequestHandler);

// Assessment endpoints
router.post("/academic-transcript", saveAcademicTranscriptHandler);
router.post("/extracurricular", saveExtracurricularsHandler);
router.post("/behavioral", saveBehavioralAssessmentHandler);
router.get("/status", getAssessmentStatusHandler);
router.get("/combined-data", getCombinedAssessmentDataHandler);

export { router as unifiedAssessmentRouter };
