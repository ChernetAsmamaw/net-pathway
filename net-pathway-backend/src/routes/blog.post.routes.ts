import express, { Router, RequestHandler } from "express";
import { blogController } from "../controllers/blog.post.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router: Router = express.Router();

// Cast controller methods to RequestHandler type
const createPostHandler = blogController.createPost as RequestHandler;
const getPublishedPostsHandler =
  blogController.getPublishedPosts as RequestHandler;
const getPostByIdHandler = blogController.getPostById as RequestHandler;
const updatePostHandler = blogController.updatePost as RequestHandler;
const deletePostHandler = blogController.deletePost as RequestHandler;
const getAllPostsHandler = blogController.getAllPosts as RequestHandler;

// Public routes
router.get("/published", getPublishedPostsHandler);
router.get("/:postId", getPostByIdHandler);

// Protected routes - require authentication
router.post("/", requireAuth as RequestHandler, createPostHandler);

router.put("/:postId", requireAuth as RequestHandler, updatePostHandler);

router.delete("/:postId", requireAuth as RequestHandler, deletePostHandler);

// Admin routes
router.get(
  "/admin/all",
  requireAuth as RequestHandler,
  requireAdmin as RequestHandler,
  getAllPostsHandler
);

export { router as blogRouter };
