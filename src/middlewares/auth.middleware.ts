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
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Missing token!" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string;
    };
    req.userId = decoded.userId;

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "No user found!" });
      return;
    }

    req.userRole = user.role;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token!", error: err });
    return;
  }
};

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.userRole != "admin") {
    res.status(403).json({ message: "Forbidden!" });
    return;
  }

  next();
};

export const isOwnerOrAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.userRole === "admin" || req.userId === req.params.id) {
    return next();
  }

  res.status(403).json({ message: "Forbidden!" });
  return;
};
