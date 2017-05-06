import {RateLimiter} from 'limiter';
import GithubApi from 'github';
import config from 'config';
import {RateLimitReachedError} from './errors';
import Promise from 'bluebird';

// @TODO: Implement conditional requests
// @TODO: Rate limit should be configurable
export class Client {
  constructor (config) {
    this._config = config;
    this._limiter = new RateLimiter(5000, 'hour');
  }

  async listOrgRepositories (org) {
    if (!this._limiter.tryRemoveTokens(1)) {
      throw new RateLimitReachedError();
    }

    const client = this._getClient();
    return await this._iterateOn(client, client.repos.getForOrg({org, type: 'public', per_page: 100}));
  }

  async listPRs ({owner, name}) {
    if (!this._limiter.tryRemoveTokens(1)) {
      throw new RateLimitReachedError();
    }

    const client = this._getClient();
    return await this._iterateOn(client, client.pullRequests.getAll({owner, repo: name, per_page: 100}));
  }

  async getRepoLicense ({owner, name}) {
    if (!this._limiter.tryRemoveTokens(1)) {
      throw new RateLimitReachedError();
    }

    const client = this._getClient({'Accept': 'application/vnd.github.drax-preview+json'});
    let license = '';

    try {
      const {license: {spdx_id}} = await client.misc.getRepoLicense({owner, repo: name});
      license = spdx_id;
    } catch (err) {
      if (err.code !== 404) {
        throw err;
      }
    }

    return license;
  }

  async hasFile ({owner, name}, path) {
    if (!this._limiter.tryRemoveTokens(1)) {
      throw new RateLimitReachedError();
    }

    const client = this._getClient();
    try {
      await client.repos.getContent({owner, repo: name, path});
      return true;
    } catch (err) {
      if (err.code === 404) {
        return false;
      }

      throw err;
    }
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

export const client = new Client(config.github);
