export default class Repository {
  constructor ({logger, db}) {
    this._logger = logger;
    this._db = db;
  }

  async findIssues (repo, since = null) {
    this._logger.debug(`Fetching issues from mongodb for "${repo}".`);
    const query = {repo};

    if (since) {
      query.created = {"$gte": since};
    }

    const issues = await this._db
      .collection('issues')
      .find(query)
      .sort({created: 1})
      .toArray()
    ;

    this._logger.debug(`Fetched ${issues.length} issues from mongodb for "${repo}".`);

    return issues;
  }

  async getStats (name) {
    this._logger.debug(`Fetching stats for "${name}".`);

    const stats = await this._db
      .collection('repos')
      .findOne({name})
    ;

    this._logger.debug(`Fetched stats for "${name}".`);

    return stats;
  }
}
