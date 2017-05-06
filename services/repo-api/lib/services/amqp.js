import amqp from 'amqp';
import config from 'config';
import Promise from 'bluebird';
import logger from './logger';

class AmqpConnection {
  constructor (config) {
    this._conn = null;
    this._config = config;
    this._exchanges = {};
  }

  exchange (name) {
    if (this._exchanges[name] !== undefined) {
      return this._exchanges[name];
    }

    this._exchanges[name] = new Promise((async function (resolve, reject) {
      try {
        const conn = await this._getConn();

        conn.exchange(name, {durable: true, autoDelete: false}, (exchange) => {
          resolve(exchange);
        });
      } catch (err) {
        reject(err);
      }
    }).bind(this));

    return this._exchanges[name];
  }

  _getConn () {
    if (this._conn !== null) {
      return this._conn.isFulfilled() ? this._conn.value : this._conn;
    }

    this._conn = new Promise((resolve, reject) => {
      const conn = amqp.createConnection(this._config);

      conn.on('ready', () => {
        resolve(conn);
      });
      conn.on('error', (err) => {
        if (!this._conn.isFulfilled()) {
          reject(err);
        }
      });
    })

    return this._conn;
  }
}

const conn = new AmqpConnection(config.amqp);
export default conn;
