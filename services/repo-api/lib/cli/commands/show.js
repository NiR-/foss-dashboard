import {commands, handleCommand} from '../../domain';
import {logger} from '../../services';

export default function register (program) {
  program
    .command('show <repo>')
    .action(handle)
  ;
}

async function handle (repoName) {
  try {
    const repo = await handleCommand(new commands.RetrieveRepo(repoName));
    logger.info(repo);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }

  process.exit(0);
}
