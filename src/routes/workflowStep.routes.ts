import express from "express";
import { getWorkflowSteps } from "../controllers/workflowStep.controller";

const router = express.Router();

router.get("/", getWorkflowSteps);

export default router;
