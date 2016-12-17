import ExtendableError from 'es6-error';

export default class InvalidRepoNameError extends ExtendableError {
  constructor (fullName) {
    super(`Invalid repository name: "${fullName}".`);
  }
}
