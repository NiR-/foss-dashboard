import {GithubClient, RedisStore} from '../../services';

export default async function handle (command) {
  const {org} = command;
  const repos = await fetchRepos(org);

  await RedisStore.storeOrgRepos(org, repos);
}

async function fetchRepos (org) {
  const repos = await GithubClient.fetchOrgRepos(org);

  return await Promise.all(repos.map(GithubClient.fetchRepoDetails));
}
