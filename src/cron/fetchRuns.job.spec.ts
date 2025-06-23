import nock from "nock";
import { GitHubRepo } from "../models/githubRepo.model";
import { WorkflowRun } from "../models/workflowRun.model";
import { WorkflowStep } from "../models/workflowStep.model";
import { User } from "../models/user.model";
import { runGitHubSync } from "./fetchRuns.job";

describe("runGitHubSync", () => {
  afterEach(async () => {
    nock.cleanAll();
  });

  it("should fetch and store workflow runs and steps", async () => {
    const user = new User({
      name: "Alice",
      email: "alice@example.test",
      password: "1234",
    });

    await user.save();

    const repo = await GitHubRepo.create({
      name: "hakim/test-repo",
      branch: "main",
      token: "fake-token",
      userId: user.id,
    });

    const now = new Date().toISOString();

    nock("https://api.github.com")
      .get(`/repos/${repo.name}/actions/runs`)
      .query(true)
      .reply(200, {
        workflow_runs: [
          {
            id: 111,
            status: "completed",
            run_started_at: now,
            updated_at: now,
          },
        ],
      });

    nock("https://api.github.com")
      .get(`/repos/${repo.name}/actions/runs/111/jobs`)
      .reply(200, {
        jobs: [
          {
            id: 1,
            steps: [
              {
                name: "step A",
                number: 1,
                status: "completed",
                started_at: now,
                completed_at: now,
              },
            ],
          },
        ],
      });

    await runGitHubSync();

    const runs = await WorkflowRun.find();
    const steps = await WorkflowStep.find();

    expect(runs.length).toBe(1);
    expect(steps.length).toBe(1);
    expect(steps[0].name).toBe("step A");
  });
});
