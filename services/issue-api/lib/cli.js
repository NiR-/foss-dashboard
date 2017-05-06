import {Command} from 'commander';
import {SyncIssues, GenerateStats, ListIssues} from './domain';
import {container} from './services';
import {colorConsole} from 'tracer';

const commands = {
  'generate-stats <repo>': (deps, repo) => GenerateStats.handle.bind(null, deps, {repo}),
  'sync-issues <repo>': (deps, repo) => SyncIssues.handle.bind(null, deps, {repo}),
  'list-issues <repo> [<since>]': (deps, repo, since = null) => ListIssues.handle.bind(null, deps, {repo, since}),
};

export default class Cli extends Command {
  constructor (config, version) {
    super();
    this.version(version);
    this.addImplicitHelpCommand();

    this._logger = colorConsole();
    this._container = container({
      config: () => config,
      logger: () => this._logger
    });

    for (let pattern in commands) {
      this.command(pattern).action(this._handle.bind(this, commands[pattern]));
    }

    process.on('unhandledRejection', (reason, p) => {
      this._logger.error(reason, p);
      process.exit(2);
    });
  }

  async run () {
    await this._container.boot();
    this.parse(process.argv);
  }

  async _handle (handlerFactory, ...args) {
    const handler = handlerFactory(this._container.proxy, ...args);

    try {
      await handler();
    } catch (err) {
      this._logger.error(err);
      process.exit(1);
    }

    console.log('kikou');
    process.exit(0);
  }
}
