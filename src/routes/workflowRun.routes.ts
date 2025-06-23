import express from "express";
import { getWorkflowRuns } from "../controllers/workflowRun.controller";

const router = express.Router();

router.get("/", getWorkflowRuns);

export default router;
