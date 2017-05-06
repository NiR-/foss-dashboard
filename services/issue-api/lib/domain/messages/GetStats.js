import {RepoNotFoundError} from '../errors';

export async function handle ({
  statsRepository
}, {repo}) {
  const stats = await statsRepository.getStats(repo);

  if (stats === null) {
    throw new RepoNotFoundError(repo);
  }

  return stats;
}
