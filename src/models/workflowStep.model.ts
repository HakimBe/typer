import mongoose, { Document, Schema } from "mongoose";

export interface IWorkflowStep extends Document {
  runId: mongoose.Types.ObjectId;
  name: string;
  status: string;
  startedAt: Date;
  completedAt: Date;
  durationMs: number;
  number: number;
  createdAt: Date;
  updatedAt: Date;
}

const workflowStepSchema = new Schema<IWorkflowStep>(
  {
    runId: { type: Schema.Types.ObjectId, ref: "WorkflowRun", required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date, required: true },
    durationMs: { type: Number, required: true },
    number: { type: Number, required: true }, // step order
  },
  { timestamps: true }
);

workflowStepSchema.index({ runId: 1, number: 1 }, { unique: true });

export const WorkflowStep = mongoose.model<IWorkflowStep>(
  "WorkflowStep",
  workflowStepSchema
);
