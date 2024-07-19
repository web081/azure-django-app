const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const repoOwner = 'web081';
const repoName = 'azure-django-app';

async function commentOnPR(prNumber, message) {
  try {
    await octokit.issues.createComment({
      owner: repoOwner,
      repo: repoName,
      issue_number: prNumber,
      body: message
    });
  } catch (error) {
    console.error(`Failed to comment on PR #${prNumber}:`, error);
  }
}

// Example usage: Comment on a specific PR
commentOnPR(123, 'Deployment in progress...');
