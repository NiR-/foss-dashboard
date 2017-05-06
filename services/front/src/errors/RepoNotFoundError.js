import ExtendableError from 'es6-error';

export default class RepoNotFoundError extends ExtendableError {
  constructor (repo) {
    super(`Unable to found repo "${repo}".`);
    this._repo = repo;
  }

  get repo () {
    return this._repo;
  }
}
