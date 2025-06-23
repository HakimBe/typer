import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: "admin" | "regular";
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing token!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string;
    };
    req.userId = decoded.userId;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "No user found!" });
    }

    req.userRole = user.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token!" });
  }
};

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (req.userRole != "admin") {
    return res.status(403).json({ message: "Forbidden!" });
  }

  next();
};

export const isOwnerOrAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  if (req.userRole === "admin" || req.userId === req.params.id) {
    return next();
  }

  return res.status(403).json({ message: "Forbidden!" });
};
