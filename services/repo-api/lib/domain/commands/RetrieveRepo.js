import {InvalidRepoNameError} from '../errors';

export default class RetrieveRepo {
  constructor (fullName) {
    const parts = fullName.split('/');

    if (parts.length !== 2) {
      throw new InvalidRepoNameError(fullName);
    }

    this._owner = parts[0];
    this._name  = parts[1];
    this._fullName = fullName;
  }

  get owner () {
    return this._owner;
  }

  get name () {
    return this._name;
  }

  get fullName () {
    return this._fullName;
  }
}
