import { Request, Response } from "express";
import BlogPost from "../models/BlogPost";

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

      const posts = await BlogPost.find({ status: "published" })
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username profilePicture");

      const total = await BlogPost.countDocuments({ status: "published" });

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

      const post = await BlogPost.findById(postId).populate(
        "author",
        "username profilePicture"
      );

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

      const posts = await BlogPost.find()
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username profilePicture");

      const total = await BlogPost.countDocuments();

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
};
