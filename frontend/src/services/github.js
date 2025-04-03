import axios from 'axios';
import { GITHUB_CONFIG } from '../config/github';

const githubApi = axios.create({
  baseURL: GITHUB_CONFIG.API_BASE_URL,
  headers: {
    'Accept': GITHUB_CONFIG.ACCEPT_HEADER,
    'Authorization': GITHUB_CONFIG.ACCESS_TOKEN ? `Bearer ${GITHUB_CONFIG.ACCESS_TOKEN}` : '',
  },
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (requestFn) => {
  let retries = 0;
  
  while (retries < GITHUB_CONFIG.RATE_LIMIT.MAX_RETRIES) {
    try {
      return await requestFn();
    } catch (error) {
      if (error.response?.status === 403 && error.response?.headers['x-ratelimit-remaining'] === '0') {
        if (retries === GITHUB_CONFIG.RATE_LIMIT.MAX_RETRIES - 1) {
          throw new Error('GitHub API rate limit exceeded. Please add a GitHub token or try again later.');
        }
        await sleep(GITHUB_CONFIG.RATE_LIMIT.RETRY_DELAY);
        retries++;
        continue;
      }
      throw error;
    }
  }
};

export const getRepositoryData = async (owner, repo) => {
  try {
    const [repoData, issuesData, pullsData, commitsData, contributorsData] = await Promise.all([
      fetchWithRetry(() => githubApi.get(`/repos/${owner}/${repo}`)),
      fetchWithRetry(() => githubApi.get(`/repos/${owner}/${repo}/issues?state=all`)),
      fetchWithRetry(() => githubApi.get(`/repos/${owner}/${repo}/pulls?state=all`)),
      fetchWithRetry(() => githubApi.get(`/repos/${owner}/${repo}/commits`)),
      fetchWithRetry(() => githubApi.get(`/repos/${owner}/${repo}/contributors`))
    ]);

    return {
      repository: repoData.data,
      issues: issuesData.data,
      pulls: pullsData.data,
      commits: commitsData.data,
      contributors: contributorsData.data
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Repository not found. Please check the URL and try again.');
    }
    throw error;
  }
};

export const calculateRepoHealth = (data) => {
  const {
    repository,
    issues,
    pulls,
    commits,
    contributors
  } = data;

  // Calculate various metrics
  const issueResolutionRate = issues.filter(i => i.state === 'closed').length / issues.length || 0;
  const prMergeRate = pulls.filter(p => p.merged_at).length / pulls.length || 0;
  const contributorActivity = contributors.reduce((sum, c) => sum + c.contributions, 0) / contributors.length || 0;

  // Calculate health score (0-100)
  const score = Math.round(
    (issueResolutionRate * 30 +
    prMergeRate * 30 +
    Math.min(contributorActivity / 100, 1) * 20 +
    Math.min(repository.stargazers_count / 1000, 1) * 20)
  );

  return {
    score,
    metrics: {
      issueResolutionRate: Math.round(issueResolutionRate * 100),
      prMergeRate: Math.round(prMergeRate * 100),
      contributorActivity: Math.round(contributorActivity),
      stars: repository.stargazers_count
    }
  };
};