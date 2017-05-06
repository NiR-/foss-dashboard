import ExtendableError from 'es6-error';

export class InvalidRepoNameError extends ExtendableError {
  constructor (repoName) {
    super(`Invalid repository name: "${repoName}".`);
    this._repoName = repoName;
  }

  get repoName () {
    return this._repoName;
  }
}

export class RepoNotFoundError extends ExtendableError {
  constructor (repo) {
    super(`Repository "${repo}" not found.`);

    this._repo = repo;
  }

  get repo () {
    return this._repo;
  }
}

export class InvalidDurationError extends ExtendableError {
  constructor (duration) {
    super(`Duration "${duration}" is not valid.`);
  }
}
