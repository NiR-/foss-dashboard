import config from 'config';
import {MongoClient} from 'mongodb';
import logger from './logger';

class Mongo {
  constructor (uri) {
    this._uri = uri;
    this._db = null;
  }

  async collection (name) {
    const db = await this._getDB();

    return db.collection(name);
  }

  async _getDB () {
    if (this._db === null) {
      this._db = await MongoClient.connect(this._uri);
      await this._createIndices();
    }

    return this._db;
  }

  _createIndices () {
    return Promise.all([
      this._db.collection('repos').createIndex({'id': 1}, {unique: true})
    ]);
  }
}

const mongo = new Mongo(config.mongo_uri);
export default mongo;
