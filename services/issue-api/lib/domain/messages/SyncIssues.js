import {InvalidRepoNameError} from '../errors';

export async function handle ({
  issueFetcher,
  issuePersister,
  publisher
}, {repo}) {
  const parts = repo.split('/');

  if (parts.length !== 2) {
    throw new InvalidRepoNameError(repo);
  }

  const issues = await issueFetcher.fetchIssues({owner: parts[0], name: parts[1], fullName: repo});
  await issuePersister.storeIssues(issues);

  await publisher.publish('issue.issues_synced', {repo: repo});
}
