import express, { Router, RequestHandler } from "express";
import { mentorController } from "../controllers/mentor.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router: Router = express.Router();

// Cast controller methods to RequestHandler type
const createMentorHandler = mentorController.createMentor as RequestHandler;
const getAllMentorsHandler = mentorController.getAllMentors as RequestHandler;
const getMentorByIdHandler = mentorController.getMentorById as RequestHandler;
const updateMentorHandler = mentorController.updateMentor as RequestHandler;
const deleteMentorHandler = mentorController.deleteMentor as RequestHandler;
const toggleMentorStatusHandler =
  mentorController.toggleMentorStatus as RequestHandler;
const getCurrentMentorProfileHandler =
  mentorController.getCurrentMentorProfile as RequestHandler;

// Public routes
router.get("/", getAllMentorsHandler);
router.get("/:mentorId", getMentorByIdHandler);

// Protected routes - require authentication
router.get(
  "/profile/me",
  requireAuth as RequestHandler,
  getCurrentMentorProfileHandler
);

router.post("/", requireAuth as RequestHandler, createMentorHandler);

router.put("/:mentorId", requireAuth as RequestHandler, updateMentorHandler);

router.patch(
  "/:mentorId/toggle-status",
  requireAuth as RequestHandler,
  toggleMentorStatusHandler
);

// Admin only routes
router.delete(
  "/:mentorId",
  requireAuth as RequestHandler,
  requireAdmin as RequestHandler,
  deleteMentorHandler
);

export { router as mentorRouter };
