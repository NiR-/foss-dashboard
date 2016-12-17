import config from 'config';
import GithubApi from 'github';
import logger from './logger';
import _ from 'underscore';

const FILES = ['README.md', 'CHANGELOG.md', 'CODE_OF_CONDUCT.md', 'LICENSE.md'];

export async function fetchOrgRepos (org) {
  logger.debug(`Fetching repositories for org "${org}".`);

  const client = getClient();
  const headers = getClientHeaders();
  const repos = [];

  let response = await client.repos.getForOrg({org, type: 'public'});
  repos.push.apply(repos, response);

  while (client.hasNextPage(response)) {
    response = await client.getNextPage(response, headers);
    repos.push.apply(repos, response);
  }

  logger.debug(`Fetched ${repos.length} repositories for organization "${org}".`);
  return repos
    .map((repo) => {
      const description = repo.description || '';
      const [owner, repoName] = repo.full_name.split('/');

      return {
        id: repo.id,
        owner: owner,
        name: repoName,
        fullName: repo.full_name,
        description: description,
        deprecated: description.match(/(?:deprecated|UNMAINTAINED)/i) !== null,
        openIssues: repo.open_issues_count,
        stargazers: repo.stargazers_count
      };
    })
  ;
}

export async function fetchRepoDetails (repo) {
  logger.debug(`Fetching details for "${repo.fullName}" repository.`);

  const [readme, changelog, coc, license] = await hasFiles(repo, FILES);

  repo.readme = readme;
  repo.changelog = changelog;
  repo.coc = coc;
  repo.license = license;
  repo.openPRs = await countPRs(repo);

  return repo;
}

async function hasFiles (repo, files) {
  return await Promise.all(files.map(async function (file) {
    return await hasFile(repo, file);
  }));
}

async function hasFile ({fullName, owner, name}, path) {
  logger.debug(`Checking if "${fullName}" has "${path}".`);
  const client = getClient();

  try {
    let response = await client.repos.getContent({owner, repo: name, path});
    return true;
  } catch (err) {
    if (err.code !== 404) {
      logger.error(err);
    }
    return false;
  }
}

async function countPRs({fullName, owner, name}) {
  logger.debug(`Counting PRs for "${fullName}".`);
  const client = getClient();
  const headers = getClientHeaders();
  let response = await client.pullRequests.getAll({owner, repo: name, per_page: 100});
  let count = response.length;

  while (client.hasNextPage()) {
    response = await client.getNextPage(response, headers);
    count += response.length;
  }

  logger.debug(`Found ${count} opened PRs found for "${fullName}".`);
  return count;
}

function getClient () {
  const client = new GithubApi({Promise, timeout: config.github.timeout, headers: getClientHeaders()});
  client.authenticate({
    type: 'oauth',
    key: config.github.oauth_key,
    secret: config.github.oauth_secret
  });

  return client;
}

function getClientHeaders () {
  return {'User-Agent': config.github.user_agent};
}
