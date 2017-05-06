import ExtendableError from 'es6-error';

export default class RateLimitReachedError extends ExtendableError {
  constructor () {
    super('Rate limit for Github API reached.');
  }
}
