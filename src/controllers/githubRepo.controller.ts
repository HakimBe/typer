import { Response } from "express";
import { GitHubRepo } from "../models/githubRepo.model";
import { AuthRequest } from "../middlewares/auth.middleware"; // adjust import path as needed

export const createGitHubRepo = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, branch, token } = req.body;

  if (!name || !branch || !token) {
    res.status(400).json({ message: "name, branch, and token are required" });

    return;
  }

  if (!req.userId) {
    res.status(401).json({ message: "Unauthorized - missing user" });
    return;
  }

  try {
    const exists = await GitHubRepo.findOne({
      name,
      branch,
      userId: req.userId,
    });

    if (exists) {
      res.status(400).json({
        message: "Repo already connected on this branch for this user",
      });

      return;
    }

    const repo = new GitHubRepo({
      name,
      branch,
      token,
      userId: req.userId,
    });

    await repo.save();

    res.status(201).json(repo);
  } catch (error) {
    res.status(500).json({ message: "Failed to create repo", error });
    return;
  }
};

export const getUserRepos = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const repos = await GitHubRepo.find({ userId: req.userId });
  res.json(repos);
};
