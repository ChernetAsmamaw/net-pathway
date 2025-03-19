// net-pathway-backend/src/routes/discussion.routes.ts
import express, { Router, RequestHandler } from "express";
import { discussionController } from "../controllers/discussion.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";

const router: Router = express.Router();

// Cast controller methods to RequestHandler type
const createDiscussionHandler =
  discussionController.createDiscussion as RequestHandler;
const getAllDiscussionsHandler =
  discussionController.getAllDiscussions as RequestHandler;
const getDiscussionByIdHandler =
  discussionController.getDiscussionById as RequestHandler;
const addMessageHandler = discussionController.addMessage as RequestHandler;
const getMessagesHandler = discussionController.getMessages as RequestHandler;
const updateDiscussionHandler =
  discussionController.updateDiscussion as RequestHandler;
const deleteDiscussionHandler =
  discussionController.deleteDiscussion as RequestHandler;
const getPopularTagsHandler =
  discussionController.getPopularTags as RequestHandler;
const deleteMessageHandler =
  discussionController.deleteMessage as RequestHandler;
const getUserDiscussionsHandler =
  discussionController.getUserDiscussions as RequestHandler;

// Routes that require authentication
router.use(requireAuth as RequestHandler);

// Discussion CRUD operations
router.post("/", createDiscussionHandler);
router.get("/", getAllDiscussionsHandler);
router.get("/tags", getPopularTagsHandler);
router.get("/user", getUserDiscussionsHandler);
router.get("/:discussionId", getDiscussionByIdHandler);
router.put("/:discussionId", updateDiscussionHandler);
router.delete("/:discussionId", deleteDiscussionHandler);

// Message operations
router.post("/:discussionId/messages", addMessageHandler);
router.get("/:discussionId/messages", getMessagesHandler);
router.delete("/:discussionId/messages/:messageId", deleteMessageHandler);

export { router as discussionRouter };
