import { Request, Response } from "express";
import { User } from "../models/user.model";

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await User.create({ name, email, password });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: "Error creating a new user", error: err });
  }
};
