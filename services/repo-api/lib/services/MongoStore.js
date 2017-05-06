import logger from './logger';
import db from './mongo';
import _ from 'underscore';

export async function storeOrgRepos (org, repos) {
  logger.debug(`Storing "${repos.length}" repositories for "${org}" organization.`);
  const collection = await db.collection('repos');

  const promises = _.map(repos, (repo) => {
    return collection.update({id: repo.id}, repo, {upsert: true});
  });

  await Promise.all(promises);
  logger.debug(`Repositories for "${org}" organization stored.`);
}

export async function findRepos (owner) {
  logger.debug(`Fetching repositories for "${owner}".`);

  const collection = await db.collection('repos');
  const repos = await collection.find({owner}).toArray();

  logger.debug(`Fetched "${repos.length}" repositories for "${owner}".`);
  return repos;
}

export async function getRepo (fullName) {
  logger.debug(`Fetch repository "${fullName}".`);

  const collection = await db.collection('repos');
  const repo = await collection.findOne({fullName}).toArray();

  logger.debug(`Fetched repository "${fullName}".`);
  return repo;
}
