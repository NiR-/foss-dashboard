export class HttpError {
  constructor(reason, statusCode) {
    this._reason = reason;
    this._statusCode = statusCode;
  }

  get reason () {
    return this._reason;
  }

  get statusCode () {
    return this._statusCode;
  }
}
