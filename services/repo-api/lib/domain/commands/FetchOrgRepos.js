export default class FetchOrgRepos {
  constructor (org) {
    this._org = org;
  }

  get org () {
    return this._org;
  }
}
