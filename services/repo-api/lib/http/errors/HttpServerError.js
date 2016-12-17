import {HttpError} from './HttpError';

export class HttpServerError extends HttpError {
  constructor(reason, statusCode = 500) {
    super(reason, statusCode);
  }
}
