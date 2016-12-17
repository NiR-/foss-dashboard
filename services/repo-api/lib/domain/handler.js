import * as handlers from './handlers';
import {HandlerNotFoundError} from './errors';

export default function handle(command) {
  const {name} = command.constructor;

  if (handlers[name] === undefined) {
    throw new HandlerNotFoundError(name);
  }

  return handlers[name].call(null, command);
}
