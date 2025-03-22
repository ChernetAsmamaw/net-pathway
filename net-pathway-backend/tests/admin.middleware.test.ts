import { requireAuth } from "../src/middleware/auth.middleware";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      cookies: {},
      headers: {},
      user: undefined,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call next() if token is valid in cookies", () => {
    // Arrange
    req.cookies.token = "validToken";
    (jwt.verify as jest.Mock).mockReturnValue({
      userId: "mockUserId",
      role: "user",
    });

    // Act
    requireAuth(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(
      "validToken",
      process.env.JWT_SECRET
    );
    expect(req.user).toEqual({
      userId: "mockUserId",
      role: "user",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should call next() if token is valid in authorization header", () => {
    // Arrange
    req.headers.authorization = "Bearer validToken";
    (jwt.verify as jest.Mock).mockReturnValue({
      userId: "mockUserId",
      role: "user",
    });

    // Act
    requireAuth(req, res, next);

    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(
      "validToken",
      process.env.JWT_SECRET
    );
    expect(req.user).toEqual({
      userId: "mockUserId",
      role: "user",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if no token is provided", () => {
    // Act
    requireAuth(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    // Arrange
    req.cookies.token = "invalidToken";
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    // Act
    requireAuth(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
