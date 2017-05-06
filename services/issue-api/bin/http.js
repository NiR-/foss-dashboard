import {Http} from '../lib';
import config from 'config';

const http = new Http(config);
http.run();
