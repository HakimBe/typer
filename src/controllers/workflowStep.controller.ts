import { Request, Response } from "express";
import { WorkflowStep } from "../models/workflowStep.model";

export const getWorkflowSteps = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { runId } = req.query;

  if (!runId) {
    res.status(400).json({ message: "runId is required" });

    return;
  }

  try {
    const steps = await WorkflowStep.find({ runId }).sort({ number: 1 });
    res.json(steps);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch workflow steps", error });

    return;
  }
};
