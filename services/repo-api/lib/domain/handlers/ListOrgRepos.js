import {RedisStore} from '../../services';

export default function handle (command) {
  const {org} = command;

  return RedisStore.listRepos(org);
}
