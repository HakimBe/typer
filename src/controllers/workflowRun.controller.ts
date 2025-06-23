import { Request, Response } from "express";
import { WorkflowRun } from "../models/workflowRun.model";

export const getWorkflowRuns = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { repoId, from, to } = req.query;

  if (!repoId || !from || !to) {
    res.status(400).json({ message: "repoId, from, and to are required" });

    return;
  }

  try {
    const runs = await WorkflowRun.find({
      repoId,
      startedAt: {
        $gte: new Date(from as string),
        $lte: new Date(to as string),
      },
    }).sort({ startedAt: -1 });

    res.json(runs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch workflow runs", error });
    return;
  }
};
