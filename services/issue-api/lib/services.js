import {Ioc} from './Chassis';
import {Persister as MongoPersister, Repository as MongoRepository} from './mongo';
import * as github from './github';
import amqp from 'amqplib';
import {MongoClient} from 'mongodb';
import {EventPublisher} from './amqp';
import {IssueFetcher} from './domain';

const alias = (name) => (container) => container.get(name);

const services = {
  amqp: async (container) => {
    const config = container.get('config');
    const conn = await amqp.connect(config.amqp_uri);
    container.onCleanup(() => conn.close());

    return conn;
  },
  publisher: async (container) => {
    const amqp = await container.get('amqp');
    const channel = await amqp.createChannel();
    return new EventPublisher({channel}, 'amq.direct');
  },
  db: async (container) => {
    const config = container.get('config');
    const db = await MongoClient.connect(config.mongo_uri);
    container.onCleanup(() => db.close());

    return db;
  },
  persister: async (container) => {
    return new MongoPersister({db: await container.get('db'), logger: container.get('logger')});
  },
  repository: async (container) => {
    const db = await container.get('db');

    return new MongoRepository({db, logger: container.get('logger')});
  },
  issueFetcher: (container) => {
    return new IssueFetcher({
      client: new github.Client({config: container.get('config').github, logger: container.get('logger')}),
      hydrator: github.hydrateIssues,
    });
  },
  issueRepository: alias('repository'),
  issuePersister: alias('persister'),
  statsRepository: alias('repository'),
  statsPersister: alias('persister'),
};

export function container (extra) {
  return new Ioc.Container(Object.assign({}, services, extra));
}
