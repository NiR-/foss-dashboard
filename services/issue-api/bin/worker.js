import Worker from '../lib/worker';
import config from 'config';

const worker = new Worker(config);
worker.run();
