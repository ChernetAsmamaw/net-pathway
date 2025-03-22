import express, { Router, RequestHandler } from "express";
import { verificationController } from "../controllers/verification.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router: Router = express.Router();

// Cast controller methods to RequestHandler type
const sendVerificationCodeHandler =
  verificationController.sendVerificationCode as RequestHandler;
const verifyCodeHandler = verificationController.verifyCode as RequestHandler;
const checkVerificationStatusHandler =
  verificationController.checkVerificationStatus as RequestHandler;

// Routes
router.post(
  "/send-code",
  requireAuth as RequestHandler,
  sendVerificationCodeHandler
);
router.post("/verify-code", requireAuth as RequestHandler, verifyCodeHandler);
router.get(
  "/status",
  requireAuth as RequestHandler,
  checkVerificationStatusHandler
);

export { router as verificationRouter };
