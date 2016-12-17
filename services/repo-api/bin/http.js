import config from 'config';
import {createServer, run} from '../lib/http';

const server = createServer();
run(server);
