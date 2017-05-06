import {InvalidRepoNameError, InvalidDurationError} from '../errors';
import moment from 'moment';

export function handle ({
  issueRepository
}, {repo, since = null}) {
  const parts = repo.split('/');
  const duration = since ? moment.duration(since) : null;
  const sinceDate = since ? moment().subtract(duration).toDate() : null;

  if (parts.length !== 2) {
    throw new InvalidRepoNameError(repo);
  }

  return issueRepository.findIssues(repo, sinceDate);
}
