import {logger} from '../services';
import {HttpError, HttpClientError} from './errors';

export default function handleError (err, req, res, next) {
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
  logger.debug(err);

  return res.sendStatus(statusCode).end();
}
