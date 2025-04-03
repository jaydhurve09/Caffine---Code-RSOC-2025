import axios from 'axios';

const GITHUB_API_BASE_URL = 'https://api.github.com';

const githubApi = axios.create({
  baseURL: GITHUB_API_BASE_URL,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
  },
});

export const getRepositoryData = async (owner, repo) => {
  try {
    const [repoData, issuesData, pullsData, commitsData, contributorsData] = await Promise.all([
      githubApi.get(`/repos/${owner}/${repo}`),
      githubApi.get(`/repos/${owner}/${repo}/issues?state=all`),
      githubApi.get(`/repos/${owner}/${repo}/pulls?state=all`),
      githubApi.get(`/repos/${owner}/${repo}/commits`),
      githubApi.get(`/repos/${owner}/${repo}/contributors`)
    ]);

    return {
      repository: repoData.data,
      issues: issuesData.data,
      pulls: pullsData.data,
      commits: commitsData.data,
      contributors: contributorsData.data
    };
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error('Failed to fetch repository data');
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