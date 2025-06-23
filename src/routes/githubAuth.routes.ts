import express from "express";
import {
  redirectToGitHub,
  handleGitHubCallback,
} from "../controllers/githubAuth.controller";

const router = express.Router();

router.get("/login", redirectToGitHub);
router.get("/callback", handleGitHubCallback);

export default router;
