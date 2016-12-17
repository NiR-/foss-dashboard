import ExtendableError from 'es6-error';

export default class HandlerNotFoundError extends ExtendableError {
  constructor (name) {
    super(`No handler found for command "${name}".`);
  }
}
