import express from "express";
import { connectDB } from "./config/database";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import githubRepoRoutes from "./routes/githubRepo.routes";
import { startRunFetcher } from "./cron/fetchRuns.job";
import workflowRunRoutes from "./routes/workflowRun.routes";
import workflowStepRoutes from "./routes/workflowStep.routes";
import githubAuthRoutes from "./routes/githubAuth.routes";
import dotenv from "dotenv";

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();

app.use(express.json());

/**
 * Routes
 */
app.get("/health", (_req, res) => {
  res.send("OK");
});
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/repos", githubRepoRoutes);
app.use("/runs", workflowRunRoutes);
app.use("/steps", workflowStepRoutes);
app.use("/auth/github", githubAuthRoutes);

/**
 * Database operations
 */
connectDB();

/**
 * Background Jobs.
 */
startRunFetcher();

/**
 * Server launch.
 */
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
