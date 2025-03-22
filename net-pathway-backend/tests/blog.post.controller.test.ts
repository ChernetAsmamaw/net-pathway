import { blogController } from "../src/controllers/blog.post.controller";
import BlogPost from "../src/models/BlogPost";
import mongoose from "mongoose";

// Mock dependencies
jest.mock("../src/models/BlogPost");
jest.mock("mongoose");

// Update the BlogPost mock at the top of the file
jest.mock("../src/models/BlogPost", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

describe("Blog Post Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      user: { userId: "mockUserId", role: "user" },
      body: {},
      params: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createPost", () => {
    it("should create a blog post successfully", async () => {
      // Arrange
      req.body = {
        title: "Test Blog Post",
        content: "This is a test blog post content.",
        summary: "A test blog post.",
        tags: ["test", "blog"],
        status: "draft",
      };

      const mockBlogPost = {
        _id: "mockPostId",
        title: "Test Blog Post",
        content: "This is a test blog post content.",
        summary: "A test blog post.",
        tags: ["test", "blog"],
        status: "draft",
        author: "mockUserId",
        comments: [],
      };

      (BlogPost.create as jest.Mock).mockResolvedValueOnce(mockBlogPost);

      // Act
      await blogController.createPost(req, res);

      // Assert
      expect(BlogPost.create).toHaveBeenCalledWith({
        title: "Test Blog Post",
        content: "This is a test blog post content.",
        summary: "A test blog post.",
        tags: ["test", "blog"],
        status: "draft",
        author: "mockUserId",
        comments: [],
        image: null,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Blog post created successfully",
        post: mockBlogPost,
      });
    });

    it("should return 400 if required fields are missing", async () => {
      // Arrange
      req.body = {
        title: "Test Blog Post",
        // Missing content and summary
        tags: ["test", "blog"],
        status: "draft",
      };

      // Act
      await blogController.createPost(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Title, content, and summary are required",
      });
    });
  });

  describe("getPublishedPosts", () => {
    it("should get published posts with pagination", async () => {
      // Arrange
      req.query = {
        page: "1",
        limit: "10",
        search: "test",
      };

      const mockPosts = [
        { _id: "post1", title: "Test Post 1" },
        { _id: "post2", title: "Test Post 2" },
      ];

      const mockPopulate = jest.fn().mockResolvedValueOnce(mockPosts);
      const mockLimit = jest.fn().mockReturnThis();
      const mockSkip = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockReturnThis();

      (BlogPost.find as jest.Mock).mockReturnValueOnce({
        sort: mockSort,
        skip: mockSkip,
        limit: mockLimit,
        populate: mockPopulate,
      });

      (BlogPost.countDocuments as jest.Mock).mockResolvedValue(15);

      // Act
      await blogController.getPublishedPosts(req, res);

      // Assert
      expect(BlogPost.find).toHaveBeenCalledWith(expect.any(Object));
      expect(mockSort).toHaveBeenCalledWith({ publishedAt: -1 });
      expect(mockSkip).toHaveBeenCalledWith(0);
      expect(mockLimit).toHaveBeenCalledWith(10);
      expect(mockPopulate).toHaveBeenCalledWith(
        "author",
        "username profilePicture"
      );
      expect(BlogPost.countDocuments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        posts: mockPosts,
        pagination: {
          total: 15,
          page: 1,
          pages: 2,
        },
      });
    });
  });

  describe("getPostById", () => {
    it("should get a blog post by ID", async () => {
      // Arrange
      req.params.postId = "mockPostId";

      interface MockBlogPost {
        _id: string;
        title: string;
        views: number;
        save: jest.Mock;
      }

      const mockPost: MockBlogPost = {
        _id: "mockPostId",
        title: "Test Post",
        views: 5,
        save: jest.fn().mockImplementation(async function (this: MockBlogPost) {
          this.views = 6;
          return this;
        }),
      };

      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);

      const mockPopulate1 = jest.fn().mockReturnThis();
      const mockPopulate2 = jest.fn().mockResolvedValue(mockPost);

      (BlogPost.findById as jest.Mock).mockReturnValue({
        populate: mockPopulate1,
      });

      mockPopulate1.mockImplementation(() => ({
        populate: mockPopulate2,
      }));

      // Act & Assert remain the same
    });

    it("should return 400 if ID format is invalid", async () => {
      // Arrange
      req.params.postId = "invalidId";
      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(false);

      // Act
      await blogController.getPostById(req, res);

      // Assert
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith("invalidId");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid blog post ID format",
      });
    });

    it("should return 404 if post not found", async () => {
      // Arrange
      req.params.postId = "nonExistentId";
      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);

      const mockPopulate1 = jest.fn().mockReturnThis();
      const mockPopulate2 = jest.fn().mockResolvedValue(null);

      (BlogPost.findById as jest.Mock).mockReturnValue({
        populate: mockPopulate1,
      });

      mockPopulate1.mockImplementation(() => ({
        populate: mockPopulate2,
      }));

      // Act
      await blogController.getPostById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Blog post not found",
      });
    });
  });

  // Additional tests for updatePost, deletePost, addComment, etc.
});
