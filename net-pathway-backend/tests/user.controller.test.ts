import { userController } from "../src/controllers/user.controller";
import User from "../src/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Mock dependencies
jest.mock("../src/models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {},
      user: { userId: "mockUserId", role: "user" },
      cookies: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should create a new user successfully", async () => {
      // Arrange
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (User.create as jest.Mock).mockResolvedValue({
        _id: "mockUserId",
        username: "testuser",
        email: "test@example.com",
        role: "user",
      });
      (jwt.sign as jest.Mock).mockReturnValue("mockToken");

      // Act
      await userController.register(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ email: "test@example.com" }, { username: "testuser" }],
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(User.create).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword",
        role: "user",
        isActive: true,
        isEmailVerified: false,
      });
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "mockToken",
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User created successfully",
        token: "mockToken",
        user: expect.objectContaining({
          id: "mockUserId",
          username: "testuser",
          email: "test@example.com",
          role: "user",
        }),
      });
    });

    it("should return 400 if username already exists", async () => {
      // Arrange
      req.body = {
        username: "existinguser",
        email: "new@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        username: "existinguser",
        email: "existing@example.com",
      });

      // Act
      await userController.register(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Username already taken",
      });
    });

    it("should return 400 if email already exists", async () => {
      // Arrange
      req.body = {
        username: "newuser",
        email: "existing@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        username: "existinguser",
        email: "existing@example.com",
      });

      // Act
      await userController.register(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email already in use",
      });
    });

    it("should return 400 if password is too short", async () => {
      // Arrange
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "short",
      };

      // Act
      await userController.register(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Password must be at least 6 characters",
      });
    });
  });

  describe("login", () => {
    it("should authenticate user successfully", async () => {
      // Arrange
      req.body = {
        email: "test@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "mockUserId",
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword",
        role: "user",
        profilePicture: null,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mockToken");

      // Act
      await userController.login(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        email: "test@example.com",
        isActive: true,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith(
        "token",
        "mockToken",
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: "mockToken",
        user: expect.objectContaining({
          id: "mockUserId",
          username: "testuser",
          email: "test@example.com",
          role: "user",
        }),
      });
    });

    it("should return 401 if user not found", async () => {
      // Arrange
      req.body = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      await userController.login(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    it("should return 401 if password is incorrect", async () => {
      // Arrange
      req.body = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        _id: "mockUserId",
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword",
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      await userController.login(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });
  });

  describe("logout", () => {
    it("should clear cookie and return success message", async () => {
      // Act
      await userController.logout(req, res);

      // Assert
      expect(res.clearCookie).toHaveBeenCalledWith("token");
      expect(res.json).toHaveBeenCalledWith({
        message: "Logout successful",
      });
    });
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      // Arrange
      const mockUser = {
        _id: "mockUserId",
        username: "testuser",
        email: "test@example.com",
        role: "user",
        select: jest.fn().mockReturnThis(),
      };

      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      // Act
      await userController.getProfile(req, res);

      // Assert
      expect(User.findById).toHaveBeenCalledWith("mockUserId");
      expect(res.json).toHaveBeenCalledWith({
        user: mockUser,
      });
    });

    it("should return 404 if user not found", async () => {
      // Arrange
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      // Act
      await userController.getProfile(req, res);

      // Assert
      expect(User.findById).toHaveBeenCalledWith("mockUserId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });
});
