import halson from 'halson';
import {getUrl} from '../router';

export const responder = {
  'application/json': (req, res) => jsonFormat(req, res),
  'application/hal+json': (req, res) => halFormat(req, res),
  'default': (req, res) => res.sendStatus(406)
}

function jsonFormat (req, res) {
  res.status(200).json(res.result);
}

function halFormat (req, res) {
  const repo = res.result;
  const hal = halson(repo)
    .addLink('self', getUrl(req.action, req.params))
  ;

  res.status(200).json(hal);
}
