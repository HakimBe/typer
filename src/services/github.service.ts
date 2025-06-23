import axios from "axios";

export const fetchWorkflowRuns = async (
  repoFullName: string,
  branch: string,
  token: string
) => {
  const url = `https://api.github.com/repos/${repoFullName}/actions/runs?branch=${branch}&per_page=10`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  return response.data.workflow_runs;
};

export const fetchRunJobs = async (
  repoFullName: string,
  runId: number,
  token: string
) => {
  const url = `https://api.github.com/repos/${repoFullName}/actions/runs/${runId}/jobs`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  return response.data.jobs;
};
