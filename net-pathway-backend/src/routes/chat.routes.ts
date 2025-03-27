// net-pathway-backend/src/routes/chat.routes.ts
import express, { Router, RequestHandler } from "express";
import { chatController } from "../controllers/chat.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router: Router = express.Router();

// Cast controller methods to RequestHandler type
const initializeChatHandler = chatController.initializeChat as RequestHandler;
const getUserChatsHandler = chatController.getUserChats as RequestHandler;
const getChatByIdHandler = chatController.getChatById as RequestHandler;
const sendMessageHandler = chatController.sendMessage as RequestHandler;
const markChatAsReadHandler = chatController.markChatAsRead as RequestHandler;
const getUnreadCountHandler = chatController.getUnreadCount as RequestHandler;
const archiveChatHandler = chatController.archiveChat as RequestHandler;

// All routes require authentication
router.use(requireAuth as RequestHandler);

// Initialize or get chat with a mentor
router.post("/mentor/:mentorId", initializeChatHandler);

// Get all user chats
router.get("/", getUserChatsHandler);

// Get unread chats count
router.get("/unread", getUnreadCountHandler);

// Get single chat by ID
router.get("/:chatId", getChatByIdHandler);

// Send a message in a chat
router.post("/:chatId/messages", sendMessageHandler);

// Mark chat as read
router.patch("/:chatId/read", markChatAsReadHandler);

// Archive a chat (soft delete)
router.patch("/:chatId/archive", archiveChatHandler);

export { router as chatRouter };
