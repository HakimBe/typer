import cron from "node-cron";
import { GitHubRepo } from "../models/githubRepo.model";
import { WorkflowRun } from "../models/workflowRun.model";
import { WorkflowStep } from "../models/workflowStep.model";
import { fetchWorkflowRuns, fetchRunJobs } from "../services/github.service";

export async function runGitHubSync(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Starting GitHub run fetch...`);

  const repos = await GitHubRepo.find();

  if (!repos || repos.length < 1) {
    console.log(
      `[${new Date().toISOString()}] GitHub run fetch stopped with no repo found.`
    );
    return;
  }

  for (const repo of repos) {
    try {
      const runs = await fetchWorkflowRuns(repo.name, repo.branch, repo.token);

      for (const run of runs) {
        const exists = await WorkflowRun.findOne({ runId: run.id });
        if (exists) continue;

        const runDoc = await WorkflowRun.create({
          repoId: repo._id,
          runId: run.id,
          status: run.conclusion || run.status,
          startedAt: new Date(run.run_started_at),
          completedAt: new Date(run.updated_at),
          durationMs:
            new Date(run.updated_at).getTime() -
            new Date(run.run_started_at).getTime(),
          metadata: run,
        });

        const jobs = await fetchRunJobs(repo.name, run.id, repo.token);
        for (const job of jobs) {
          for (const step of job.steps || []) {
            await WorkflowStep.create({
              runId: runDoc._id,
              name: step.name,
              status: step.conclusion || step.status,
              startedAt: new Date(step.started_at),
              completedAt: new Date(step.completed_at),
              durationMs:
                new Date(step.completed_at).getTime() -
                new Date(step.started_at).getTime(),
              number: step.number,
            });
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(`❌ Error fetching runs for ${repo.name}:`, err.message);
      } else {
        console.error(`❌ Unknown error fetching runs for ${repo.name}:`, err);
      }
    }
  }

  console.log(`[${new Date().toISOString()}] GitHub run fetch completed.`);
}

export const startRunFetcher = () => {
  cron.schedule("*/5 * * * *", runGitHubSync);
};
