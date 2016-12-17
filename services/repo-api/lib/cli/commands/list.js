import {commands, handleCommand} from '../../domain';
import {logger} from '../../services';

export default function register (program) {
  program
    .command('list <org>')
    .action(handle)
  ;
}

async function handle (org) {
  try {
    const repos = await handleCommand(new commands.ListOrgRepos(org));
    logger.info(repos);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }

  process.exit(0);
}
