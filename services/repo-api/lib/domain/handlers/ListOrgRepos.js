import {MongoStore} from '../../services';

export default function handle (command) {
  const {org} = command;

  return MongoStore.findRepos(org);
}
