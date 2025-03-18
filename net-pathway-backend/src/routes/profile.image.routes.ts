// net-pathway-backend/src/routes/profile.image.routes.ts
import express, { Router, RequestHandler } from "express";
import { profileImageController } from "../controllers/profile.image.controller";
import { requireAuth } from "../middleware/auth.middleware";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const router: Router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    // Accept only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Cast controller methods to RequestHandler type
const uploadProfileImageHandler =
  profileImageController.uploadProfileImage as RequestHandler;
const deleteProfileImageHandler =
  profileImageController.deleteProfileImage as RequestHandler;

// Routes
router.post(
  "/upload",
  requireAuth as RequestHandler,
  upload.single("image"),
  uploadProfileImageHandler
);

router.delete("/", requireAuth as RequestHandler, deleteProfileImageHandler);

export { router as profileImageRouter };
