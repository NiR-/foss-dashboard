import {container} from '../services';
import {GenerateStats, SyncRepo, SyncRepos} from './consumers';
import {colorConsole} from 'tracer';
import {EventSubscriber} from '../amqp';

const subscriber = (queue, pattern, prefetch = 4) => {
  return async (container) => {
    const logger = container.get('logger');
    const amqp = await container.get('amqp');
    const channel = await amqp.createChannel();

    return new EventSubscriber({channel, logger}, 'amq.direct', queue, pattern, prefetch);
  }
};

export default class Worker {
  constructor (config) {
    this._logger = colorConsole();
    this._config = config;
    this._container = container({
      config: () => config,
      logger: () => this._logger,
      generateStatsSubscriber: subscriber('issue.generate_stats', 'issue.issues_synced', 1),
      syncRepoSubscriber: subscriber('issue.sync_repo', 'issue.sync_repo', 1),
      syncReposSubscriber: subscriber('issue.sync_repos', 'org.repos_fetched', 1)
    });

    process.on('SIGINT', this.kill.bind(this));
    process.on('SIGTERM', this.kill.bind(this));
    process.on('unhandledRejection', (reason, p) => {
      console.log(reason);
      process.exit(2);
    });
  }

  async run () {
    await this._container.boot();

    this._container.proxy.generateStatsSubscriber.subscribe(GenerateStats.bind(null, this._container.proxy));
    this._container.proxy.syncRepoSubscriber.subscribe(SyncRepo.bind(null, this._container.proxy));
    this._container.proxy.syncReposSubscriber.subscribe(SyncRepos.bind(null, this._container.proxy));
  }

  async kill () {
    try {
      await this._container.close();
      this._logger.info('Worker resources cleaned up... Exiting.');
    } catch (err) {
      this._logger.error(err);
      process.exit(1);
    }

    process.exit(0);
  }
}
