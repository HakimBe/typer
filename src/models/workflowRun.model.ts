import mongoose, { Document, Schema } from "mongoose";

export interface IWorkflowRun extends Document {
  repoId: mongoose.Types.ObjectId;
  runId: number;
  status: string;
  startedAt: Date;
  completedAt: Date;
  durationMs: number;
  metadata: object;
  createdAt: Date;
  updatedAt: Date;
}

const workflowRunSchema = new Schema<IWorkflowRun>(
  {
    repoId: { type: Schema.Types.ObjectId, ref: "GitHubRepo", required: true },
    runId: { type: Number, required: true },
    status: { type: String, required: true },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date, required: true },
    durationMs: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

workflowRunSchema.index({ repoId: 1, runId: 1 }, { unique: true });

export const WorkflowRun = mongoose.model<IWorkflowRun>(
  "WorkflowRun",
  workflowRunSchema
);
