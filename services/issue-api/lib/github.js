import {RateLimiter} from 'limiter';
import GithubApi from 'github';
import Promise from 'bluebird';
import ExtendableError from 'es6-error';

export class RateLimitReachedError extends ExtendableError {
  constructor () {
    super('Rate limit for Github API reached.');
  }
}

export class Client {
  constructor ({config, logger, limiter}) {
    this._config = config;
    this._logger = logger;
    this._limiter = limiter || new RateLimiter(5000, 'hours');
  }

  async listIssuesAndPRs ({owner, name}) {
    this._logger.debug(`Fetching issues from github for repo "${owner}/${name}".`);

    if (!this._limiter.tryRemoveTokens(1)) {
      throw new RateLimitReachedError();
    }

    const client = this._getClient();
    const issues = await this._iterateOn(
      client,
      client.issues.getForRepo({owner, repo: name, state: 'all', per_page: 100})
    );

    this._logger.debug(`Fetched ${issues.length} issues from github for repo "${owner}/${name}".`);

    return issues;
  }

  _iterateOn (client, response) {
    return response.then(async function (value) {
      if (response.value().length === 0) {
        return value;
      }

      return value.concat(
        await this._iterateOn(client, this._getNextPage(client, response.value()))
      );
    }.bind(this));
  }

  _getNextPage (client, response) {
    if (!client.hasNextPage(response)) {
      return Promise.resolve([]);
    } else if (!this._limiter.tryRemoveTokens(1)) {
      throw new RateLimitReachedError();
    }

    const headers = {'User-Agent': this._config.user_agent};
    return client.getNextPage(response, headers);
  }

  _getClient (headers = {}) {
    const client = new GithubApi({
      Promise,
      timeout: this._config.timeout,
      headers: {'User-Agent': this._config.user_agent}
    });

    client.authenticate({
      type: 'oauth',
      key: this._config.oauth_key,
      secret: this._config.oauth_secret,
      headers
    });

    return client;
  }
}

export function hydrateIssues (repo, issues) {
  return issues.map((issue) => {
    const labels = issue.labels.map((label) => label.name);

    return {
      id: issue.id,
      isPR: issue.pull_request !== undefined,
      repo: repo.fullName,
      number: issue.number,
      title: issue.title,
      author: issue.user.login,
      labels: labels,
      state: issue.state,
      created: new Date(issue.created_at),
      updated: new Date(issue.updated_at),
      closed: new Date(issue.closed_at)
    };
  });
}
