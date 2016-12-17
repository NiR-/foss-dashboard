export default class ListOrgRepos {
  constructor (org) {
    this._org = org;
  }

  get org () {
    return this._org;
  }
}
