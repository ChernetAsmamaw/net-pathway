// net-pathway-backend/src/controllers/chat.controller.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Chat from "../models/Chat";
import User from "../models/User";
import Mentor from "../models/Mentor";

export const chatController = {
  // Initialize or get an existing chat with a mentor
  async initializeChat(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { mentorId } = req.params; // This is the Mentor profile ID, not User ID

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        return res.status(400).json({ message: "Invalid mentor ID format" });
      }

      // Find the mentor profile to get both mentor details and user ID
      const mentorProfile = await Mentor.findById(mentorId);
      if (!mentorProfile) {
        return res.status(404).json({ message: "Mentor not found" });
      }

      // Get the mentor's user ID from the profile
      const mentorUserId = mentorProfile.user.toString();

      // Check if the user is trying to chat with themselves
      if (userId === mentorUserId) {
        return res.status(400).json({ message: "Cannot chat with yourself" });
      }

      // Check if a chat already exists between these users
      let chat = await Chat.findOne({
        initiator: userId,
        mentor: mentorUserId,
        mentorProfile: mentorId,
      });

      // If chat exists, return it
      if (chat) {
        // Populate user details
        await chat.populate([
          { path: "initiator", select: "username profilePicture" },
          { path: "mentor", select: "username profilePicture" },
          { path: "mentorProfile", select: "title company expertise" },
          { path: "messages.sender", select: "username profilePicture" },
        ]);

        // Remove current user from unreadBy
        if (chat.unreadBy.includes(userId as any)) {
          chat.unreadBy = chat.unreadBy.filter(
            (id) => id.toString() !== userId
          );
          await chat.save();
        }

        return res.status(200).json({ chat });
      }

      // Create a new chat
      chat = await Chat.create({
        initiator: userId,
        mentor: mentorUserId,
        mentorProfile: mentorId,
        messages: [],
        unreadBy: [],
      });

      // Populate user details
      await chat.populate([
        { path: "initiator", select: "username profilePicture" },
        { path: "mentor", select: "username profilePicture" },
        { path: "mentorProfile", select: "title company expertise" },
      ]);

      res.status(201).json({
        message: "Chat initialized",
        chat,
      });
    } catch (error: any) {
      console.error("Initialize chat error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error initializing chat" });
    }
  },

  // Get all chats for the current user (both as initiator and mentor)
  async getUserChats(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Find all chats where user is either initiator or mentor
      const chats = await Chat.find({
        $or: [{ initiator: userId }, { mentor: userId }],
        isActive: true,
      })
        .sort({ lastMessage: -1 })
        .populate("initiator", "username profilePicture")
        .populate("mentor", "username profilePicture")
        .populate("mentorProfile", "title company expertise");

      // Get unread counts
      const unreadCounts: Record<string, number> = {};
      chats.forEach((chat) => {
        const chatId = chat._id.toString();
        unreadCounts[chatId] = chat.unreadBy.some(
          (id) => id.toString() === userId
        )
          ? 1
          : 0;
      });

      res.status(200).json({
        chats,
        unreadCounts,
      });
    } catch (error: any) {
      console.error("Get user chats error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving chats" });
    }
  },

  // Get a single chat by ID
  async getChatById(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID format" });
      }

      // Find the chat and ensure the user is a participant
      const chat = await Chat.findOne({
        _id: chatId,
        $or: [{ initiator: userId }, { mentor: userId }],
      })
        .populate("initiator", "username profilePicture")
        .populate("mentor", "username profilePicture")
        .populate("mentorProfile", "title company expertise")
        .populate("messages.sender", "username profilePicture");

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Remove current user from unreadBy (mark messages as read)
      if (chat.unreadBy.includes(userId as any)) {
        chat.unreadBy = chat.unreadBy.filter((id) => id.toString() !== userId);
        await chat.save();
      }

      res.status(200).json({ chat });
    } catch (error: any) {
      console.error("Get chat error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving chat" });
    }
  },

  // Send a message in a chat
  async sendMessage(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const { content } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID format" });
      }

      if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Find the chat and ensure the user is a participant
      const chat = await Chat.findOne({
        _id: chatId,
        $or: [{ initiator: userId }, { mentor: userId }],
      });

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Add the message
      chat.messages.push({
        sender: userId,
        content,
        read: false,
        createdAt: new Date(),
      } as any);

      // Update lastActivity and unreadBy - handled by the pre-save hook in the model
      await chat.save();

      // Get the populated chat to return
      const updatedChat = await Chat.findById(chatId)
        .populate("initiator", "username profilePicture")
        .populate("mentor", "username profilePicture")
        .populate("mentorProfile", "title company expertise")
        .populate("messages.sender", "username profilePicture");

      const newMessage =
        updatedChat!.messages[updatedChat!.messages.length - 1];

      res.status(201).json({
        message: "Message sent",
        chatMessage: newMessage,
        chat: updatedChat,
      });
    } catch (error: any) {
      console.error("Send message error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error sending message" });
    }
  },

  // Mark all messages in a chat as read
  async markChatAsRead(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID format" });
      }

      // Find the chat and ensure the user is a participant
      const chat = await Chat.findOne({
        _id: chatId,
        $or: [{ initiator: userId }, { mentor: userId }],
      });

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Remove the user from unreadBy array
      if (chat.unreadBy.includes(userId as any)) {
        chat.unreadBy = chat.unreadBy.filter((id) => id.toString() !== userId);
        await chat.save();
      }

      res.status(200).json({
        message: "Chat marked as read",
      });
    } catch (error: any) {
      console.error("Mark chat as read error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error marking chat as read" });
    }
  },

  // Get unread chats count
  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Count chats where user is in the unreadBy array
      const count = await Chat.countDocuments({
        unreadBy: userId,
        isActive: true,
      });

      res.status(200).json({ unreadCount: count });
    } catch (error: any) {
      console.error("Get unread count error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error getting unread count" });
    }
  },

  // Archive a chat (soft delete)
  async archiveChat(req: Request, res: Response) {
    try {
      const { chatId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID format" });
      }

      // Find the chat and ensure the user is a participant
      const chat = await Chat.findOne({
        _id: chatId,
        $or: [{ initiator: userId }, { mentor: userId }],
      });

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Soft delete the chat
      chat.isActive = false;
      await chat.save();

      res.status(200).json({
        message: "Chat archived successfully",
      });
    } catch (error: any) {
      console.error("Archive chat error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error archiving chat" });
    }
  },
};
