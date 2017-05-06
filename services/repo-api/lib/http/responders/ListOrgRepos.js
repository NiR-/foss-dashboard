import halson from 'halson';
import {getUrl} from '../router';
import _ from 'underscore';

export const responder = {
  'application/json': (req, res) => jsonFormat(req, res.status(200)),
  'application/hal+json': (req, res) => halFormat(req, res.status(200)),
  'default': (req, res) => res.sendStatus(406)
};

function jsonFormat (req, res) {
  const repos = res.result.map(getRepresentation);

  res.json(repos);
}

function halFormat (req, res) {
  const hal = halson()
    .addLink('self', getUrl(req.action, req.params))
    .addEmbed('repos', _.map(res.result, (repo) => {
      return halson(getRepresentation(repo))
        .addLink('self', getUrl('GetRepo', {repo: repo.fullName}))
      ;
    }))
  ;

  res.json(hal);
}

function getRepresentation ({owner, name, fullName, description, deprecated, stargazers, readme, changelog, coc, license, openPRs, url}) {
  return {
    owner,
    name,
    fullName,
    description,
    deprecated,
    stargazers,
    readme,
    changelog,
    coc,
    license,
    openPRs,
    url
  };
}
