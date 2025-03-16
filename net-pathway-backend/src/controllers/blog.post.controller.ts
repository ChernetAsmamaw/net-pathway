import { Request, Response } from "express";
import BlogPost from "../models/BlogPost";
import mongoose from "mongoose";

export const blogController = {
  // Create a new blog post
  async createPost(req: Request, res: Response) {
    try {
      const { title, content, summary, tags, status, image } = req.body;

      if (!title || !content || !summary) {
        return res
          .status(400)
          .json({ message: "Title, content, and summary are required" });
      }

      const newPost = await BlogPost.create({
        title,
        content,
        summary,
        tags: tags || [],
        status: status || "draft",
        image: image || null,
        author: req.user?.userId,
        comments: [], // Initialize with empty comments array
      });

      res.status(201).json({
        message: "Blog post created successfully",
        post: newPost,
      });
    } catch (error: any) {
      console.error("Create blog post error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error creating blog post" });
    }
  },

  // Get all published blog posts
  async getPublishedPosts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = (req.query.search as string) || "";

      // Create search filter
      const searchFilter = search
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { summary: { $regex: search, $options: "i" } },
              { tags: { $in: [new RegExp(search, "i")] } },
            ],
            status: "published",
          }
        : { status: "published" };

      const posts = await BlogPost.find(searchFilter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username profilePicture");

      const total = await BlogPost.countDocuments(searchFilter);

      res.status(200).json({
        posts,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error("Get published posts error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving blog posts" });
    }
  },

  // Get a single blog post by ID
  async getPostById(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid blog post ID format" });
      }

      const post = await BlogPost.findById(postId)
        .populate("author", "username profilePicture")
        .populate("comments.author", "username profilePicture");

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Increment view count
      if (post.status === "published") {
        post.views += 1;
        await post.save();
      }

      res.status(200).json({ post });
    } catch (error: any) {
      console.error("Get post error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving blog post" });
    }
  },

  // Update a blog post
  async updatePost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { title, content, summary, tags, status, image } = req.body;

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid blog post ID format" });
      }

      // Find post
      const post = await BlogPost.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Check ownership or admin status
      if (
        post.author.toString() !== req.user?.userId &&
        req.user?.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this post" });
      }

      // Update fields
      if (title) post.title = title;
      if (content) post.content = content;
      if (summary) post.summary = summary;
      if (tags) post.tags = tags;
      if (status) post.status = status;
      if (image !== undefined) post.image = image; // Allow setting to null

      // If publishing for the first time
      if (status === "published" && !post.publishedAt) {
        post.publishedAt = new Date();
      }

      await post.save();

      res.status(200).json({
        message: "Blog post updated successfully",
        post,
      });
    } catch (error: any) {
      console.error("Update post error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error updating blog post" });
    }
  },

  // Delete a blog post
  async deletePost(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid blog post ID format" });
      }

      const post = await BlogPost.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Check ownership or admin status
      if (
        post.author.toString() !== req.user?.userId &&
        req.user?.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this post" });
      }

      await BlogPost.deleteOne({ _id: postId });

      res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (error: any) {
      console.error("Delete post error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error deleting blog post" });
    }
  },

  // Admin: Get all blog posts regardless of status
  async getAllPosts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const search = (req.query.search as string) || "";

      // Create search filter
      const searchFilter = search
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { summary: { $regex: search, $options: "i" } },
              { tags: { $in: [new RegExp(search, "i")] } },
            ],
          }
        : {};

      const posts = await BlogPost.find(searchFilter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username profilePicture");

      const total = await BlogPost.countDocuments(searchFilter);

      res.status(200).json({
        posts,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error: any) {
      console.error("Get all posts error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving blog posts" });
    }
  },

  // Add a comment to a blog post
  async addComment(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { content } = req.body;

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid blog post ID format" });
      }

      if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Comment content is required" });
      }

      const post = await BlogPost.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Can only comment on published posts
      if (post.status !== "published") {
        return res
          .status(400)
          .json({ message: "Can only comment on published posts" });
      }

      // Add the comment
      const comment = {
        content,
        author: req.user?.userId,
        createdAt: new Date(),
      };

      post.comments.push(comment);
      await post.save();

      // Fetch the populated comment for the response
      const updatedPost = await BlogPost.findById(postId).populate({
        path: "comments.author",
        select: "username profilePicture",
      });

      const newComment = updatedPost?.comments[updatedPost.comments.length - 1];

      res.status(201).json({
        message: "Comment added successfully",
        comment: newComment,
      });
    } catch (error: any) {
      console.error("Add comment error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error adding comment" });
    }
  },

  // Delete a comment from a blog post
  async deleteComment(req: Request, res: Response) {
    try {
      const { postId, commentId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(postId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
      ) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const post = await BlogPost.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Find the comment
      const comment = post.comments.id(commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Check if user is authorized to delete this comment
      if (
        comment.author.toString() !== req.user?.userId &&
        post.author.toString() !== req.user?.userId &&
        req.user?.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this comment" });
      }

      // Remove the comment
      comment.deleteOne();
      await post.save();

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error: any) {
      console.error("Delete comment error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error deleting comment" });
    }
  },

  // Get comments for a blog post
  async getComments(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ message: "Invalid blog post ID format" });
      }

      const post = await BlogPost.findById(postId).populate({
        path: "comments.author",
        select: "username profilePicture",
      });

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.status(200).json({
        comments: post.comments,
      });
    } catch (error: any) {
      console.error("Get comments error:", error);
      res
        .status(500)
        .json({ message: error.message || "Error retrieving comments" });
    }
  },
};
