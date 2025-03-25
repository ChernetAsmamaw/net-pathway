import express, { Router, RequestHandler } from "express";
import { assessmentController } from "../controllers/assessment.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router: Router = express.Router();

// Cast controller methods to RequestHandler type
const saveBehavioralAssessmentHandler =
  assessmentController.saveBehavioralAssessment as RequestHandler;
const getBehavioralAssessmentHandler =
  assessmentController.getBehavioralAssessment as RequestHandler;

// Routes that require authentication
router.use(requireAuth as RequestHandler);

// Assessment endpoints
router.post("/behavioral", saveBehavioralAssessmentHandler);
router.get("/behavioral", getBehavioralAssessmentHandler);

export { router as assessmentRouter };
