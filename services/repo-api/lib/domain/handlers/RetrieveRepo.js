import {MongoStore} from '../../services';
import {RepoNotFoundError} from '../errors';

export default async function handle (command) {
  const {fullName} = command;
  const repo = await MongoStore.getRepo(fullName);

  if (repo === null) {
    throw new RepoNotFoundError(fullName);
  }

  return repo;
  /**
   * - Oldest issue
   * - Oldest PR
   * - Newest issue
   * - Newest PR
   * -------------------
   * - Behind master
   */
}
