export default class Persister {
  constructor ({logger, db}) {
    this._logger = logger;
    this._db = db;
  }

  async storeIssues (issues) {
    this._logger.debug(`Storing ${issues.length} issues.`);

    const collection = this._db.collection('issues');

    await Promise.all(issues.map(issue => collection.updateOne({id: issue.id}, issue, {upsert: true})));

    this._logger.debug(`Stored ${issues.length} issues.`);
  }

  async storeStats (name, stats) {
    this._logger.debug(`Storing stats for "${name}".`);

    await this._db.collection('repos').updateOne({name}, {name, ...stats}, {upsert: true});

    this._logger.debug(`Stored stats for "${name}".`);
  }
}
