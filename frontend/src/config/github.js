// GitHub API configuration
export const GITHUB_CONFIG = {
  API_BASE_URL: 'https://api.github.com',
  // Add your GitHub personal access token here
  // Visit https://github.com/settings/tokens to generate one
  ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN || '',
  // API version header
  ACCEPT_HEADER: 'application/vnd.github.v3+json',
  // Rate limit handling
  RATE_LIMIT: {
    // Number of retries when rate limited
    MAX_RETRIES: 3,
    // Delay between retries in milliseconds
    RETRY_DELAY: 1000,
  }
};