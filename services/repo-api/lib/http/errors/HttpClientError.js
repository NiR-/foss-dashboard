import {HttpError} from './HttpError';

export class HttpClientError extends HttpError {
  constructor(reason, statusCode = 400) {
    super(reason, statusCode);
  }
}
