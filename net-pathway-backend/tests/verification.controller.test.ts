import { verificationController } from "../src/controllers/verification.controller";
import User from "../src/models/User";
import VerificationToken from "../src/models/VerificationToken";
import { emailService } from "../src/utils/emailService";
import crypto from "crypto";

// Mock dependencies
jest.mock("../src/models/User");
jest.mock("../src/models/VerificationToken");
jest.mock("../src/utils/emailService");
jest.mock("crypto");

describe("Verification Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      user: { userId: "mockUserId" },
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("sendVerificationEmail", () => {
    it("should send verification email successfully", async () => {
      // Arrange
      const mockUser = {
        _id: "mockUserId",
        email: "test@example.com",
        username: "testuser",
        isEmailVerified: false,
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (VerificationToken.deleteMany as jest.Mock).mockResolvedValue({});
      (crypto.randomBytes as jest.Mock).mockReturnValue({
        toString: jest.fn().mockReturnValue("mockToken"),
      });
      (VerificationToken.create as jest.Mock).mockResolvedValue({});
      (emailService.sendVerificationEmail as jest.Mock).mockResolvedValue({});

      // Act
      await verificationController.sendVerificationEmail(req, res);

      // Assert
      expect(User.findById).toHaveBeenCalledWith("mockUserId");
      expect(VerificationToken.deleteMany).toHaveBeenCalledWith({
        userId: "mockUserId",
      });
      expect(crypto.randomBytes).toHaveBeenCalledWith(32);
      expect(VerificationToken.create).toHaveBeenCalledWith({
        userId: "mockUserId",
        token: "mockToken",
      });
      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
        "mockUserId",
        "test@example.com",
        "testuser"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Verification email sent",
      });
    });

    it("should return 401 if user not authenticated", async () => {
      // Arrange
      req.user = undefined;

      // Act
      await verificationController.sendVerificationEmail(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not authenticated",
      });
    });

    it("should return 404 if user not found", async () => {
      // Arrange
      (User.findById as jest.Mock).mockResolvedValue(null);

      // Act
      await verificationController.sendVerificationEmail(req, res);

      // Assert
      expect(User.findById).toHaveBeenCalledWith("mockUserId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });

    it("should return 400 if email already verified", async () => {
      // Arrange
      const mockUser = {
        _id: "mockUserId",
        email: "test@example.com",
        username: "testuser",
        isEmailVerified: true,
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      // Act
      await verificationController.sendVerificationEmail(req, res);

      // Assert
      expect(User.findById).toHaveBeenCalledWith("mockUserId");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email already verified",
      });
    });
  });

  describe("verifyEmail", () => {
    it("should verify email successfully", async () => {
      // Arrange
      req.params.token = "validToken";

      const mockToken = {
        _id: "tokenId",
        userId: "userId",
        token: "validToken",
      };

      const mockUser = {
        _id: "userId",
        username: "testuser",
        email: "test@example.com",
        isEmailVerified: false,
        save: jest.fn().mockResolvedValue({}),
      };

      (VerificationToken.findOne as jest.Mock).mockResolvedValue(mockToken);
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (VerificationToken.deleteOne as jest.Mock).mockResolvedValue({});

      // Act
      await verificationController.verifyEmail(req, res);

      // Assert
      expect(VerificationToken.findOne).toHaveBeenCalledWith({
        token: "validToken",
      });
      expect(User.findById).toHaveBeenCalledWith("userId");
      expect(mockUser.isEmailVerified).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
      expect(VerificationToken.deleteOne).toHaveBeenCalledWith({
        _id: "tokenId",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email verified successfully",
        user: expect.any(Object),
      });
    });

    it("should return 400 if token is invalid", async () => {
      // Arrange
      req.params.token = "invalidToken";
      (VerificationToken.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      await verificationController.verifyEmail(req, res);

      // Assert
      expect(VerificationToken.findOne).toHaveBeenCalledWith({
        token: "invalidToken",
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid or expired token",
      });
    });

    it("should return 404 if user not found", async () => {
      // Arrange
      req.params.token = "validToken";

      const mockToken = {
        userId: "userId",
        token: "validToken",
      };

      (VerificationToken.findOne as jest.Mock).mockResolvedValue(mockToken);
      (User.findById as jest.Mock).mockResolvedValue(null);

      // Act
      await verificationController.verifyEmail(req, res);

      // Assert
      expect(VerificationToken.findOne).toHaveBeenCalledWith({
        token: "validToken",
      });
      expect(User.findById).toHaveBeenCalledWith("userId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });
});
