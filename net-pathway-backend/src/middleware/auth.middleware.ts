import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define the structure of the decoded JWT token
interface DecodedToken {
  userId: string;
  role: string;
}

// Declare module to extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

// You can keep this for backward compatibility and your own code consistency
export interface AuthRequest extends Request {
  user?: DecodedToken;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check for token in cookies first, then authorization header
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  // Use whichever token is available
  const token = cookieToken || bearerToken;

  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
