// net-pathway-backend/src/routes/program.matching.routes.ts
import express, { Router, RequestHandler } from "express";
import { programMatchingController } from "../controllers/program.matching.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router: Router = express.Router();

// Cast controller methods to RequestHandler type
const generatePathwayHandler =
  programMatchingController.generatePersonalizedPathway as RequestHandler;

// Routes - protected with authentication
router.use(requireAuth as RequestHandler);

// Program matching endpoint
router.post("/generate", generatePathwayHandler);

export { router as programMatchingRouter };
