export default class IssueFetcher {
  constructor ({client, hydrator}) {
    this._client = client;
    this._hydrator = hydrator;
  }

  async fetchIssues (repo) {
    const issues = this._hydrator(repo, await this._client.listIssuesAndPRs(repo));

    return issues;
  }
}
