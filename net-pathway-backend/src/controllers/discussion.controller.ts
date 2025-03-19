import { Request, Response } from "express";
import Discussion from "../models/Discussion";
import User from "../models/User";
import mongoose from "mongoose";

export const discussionController = {
  // Create a new discussion
  async createDiscussion(req: Request, res: Response) {
    try {
      const { title, description, tags } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!title || !description) {
        return res
          .status(400)
          .json({ message: "Title and description are required" });
      }

      // Create the discussion
      const newDiscussion = await Discussion.create({
        title,
        description,
        creator: userId,
        participants: [userId], // Creator is automatically a participant
        tags: tags || [],
        messages: [], // Start with no messages
      });

      // Populate the creator information
      const populatedDiscussion = await Discussion.findById(newDiscussion._id)
        .populate("creator", "username profilePicture")
        .populate("participants", "username profilePicture");

      res.status(201).json({
        message: "Discussion created successfully",
        discussion: populatedDiscussion,
      });
    } catch (error: any) {
      console.error("Create discussion error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error creating discussion" });
    }
  },

  // Get all discussions (with filtering options)
  async getAllDiscussions(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const search = req.query.search as string;
      const tag = req.query.tag as string;
      const sort = (req.query.sort as string) || "latest";

      // Build query
      const query: any = { isActive: true };

      // Add search filter
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Add tag filter
      if (tag) {
        query.tags = { $in: [tag] };
      }

      // Determine sort order
      let sortOption: any = {};
      switch (sort) {
        case "oldest":
          sortOption = { createdAt: 1 };
          break;
        case "activity":
          sortOption = { lastActivity: -1 };
          break;
        case "popular":
          sortOption = { "participants.length": -1 };
          break;
        case "latest":
        default:
          sortOption = { createdAt: -1 };
          break;
      }

      // Execute query
      const discussions = await Discussion.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate("creator", "username profilePicture")
        .populate("participants", "username profilePicture")
        .select("-messages"); // Exclude messages for listing

      // Get total count for pagination
      const total = await Discussion.countDocuments(query);

      res.status(200).json({
        discussions,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      });
    } catch (error: any) {
      console.error("Get discussions error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving discussions" });
    }
  },

  // Get a single discussion with messages
  async getDiscussionById(req: Request, res: Response) {
    try {
      const { discussionId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!mongoose.Types.ObjectId.isValid(discussionId)) {
        return res
          .status(400)
          .json({ message: "Invalid discussion ID format" });
      }

      const discussion = await Discussion.findById(discussionId)
        .populate("creator", "username profilePicture")
        .populate("participants", "username profilePicture")
        .populate("messages.sender", "username profilePicture");

      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }

      // Add user to participants if not already included
      if (!discussion.participants.some((p) => p._id.toString() === userId)) {
        discussion.participants.push(userId as any);
        await discussion.save();
      }

      res.status(200).json({ discussion });
    } catch (error: any) {
      console.error("Get discussion error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving discussion" });
    }
  },

  // Add a message to a discussion
  async addMessage(req: Request, res: Response) {
    try {
      const { discussionId } = req.params;
      const { content } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!mongoose.Types.ObjectId.isValid(discussionId)) {
        return res
          .status(400)
          .json({ message: "Invalid discussion ID format" });
      }

      if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Find the discussion
      const discussion = await Discussion.findById(discussionId);

      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }

      // Add the message
      discussion.messages.push({
        content,
        sender: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      // Add user to participants if not already included
      if (!discussion.participants.includes(userId as any)) {
        discussion.participants.push(userId as any);
      }

      // Update lastActivity
      discussion.lastActivity = new Date();
      await discussion.save();

      // Get the populated message to return
      const updatedDiscussion = await Discussion.findById(
        discussionId
      ).populate("messages.sender", "username profilePicture");

      const newMessage =
        updatedDiscussion!.messages[updatedDiscussion!.messages.length - 1];

      res.status(201).json({
        message: "Message added successfully",
        discussionMessage: newMessage,
      });
    } catch (error: any) {
      console.error("Add message error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error adding message" });
    }
  },

  // Get messages for a discussion (with pagination)
  async getMessages(req: Request, res: Response) {
    try {
      const { discussionId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      if (!mongoose.Types.ObjectId.isValid(discussionId)) {
        return res
          .status(400)
          .json({ message: "Invalid discussion ID format" });
      }

      const discussion = await Discussion.findById(discussionId)
        .populate({
          path: "messages.sender",
          select: "username profilePicture",
        })
        .slice("messages", [(page - 1) * limit, limit]);

      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }

      // Get total messages count for pagination
      const totalMessages = await Discussion.findById(discussionId).select(
        "messages"
      );

      const total = totalMessages?.messages.length || 0;

      res.status(200).json({
        messages: discussion.messages,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      });
    } catch (error: any) {
      console.error("Get messages error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving messages" });
    }
  },

  // Update a discussion (title, description, tags)
  async updateDiscussion(req: Request, res: Response) {
    try {
      const { discussionId } = req.params;
      const { title, description, tags } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!mongoose.Types.ObjectId.isValid(discussionId)) {
        return res
          .status(400)
          .json({ message: "Invalid discussion ID format" });
      }

      // Find the discussion
      const discussion = await Discussion.findById(discussionId);

      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }

      // Check if user is the creator or admin
      if (
        discussion.creator.toString() !== userId &&
        req.user?.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this discussion" });
      }

      // Update fields
      if (title) discussion.title = title;
      if (description) discussion.description = description;
      if (tags) discussion.tags = tags;

      discussion.updatedAt = new Date();
      await discussion.save();

      const updatedDiscussion = await Discussion.findById(discussionId)
        .populate("creator", "username profilePicture")
        .populate("participants", "username profilePicture");

      res.status(200).json({
        message: "Discussion updated successfully",
        discussion: updatedDiscussion,
      });
    } catch (error: any) {
      console.error("Update discussion error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error updating discussion" });
    }
  },

  // Delete a discussion
  async deleteDiscussion(req: Request, res: Response) {
    try {
      const { discussionId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (!mongoose.Types.ObjectId.isValid(discussionId)) {
        return res
          .status(400)
          .json({ message: "Invalid discussion ID format" });
      }

      const discussion = await Discussion.findById(discussionId);

      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }

      // Check if user is the creator or admin
      if (
        discussion.creator.toString() !== userId &&
        req.user?.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this discussion" });
      }

      // Soft delete by marking as inactive
      discussion.isActive = false;
      await discussion.save();

      res.status(200).json({ message: "Discussion deleted successfully" });
    } catch (error: any) {
      console.error("Delete discussion error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error deleting discussion" });
    }
  },

  // Get popular tags
  async getPopularTags(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;

      // Aggregate to find most used tags
      const tags = await Discussion.aggregate([
        { $match: { isActive: true } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
        { $project: { _id: 0, tag: "$_id", count: 1 } },
      ]);

      res.status(200).json({ tags });
    } catch (error: any) {
      console.error("Get popular tags error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving tags" });
    }
  },

  // Delete a message
  async deleteMessage(req: Request, res: Response) {
    try {
      const { discussionId, messageId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      if (
        !mongoose.Types.ObjectId.isValid(discussionId) ||
        !mongoose.Types.ObjectId.isValid(messageId)
      ) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const discussion = await Discussion.findById(discussionId);

      if (!discussion) {
        return res.status(404).json({ message: "Discussion not found" });
      }

      // Find the message
      const messageIndex = discussion.messages.findIndex(
        (msg) => msg._id.toString() === messageId
      );

      if (messageIndex === -1) {
        return res.status(404).json({ message: "Message not found" });
      }

      const message = discussion.messages[messageIndex];

      // Check if user is the message sender, discussion creator, or admin
      if (
        message.sender.toString() !== userId &&
        discussion.creator.toString() !== userId &&
        req.user?.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this message" });
      }

      // Remove the message
      discussion.messages.splice(messageIndex, 1);
      await discussion.save();

      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error: any) {
      console.error("Delete message error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error deleting message" });
    }
  },

  // Get user's discussions
  async getUserDiscussions(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Find discussions where user is a participant
      const discussions = await Discussion.find({
        participants: userId,
        isActive: true,
      })
        .sort({ lastActivity: -1 })
        .skip(skip)
        .limit(limit)
        .populate("creator", "username profilePicture")
        .select("-messages"); // Exclude messages for listing

      // Get total count
      const total = await Discussion.countDocuments({
        participants: userId,
        isActive: true,
      });

      res.status(200).json({
        discussions,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error("Get user discussions error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving discussions" });
    }
  },
};
