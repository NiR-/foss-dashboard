import {client} from './Client';
import {logger} from '../services'; // @TODO: should be injected

export async function fetchOrgRepos (org) {
  logger.debug(`Fetching repositories for org "${org}".`);
  const repos = await client.listOrgRepositories(org);
  logger.debug(`Fetched ${repos.length} repositories for organization "${org}".`);

  return repos
    .map((repo) => {
      const description = repo.description || '';
      const [owner, repoName] = repo.full_name.split('/');

      return {
        id: repo.id,
        url: repo.html_url,
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

  const [readme, changelog, coc] = await hasFiles(repo, ['README.md', 'CHANGELOG.md', 'CODE_OF_CONDUCT.md']);

  repo.readme = readme;
  repo.changelog = changelog;
  repo.coc = coc;
  repo.license = await fetchLicense(repo);

  return repo;
}

async function hasFiles (repo, files) {
  return await Promise.all(
    files.map(hasFile.bind(null, repo))
  );
}

function hasFile (repo, file) {
  logger.debug(`Checking if repo "${repo.fullName}" contains file "${file}".`);

  return client.hasFile(repo, file);
}

async function fetchLicense (repo) {
  logger.debug(`Fetching repo license for "${repo.fullName}".`);
  const license = await client.getRepoLicense(repo);

  logger.debug(`Fetched license "${license}" for repo "${repo.fullName}".`);
  return license;
}
