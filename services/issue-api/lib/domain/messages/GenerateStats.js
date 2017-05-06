import * as StatsGenerator from '../StatsGenerator';

export async function handle ({
  issueRepository,
  statsPersister
}, {repo}) {
  const issues = await issueRepository.findIssues(repo);
  const stats = {
    issues: StatsGenerator.generateStats(issues.filter((issue) => !issue.isPR)),
    prs: StatsGenerator.generateStats(issues.filter((issue) => issue.isPR))
  };

  await statsPersister.storeStats(repo, stats);
}
