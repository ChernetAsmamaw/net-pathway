import { mentorController } from "../src/controllers/mentor.controller";
import Mentor from "../src/models/Mentor";
import User from "../src/models/User";
import mongoose from "mongoose";

jest.mock("../src/models/Mentor");
jest.mock("../src/models/User");
jest.mock("mongoose");

describe("Mentor Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      user: { userId: "mockUserId", role: "mentor" },
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

  describe("getAllMentors", () => {
    it("should get all mentors with pagination", async () => {
      // Arrange
      req.query = { page: "1", limit: "10" };
      const mockMentors = [
        { _id: "mentor1", title: "Senior Dev", user: { username: "mentor1" } },
        { _id: "mentor2", title: "Tech Lead", user: { username: "mentor2" } },
      ];

      const mockFind = jest.fn().mockReturnThis();
      const mockPopulate = jest.fn().mockReturnThis();
      const mockSkip = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockResolvedValue(mockMentors);

      (Mentor.find as jest.Mock).mockReturnValue({
        populate: mockPopulate,
        skip: mockSkip,
        limit: mockLimit,
      });

      (Mentor.countDocuments as jest.Mock).mockResolvedValue(15);

      // Act
      await mentorController.getAllMentors(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        mentors: mockMentors,
        pagination: { total: 15, page: 1, pages: 2 },
      });
    });
  });

  describe("getMentorProfile", () => {
    it("should get mentor profile by ID", async () => {
      // Arrange
      req.params.mentorId = "mockMentorId";
      const mockMentor = {
        _id: "mockMentorId",
        title: "Senior Dev",
        user: { username: "mentor1" },
      };

      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);
      (Mentor.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockMentor),
      });

      // Act
      await mentorController.getMentorProfile(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ mentor: mockMentor });
    });

    it("should return 404 if mentor not found", async () => {
      // Arrange
      req.params.mentorId = "nonExistentId";
      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);
      (Mentor.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      // Act
      await mentorController.getMentorProfile(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Mentor not found" });
    });
  });

  describe("createMentorProfile", () => {
    it("should create mentor profile successfully", async () => {
      // Arrange
      req.body = {
        title: "Senior Developer",
        expertise: ["JavaScript", "React"],
        experience: "10 years",
        availability: "available",
      };

      const mockMentor = {
        _id: "mockMentorId",
        ...req.body,
        user: "mockUserId",
      };

      (Mentor.findOne as jest.Mock).mockResolvedValue(null);
      (Mentor.create as jest.Mock).mockResolvedValue(mockMentor);

      // Act
      await mentorController.createMentorProfile(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Mentor profile created successfully",
        mentor: mockMentor,
      });
    });

    it("should return 400 if profile already exists", async () => {
      // Arrange
      (Mentor.findOne as jest.Mock).mockResolvedValue({ _id: "existingId" });

      // Act
      await mentorController.createMentorProfile(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Mentor profile already exists",
      });
    });
  });

  describe("updateMentorProfile", () => {
    it("should update mentor profile successfully", async () => {
      // Arrange
      req.params.mentorId = "mockMentorId";
      req.body = {
        title: "Updated Title",
        expertise: ["Updated Skills"],
      };

      const mockMentor = {
        _id: "mockMentorId",
        user: "mockUserId",
        ...req.body,
      };

      (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValue(true);
      (Mentor.findOne as jest.Mock).mockResolvedValue(mockMentor);
      (Mentor.findByIdAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockMentor),
      });

      // Act
      await mentorController.updateMentorProfile(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Mentor profile updated successfully",
        mentor: mockMentor,
      });
    });
  });
});

describe("mentorDiscussions", () => {
  describe("createDiscussion", () => {
    it("should create a new discussion successfully", async () => {
      // Arrange
      req.params.mentorId = "mockMentorId";
      req.body = {
        topic: "Career Growth in Tech",
        description:
          "Discussion about career progression in software development",
        tags: ["career", "technology"],
      };

      const mockDiscussion = {
        _id: "discussionId",
        mentor: "mockMentorId",
        ...req.body,
        participants: ["mockUserId"],
        createdAt: new Date(),
      };

      (Mentor.findById as jest.Mock).mockResolvedValue({ _id: "mockMentorId" });
      (Discussion.create as jest.Mock).mockResolvedValue(mockDiscussion);

      // Act
      await mentorController.createDiscussion(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Discussion created successfully",
        discussion: mockDiscussion,
      });
    });

    it("should return 404 if mentor not found", async () => {
      // Arrange
      req.params.mentorId = "nonExistentId";
      (Mentor.findById as jest.Mock).mockResolvedValue(null);

      // Act
      await mentorController.createDiscussion(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Mentor not found",
      });
    });

    it("should validate required discussion fields", async () => {
      // Arrange
      req.params.mentorId = "mockMentorId";
      req.body = {
        // Missing required fields
      };

      // Act
      await mentorController.createDiscussion(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Topic and description are required",
      });
    });
  });

  describe("getDiscussions", () => {
    it("should get all discussions for a mentor", async () => {
      // Arrange
      req.params.mentorId = "mockMentorId";
      const mockDiscussions = [
        {
          _id: "discussion1",
          topic: "Tech Leadership",
          description: "Discussion about tech leadership",
          participants: ["user1", "user2"],
        },
        {
          _id: "discussion2",
          topic: "Career Advice",
          description: "General career advice",
          participants: ["user3", "user4"],
        },
      ];

      (Discussion.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDiscussions),
      });

      // Act
      await mentorController.getDiscussions(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        discussions: mockDiscussions,
      });
    });
  });

  describe("updateDiscussion", () => {
    it("should update discussion successfully", async () => {
      // Arrange
      req.params.discussionId = "discussionId";
      req.body = {
        topic: "Updated Topic",
        description: "Updated description",
      };

      const mockDiscussion = {
        _id: "discussionId",
        mentor: "mockMentorId",
        ...req.body,
      };

      (Discussion.findOneAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDiscussion),
      });

      // Act
      await mentorController.updateDiscussion(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Discussion updated successfully",
        discussion: mockDiscussion,
      });
    });
  });
});
