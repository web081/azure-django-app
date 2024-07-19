const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const repoOwner = 'web081';
const repoName = 'azure-django-app';

async function handlePR(event) {
  const prNumber = event.pull_request.number;
  const action = event.action;

  if (action === 'opened' || action === 'synchronize' || action === 'reopened') {
    const message = `Deploying PR #${prNumber}...`;
    await commentOnPR(prNumber, message);
    // Trigger deployment logic here
  }

  if (action === 'closed' && event.pull_request.merged) {
    // Clean up containers or resources
    const message = `PR #${prNumber} closed. Cleaning up...`;
    await commentOnPR(prNumber, message);
  }
}

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

module.exports = { handlePR };
