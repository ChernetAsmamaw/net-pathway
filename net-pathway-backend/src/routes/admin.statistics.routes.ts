import express, { Router, RequestHandler } from "express";
import { adminStatisticsController } from "../controllers/admin.statistics.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router: Router = express.Router();

// Cast controller methods to RequestHandler type
const getStatisticsHandler =
  adminStatisticsController.getStatistics as RequestHandler;

// Admin statistics route
router.get(
  "/statistics",
  requireAuth as RequestHandler,
  requireAdmin as RequestHandler,
  getStatisticsHandler
);

export { router as adminStatisticsRouter };
