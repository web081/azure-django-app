const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const repoOwner = 'web081';
const repoName = 'your-repo-name';

async function commentOnPR(prNumber, message) {
  try {
    await octokit.issues.createComment({
      owner: repoOwner,
      repo: repoName,
      issue_number: prNumber,
      body: message
    });
    console.log(`Comment added to PR #${prNumber}: ${message}`);
  } catch (error) {
    console.error(`Failed to comment on PR #${prNumber}:`, error);
  }
}

async function handlePullRequestEvent(context) {
  const { action, pull_request } = context.payload;
  const prNumber = pull_request.number;

  switch (action) {
    case 'opened':
    case 'synchronize':
    case 'reopened':
      const message = `Deployment initiated for PR #${prNumber}.`;
      await commentOnPR(prNumber, message);
      // Trigger deployment logic here
      break;
    case 'closed':
      const cleanupMessage = `PR #${prNumber} has been closed. Cleaning up deployment...`;
      await commentOnPR(prNumber, cleanupMessage);
      // Trigger cleanup logic here
      break;
    default:
      console.log(`Unhandled PR action: ${action}`);
  }
}

module.exports = { handlePullRequestEvent };
