import express from 'express';
import {HttpServerError} from './errors';
import {toPairs} from 'lodash';

export class Router {
  constructor (actions) {
    this._actions = new Map(toPairs(actions));
  }

  get actions () {
    return this._actions;
  }

  getUrl (action, params) {
    let {pattern} = this._actions.get(action);
    const routeParams = pattern.match(/\/:([^\/]*)/);

    if (routeParams === null) {
      return pattern;
    }

    routeParams.shift();
    routeParams.forEach((routeParam) => {
      if (params[routeParam] === undefined) {
        throw new HttpServerError(`Missing route parameter "${routeParam}".`);
      }

      pattern = pattern.replace(`:${routeParam}`, encodeURIComponent(params[routeParam]));
    });

    return pattern;
  }

  static create (actions) {
    return new Router(actions);
  }
}

export function route (route) {
  return target => {
    route.name = route.name || target.name;
    target.getRoute = () => route;

    return target;
  };
}

export function expressRouter ({actions}, factory) {
  const router = express.Router();

  actions.forEach((action) => {
    const route = action.getRoute();
    const middlewares = route.middlewares.map((middleware) => {
      if (typeof middleware === 'string') {
        middleware = action[middleware];
      }

      return factory(middleware);
    });

    // Add action name to request body when the request enters the middleware stack
    middlewares.unshift((req, res, next) => {
      req.action = route.name;
      next();
    });

    route.methods.forEach((method) => router[method.toLowerCase()].call(router, route.pattern, ...middlewares));
  });

  return router;
}
