import express from 'express';
import * as actions from './actions';
import * as responders from './responders';
import _ from 'underscore';
import {logger} from '../services';
import {HttpServerError} from './errors';

export default function router () {
  const router = express.Router();

  for (let name in actions) {
    let action = actions[name];
    action.name = name;

    defineRoute(router, action);
  }

  return router;
}

export function getUrl (action, params) {
  let {pattern} = actions[action];
  const routeParams = pattern.match(/\/:([^\/]*)/);

  if (routeParams === null) {
    return pattern;
  }

  routeParams.shift();
  for (let routeParam of routeParams) {
    if (params[routeParam] === undefined) {
      throw new HttpServerError(`Missing route parameter "${routeParam}".`);
    }

    pattern = pattern.replace(`:${routeParam}`, params[routeParam]);
  }

  return pattern;
}

function defineRoute (router, action) {
  const {name, pattern, methods, middlewares} = action;

  for (let method of methods) {
    middlewares.unshift(_.partial(setAction, name));
    middlewares.push(respond);

    router[method].call(router, pattern, ...middlewares);
  }
}

function setAction (name, req, res, next) {
  req.action = name;
  next();
}

function respond (req, res, next) {
  res.format(responders[req.action]);
}
