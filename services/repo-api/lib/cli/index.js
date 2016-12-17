import * as commands from './commands';

export function createProgram () {
  const program = require('commander');

  program.version('0.1.0');

  for (let name in commands) {
    commands[name].call(null, program);
  }

  return program;
}
