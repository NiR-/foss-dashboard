import {HttpError, HttpClientError} from './errors';

export function create (logger) {
  return (err, req, res, next) => {
    if (err instanceof HttpClientError) {
      return res
        .status(err.statusCode)
        .format({
          'application/json': () => res.json({error: err.reason}),
          'application/hal+json': () => res.json({error: err.reason}),
          'default': () => res.send(err.reason).end()
        });
    }

    const statusCode = err instanceof HttpError ? err.statusCode : 500;
    logger(err);

    return res.sendStatus(statusCode).end();
  }
}
