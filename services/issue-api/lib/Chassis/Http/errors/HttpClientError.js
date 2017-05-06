import HttpError from './HttpError';

export default class HttpServerError extends HttpError {
  constructor (reason, statusCode = 400) {
    super(reason, statusCode);
  }
}
