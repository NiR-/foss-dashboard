import HttpError from './HttpError';

export default class HttpServerError extends HttpError {
  constructor (reason, statusCode = 500) {
    super(reason, statusCode);
  }
}
