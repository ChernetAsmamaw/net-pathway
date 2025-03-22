import express, { Router, RequestHandler } from "express";
import { verificationController } from "../controllers/verification.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router: Router = express.Router();

// Cast controller methods to RequestHandler type
const sendVerificationEmailHandler =
  verificationController.sendVerificationEmail as RequestHandler;
const verifyEmailHandler = verificationController.verifyEmail as RequestHandler;
const checkVerificationStatusHandler =
  verificationController.checkVerificationStatus as RequestHandler;

// Routes
router.post(
  "/send",
  requireAuth as RequestHandler,
  sendVerificationEmailHandler
);
router.get("/verify", verifyEmailHandler);
router.get(
  "/status",
  requireAuth as RequestHandler,
  checkVerificationStatusHandler
);

export { router as verificationRouter };
