import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import {ErrorHandler, expressRouter} from '../Chassis/Http';
import {container} from '../services';
import * as actions from './actions';
import {Router} from '../Chassis/Http';
import {partial} from 'lodash';
import {colorConsole} from 'tracer';

export default class Http {
  constructor (config) {
    this._logger = colorConsole();
    this._config = config;
    this._container = container({
      config: () => config,
      logger: () => this._logger
    });

    this._server = express();
    this._server.use(helmet());
    this._server.use(morgan('combined'));
    this._server.use(bodyParser.json());
    this._server.use(bodyParser.urlencoded({extended: true}));
    this._server.use(expressRouter(
      Router.create(actions),
      (middleware) => middleware.length > 3 ? partial(middleware, this._container.proxy) : middleware
    ));
    this._server.use(ErrorHandler.create(this._logger.error));

    process.on('SIGINT', this.kill.bind(this));
    process.on('SIGTERM', this.kill.bind(this));
    process.on('unhandledRejection', (reason, p) => {
      console.log(reason);
      process.exit(2);
    });
  }

  async run () {
    await this._container.boot();

    const server = this._server.listen(this._config.http_port, () => {
      this._logger.info(`Start listening on port ${this._config.http_port}.`);

      this._container.onCleanup((next) => {
        this._logger.info('Stop listening for incoming requests.');

        server.close(next);
      });
    });
  }

  async kill () {
    this._logger.info('Stopping application.');

    try {
      await this._container.close();
    } catch (err) {
      this._logger.error(err);
      process.exit(1);
    }

    process.exit(0);
  }
}
