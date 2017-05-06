import {Cli} from '../lib';
import config from 'config';

const cli = new Cli(config, '0.1.0');
cli.run();
