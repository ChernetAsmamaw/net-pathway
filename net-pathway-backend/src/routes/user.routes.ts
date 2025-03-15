import express, { Router, Request, Response } from "express";
import { userController } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import passport from "passport";
import { configurePassport } from "../config/passport";
import jwt from "jsonwebtoken";

// Initialize passport configuration
configurePassport();

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

// Protected routes - now using standard Request type
router.get("/profile", requireAuth, async (req: Request, res: Response) => {
  await userController.getProfile(req, res);
});

router.put("/profile", requireAuth, async (req: Request, res: Response) => {
  await userController.updateProfile(req, res);
});

// Delete account route
router.delete("/account", requireAuth, async (req: Request, res: Response) => {
  await userController.deleteAccount(req, res);
});

// Google OAuth routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    try {
      // Get the user from the request (added by passport)
      const user = req.user as any;

      if (!user) {
        console.error("No user data received from Google authentication");
        return res.redirect(
          `${process.env.FRONTEND_URL}/auth/login?error=no_user_data`
        );
      }

      // Create JWT token with user ID and role
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "48h" }
      );

      // Set the token as an HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only in production
        sameSite: "lax", // Less restrictive for 3rd party auth
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });

      // Prepare user data for frontend
      const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || null,
      };

      // Encode user data for URL to avoid storing sensitive info in localStorage
      const encodedUserData = encodeURIComponent(JSON.stringify(userData));

      // Redirect to frontend callback URL with token and encoded user data
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&userData=${encodedUserData}`
      );
    } catch (error: any) {
      console.error("Google auth error:", error);
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/login?error=google_auth_failed`
      );
    }
  }
);

export const userRouter = router;
