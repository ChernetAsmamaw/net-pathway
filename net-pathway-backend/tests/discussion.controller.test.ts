import { discussionController } from "../src/controllers/discussion.controller";
import Discussion from "../src/models/Discussion";
import Mentor from "../src/models/Mentor";

jest.mock("jsonwebtoken");


jest.mock("../src/models/Discussion");
jest.mock("../src/models/Mentor");
jest.mock("mongoose");

describe("Discussion Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {(() => {
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

  describe("createDiscussion", () => {
    it("should create a new discussion successfully", async () => {
      req.params.mentorId = "mockMentorId";
      req.body = {
        topic: "Career Growth in Tech",
        description: "Discussion about career progression",
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

      await discussionController.createDiscussion(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Discussion created successfully",
        discussion: mockDiscussion,
      });
    });

    it("should handle missing required fields", async () => {
      req.params.mentorId = "mockMentorId";
      req.body = { topic: "Career Growth" }; // Missing description

      await discussionController.createDiscussion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Topic and description are required",
      });
    });
  });

  describe("getDiscussionById", () => {
    it("should return discussion by ID", async () => {
      req.params.discussionId = "discussionId";
      const mockDiscussion = {
        _id: "discussionId",
        topic: "Tech Discussion",
        description: "Technical discussion",
        participants: ["mockUserId"],
      };

      (Discussion.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDiscussion),
      });

      await discussionController.getDiscussionById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        discussion: mockDiscussion,
      });
    });
  });

  describe("updateDiscussion", () => {
    it("should update discussion successfully", async () => {
      req.params.discussionId = "discussionId";
      req.body = {
        topic: "Updated Topic",
        description: "Updated description",
      };

      const mockDiscussion = {
        _id: "discussionId",
        ...req.body,
        participants: ["mockUserId"],
      };

      (Discussion.findOneAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockDiscussion),
      });

      await discussionController.updateDiscussion(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Discussion updated successfully",
        discussion: mockDiscussion,
      });
    });
  });

  describe("deleteDiscussion", () => {
    it("should delete discussion successfully", async () => {
      req.params.discussionId = "discussionId";

      (Discussion.findOneAndDelete as jest.Mock).mockResolvedValue({
        _id: "discussionId",
      });

      await discussionController.deleteDiscussion(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Discussion deleted successfully",
      });
    });
  });
});
