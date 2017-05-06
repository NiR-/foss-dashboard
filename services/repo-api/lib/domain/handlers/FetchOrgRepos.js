import {EventPublisher, MongoStore} from '../../services';
import _ from 'underscore';
import * as Github from '../../github'; // @TODO: domain should have no clue about github itself

export default async function handle (command) {
  const {org} = command;
  const repos = await fetchRepos(org);
  const repoNames = _.map(repos, (repo) => repo.fullName);

  await MongoStore.storeOrgRepos(org, repos);
  await EventPublisher.publish('org.repos_fetched', {org, repos: repoNames});
}

async function fetchRepos (org) {
  const repos = await Github.Fetcher.fetchOrgRepos(org);

  return Promise.all(repos.map(Github.Fetcher.fetchRepoDetails));
}
