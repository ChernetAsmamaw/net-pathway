import express, { Router, Request, Response } from "express";
import { userController } from "../controllers/user.controller";
import { requireAuth, AuthRequest } from "../middleware/auth.middleware";

const router: Router = express.Router();

// Auth routes
router.post("/register", async (req: Request, res: Response) => {
  await userController.register(req, res);
});
router.post("/login", async (req: Request, res: Response) => {
  await userController.login(req, res);
});
router.post("/logout", async (req: Request, res: Response) => {
  await userController.logout(req, res);
});

// Protected routes
router.get("/profile", requireAuth, async (req: AuthRequest, res: Response) => {
  await userController.getProfile(req, res);
});

router.put("/profile", requireAuth, async (req: AuthRequest, res: Response) => {
  await userController.updateProfile(req, res);
});

// Add the missing deleteAccount route
router.delete(
  "/account",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    await userController.deleteAccount(req, res);
  }
);

export const userRouter = router;
