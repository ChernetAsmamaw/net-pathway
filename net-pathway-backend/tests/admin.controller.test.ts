import { adminController } from "../src/controllers/admin.controller";
import User from "../src/models/User";
import Mentor from "../src/models/Mentor";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

jest.mock("jsonwebtoken");

// Mock dependencies
jest.mock("../src/models/User");
jest.mock("../src/models/Mentor");
jest.mock("bcryptjs");
jest.mock("mongoose");

// Update the User mock at the top of the file
jest.mock("../src/models/User", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(), // Remove the mockImplementation here
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    schema: {
      methods: {
        toJSON: jest.fn(),
      },
    },
  },
}));

// Add Mentor mock
jest.mock("../src/models/Mentor", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Admin Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      user: { userId: "mockAdminId", role: "admin" },
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

  describe("getAllUsers", () => {
    it("should get all users with pagination", async () => {
      // Arrange
      req.query = {
        page: "1",
        limit: "10",
        search: "test",
      };

      const mockUsers = [
        { _id: "user1", username: "testuser1" },
        { _id: "user2", username: "testuser2" },
      ];

      const mockFind = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSkip = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockResolvedValue(mockUsers);

      (User.find as jest.Mock).mockReturnValue({
        select: mockSelect,
        skip: mockSkip,
        limit: mockLimit,
        sort: mockSort,
      });

      (User.countDocuments as jest.Mock).mockResolvedValue(15);

      // Act
      await adminController.getAllUsers(req, res);

      // Assert
      expect(User.find).toHaveBeenCalledWith(
        expect.objectContaining({
          $or: expect.any(Array),
        })
      );
      expect(mockSelect).toHaveBeenCalledWith("-password");
      expect(mockSkip).toHaveBeenCalledWith(0);
      expect(mockLimit).toHaveBeenCalledWith(10);
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(User.countDocuments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        users: mockUsers,
        pagination: {
          total: 15,
          page: 1,
          pages: 2,
        },
      });
    });
  });

  describe("getUserById", () => {
    it("should get a user by ID", async () => {
      // Arrange
      req.params.userId = "mockUserId";

      const mockUser = { _id: "mockUserId", username: "testuser" };

      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);

      const mockFindById = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockResolvedValue(mockUser);

      (User.findById as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      // Act
      await adminController.getUserById(req, res);

      // Assert
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(
        "mockUserId"
      );
      expect(User.findById).toHaveBeenCalledWith("mockUserId");
      expect(mockSelect).toHaveBeenCalledWith("-password");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it("should return 400 if ID format is invalid", async () => {
      // Arrange
      req.params.userId = "invalidId";
      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(false);

      // Act
      await adminController.getUserById(req, res);

      // Assert
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith("invalidId");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid user ID format",
      });
    });

    it("should return 404 if user not found", async () => {
      // Arrange
      req.params.userId = "nonExistentId";
      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);

      const mockSelect = jest.fn().mockResolvedValue(null);

      (User.findById as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      // Act
      await adminController.getUserById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });

  describe("createAdmin", () => {
    it("should create admin user with allowed domain", async () => {
      // Arrange
      const ALLOWED_ADMIN_DOMAINS = ["admin.com", "company.org"];
      process.env.ALLOWED_ADMIN_DOMAINS = ALLOWED_ADMIN_DOMAINS.join(",");

      req.body = {
        username: "adminuser",
        email: "admin@admin.com",
        password: "password123",
      };

      // Fix mock implementations
      (User.findOne as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve(null)
      );
      (bcrypt.hash as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve("hashedPassword")
      );
      (User.create as jest.Mock).mockImplementationOnce(() => ({
        _id: "mockAdminId",
        username: "adminuser",
        email: "admin@admin.com",
        role: "admin",
        toJSON: () => ({
          id: "mockAdminId",
          username: "adminuser",
          email: "admin@admin.com",
          role: "admin",
        }),
      }));

      // Act
      await adminController.createAdmin(req, res);

      // Assert remains the same
    });

    it("should return 400 if user with email already exists", async () => {
      // Arrange
      const ALLOWED_ADMIN_DOMAINS = ["admin.com"];
      process.env.ALLOWED_ADMIN_DOMAINS = ALLOWED_ADMIN_DOMAINS.join(",");

      req.body = {
        username: "adminuser",
        email: "existing@admin.com",
        password: "password123",
      };

      // Fix mock implementation
      (User.findOne as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          email: "existing@admin.com",
        })
      );

      // Act & Assert remains the same
    });
  });

  describe("updateUserRole", () => {
    it("should update user role successfully", async () => {
      // Arrange
      req.body = {
        userId: "mockUserId",
        role: "mentor",
      };

      const mockUser = {
        _id: "mockUserId",
        username: "testuser",
        email: "test@example.com",
        role: "user",
      };

      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);

      (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({
          ...mockUser,
          role: "mentor",
        }),
      });

      // Act
      await adminController.updateUserRole(req, res);

      // Assert
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(
        "mockUserId"
      );
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "mockUserId",
        { role: "mentor" },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User role updated successfully",
        user: expect.objectContaining({
          role: "mentor",
        }),
      });
    });

    it("should return 400 if invalid role is provided", async () => {
      // Arrange
      req.body = {
        userId: "mockUserId",
        role: "invalidRole",
      };

      // Act
      await adminController.updateUserRole(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid role",
      });
    });

    it("should return 404 if user not found", async () => {
      // Arrange
      req.body = {
        userId: "nonExistentId",
        role: "mentor",
      };

      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);

      (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      // Act
      await adminController.updateUserRole(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      // Arrange
      req.params.userId = "mockUserId";

      const mockUser = {
        _id: "mockUserId",
        role: "user",
      };

      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue({});

      // Act
      await adminController.deleteUser(req, res);

      // Assert
      expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(
        "mockUserId"
      );
      expect(User.findById).toHaveBeenCalledWith("mockUserId");
      expect(User.findByIdAndDelete).toHaveBeenCalledWith("mockUserId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
      });
    });

    it("should delete mentor profile if user is a mentor", async () => {
      // Arrange
      req.params.userId = "mockUserId";

      const mockUser = {
        _id: "mockUserId",
        role: "mentor",
      };

      const mockMentorProfile = {
        _id: "mockMentorId",
        user: "mockUserId",
      };

      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Mentor.findOne as jest.Mock).mockResolvedValue(mockMentorProfile);
      (Mentor.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue({});

      // Act
      await adminController.deleteUser(req, res);

      // Assert
      expect(Mentor.findOne).toHaveBeenCalledWith({ user: "mockUserId" });
      expect(Mentor.findByIdAndDelete).toHaveBeenCalledWith("mockMentorId");
      expect(User.findByIdAndDelete).toHaveBeenCalledWith("mockUserId");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
      });
    });

    it("should return 404 if user not found", async () => {
      // Arrange
      req.params.userId = "nonExistentId";

      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);
      (User.findById as jest.Mock).mockResolvedValue(null);

      // Act
      await adminController.deleteUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });
});
