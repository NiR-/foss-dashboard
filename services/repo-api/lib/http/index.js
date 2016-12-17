import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import router from './router';
import errorHandler from './errorHandler';
import {logger} from '../services';
import redis from 'redis';
import config from 'config';
import helmet from 'helmet';

export function createServer () {
  const server = express();
  const redisClient = redis.createClient(config.redis);

  server.use(helmet());
  server.use(morgan('combined'));
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({extended: true}));
  server.use(router());
  server.use(errorHandler);

  return server;
}

export function run (server) {
  server.listen(config.http_port, () => {
    logger.info(`Start listening on port ${config.http_port}.`);
  });
}
