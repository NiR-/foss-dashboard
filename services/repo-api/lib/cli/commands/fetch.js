import {commands, handleCommand} from '../../domain';
import {logger} from '../../services';

export default function register (program) {
  program
    .command('fetch <org>')
    .action(handle)
  ;
}

async function handle (org) {
  try {
    await handleCommand(new commands.FetchOrgRepos(org));
  } catch (err) {
    logger.error(err); // Should print true line of error
    process.exit(1);
  }

  process.exit(0);
}
