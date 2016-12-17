import halson from 'halson';
import {getUrl} from '../router';
import _ from 'underscore';

export const responder = {
  'application/json': (req, res) => jsonFormat(req, res.status(200)),
  'application/hal+json': (req, res) => halFormat(req, res.status(200)),
  'default': (req, res) => res.status(406)
};

function jsonFormat (req, res) {
  res.json(_.values(res.result));
}

function halFormat (req, res) {
  const hal = halson()
    .addLink('self', getUrl(req.action, req.params))
    .addEmbed('repos', _.map(res.result, (name) => {
      return halson({name})
        .addLink('self', getUrl('GetRepo', {repo: name}))
      ;
    }))
  ;

  res.json(hal);
}
