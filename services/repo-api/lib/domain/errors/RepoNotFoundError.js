import ExtendableError from 'es6-error';

export default class RepoNotFoundError extends ExtendableError {
  constructor (repo) {
    super(`Repo "${repo}" not found.`);
  }
}
