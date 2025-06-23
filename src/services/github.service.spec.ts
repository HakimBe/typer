import nock from "nock";
import { fetchWorkflowRuns, fetchRunJobs } from "./github.service";

describe("GitHub API Service", () => {
  const repo = "hakim/example-repo";
  const token = "test_token";

  afterEach(() => {
    nock.cleanAll();
  });

  it("fetches workflow runs", async () => {
    const scope = nock("https://api.github.com")
      .get(`/repos/${repo}/actions/runs`)
      .query({ branch: "main", per_page: 10 })
      .reply(200, {
        workflow_runs: [
          {
            id: 123,
            status: "completed",
            run_started_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
      });

    const result = await fetchWorkflowRuns(repo, "main", token);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(123);
    scope.done();
  });

  it("fetches run jobs", async () => {
    const scope = nock("https://api.github.com")
      .get(`/repos/${repo}/actions/runs/123/jobs`)
      .reply(200, {
        jobs: [
          {
            id: 1,
            steps: [
              {
                name: "step 1",
                number: 1,
                started_at: new Date().toISOString(),
                completed_at: new Date().toISOString(),
                status: "completed",
              },
            ],
          },
        ],
      });

    const result = await fetchRunJobs(repo, 123, token);
    expect(result[0].steps[0].name).toBe("step 1");
    scope.done();
  });
});
