import express from "express";
import {
  createGitHubRepo,
  getUserRepos,
} from "../controllers/githubRepo.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authenticate, createGitHubRepo);
router.get("/", authenticate, getUserRepos);

export default router;
