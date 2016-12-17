import {logger} from '../../services';
import _ from 'underscore';

export default function register (program) {
  program
    .command('help', 'display help')
    .action(_.partial(handle, program))
  ;
}

function handle (program) {
  program.help();
}
