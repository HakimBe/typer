import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1h",
  });
};

export const signup = async (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).json({ message: "Bad request format!" });
  }

  try {
    const { name, email, password, role = "regular" } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      res.status(400).json({ message: "email already exists on our records!" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = generateToken(user.id);
    res.status(201).json({ token: token });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong with the signup!", error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).json({ message: "Bad request!" });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res
        .status(404)
        .json({ message: "credentials didn't match our records!" });
    }

    if (!(await user?.comparePassword(password))) {
      res.status(401).json({ message: "credentials didnt match our records!" });
    }

    const token = generateToken(user?.id);
    res.json({ token });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong with the login!", error: err });
  }
};
