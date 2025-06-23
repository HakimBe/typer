import mongoose, { Schema, Document } from "mongoose";

export interface IGithubRepo extends Document {
  name: string;
  branch: string;
  token: string;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

const githubRepoSchema = new Schema<IGithubRepo>(
  {
    name: { type: String, required: true },
    branch: { type: String, required: true },
    token: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const GitHubRepo = mongoose.model<IGithubRepo>(
  "GithubRepo",
  githubRepoSchema
);
