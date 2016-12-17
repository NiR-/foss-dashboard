import bluebird from 'bluebird';
import config from 'config';
import logger from './logger';
import redis from 'redis';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient(config.redis);

export async function storeOrgRepos (org, repos) {
  const repoNames = {};
  const promises = [];

  logger.debug(`Storing "${repos.length}" repositories for "${org}" organization.`);
  for (let id in repos) {
    let repo = repos[id];
    let fullName = repo['fullName'];

    repoNames[id] = fullName;

    promises.push(client.hmsetAsync(`repo:${fullName.toLowerCase()}`, repo));
  }

  promises.push(client.hmsetAsync(`org:${org.toLowerCase()}`, repoNames));

  await Promise.all(promises);
  logger.debug(`Repositories for "${org}" organization stored.`);
}

export async function listRepos (org) {
  logger.debug(`Fetching repositories for "${org}" organization.`);

  const repos = await client.hgetallAsync(`org:${org.toLowerCase()}`);
  logger.debug(`Repositories for "${org}" organization fetched.`);

  return repos;
}

export async function fetchRepo (fullName) {
  logger.debug(`Fetching repository "${fullName}".`);

  const repo = await client.hgetallAsync(`repo:${fullName.toLowerCase()}`);
  logger.debug(`Fetched repository "${fullName}".`);

  return repo;
}
