import express, { Router, RequestHandler } from "express";
import { adminController } from "../controllers/admin.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router: Router = express.Router();

// Cast controller methods to RequestHandler type
const getAllUsersHandler = adminController.getAllUsers as RequestHandler;
const createAdminHandler = adminController.createAdmin as RequestHandler;
const updateUserRoleHandler = adminController.updateUserRole as RequestHandler;
const deleteUserHandler = adminController.deleteUser as RequestHandler;

// Admin routes - all protected with requireAuth and requireAdmin
router.get(
  "/users",
  requireAuth as RequestHandler,
  requireAdmin as RequestHandler,
  getAllUsersHandler
);

router.post(
  "/create-admin",
  requireAuth as RequestHandler,
  requireAdmin as RequestHandler,
  createAdminHandler
);

router.put(
  "/user-role",
  requireAuth as RequestHandler,
  requireAdmin as RequestHandler,
  updateUserRoleHandler
);

router.delete(
  "/users/:userId",
  requireAuth as RequestHandler,
  requireAdmin as RequestHandler,
  deleteUserHandler
);

export { router as adminRouter };
