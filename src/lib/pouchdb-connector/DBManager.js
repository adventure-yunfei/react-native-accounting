import PouchDB from 'pouchdb-react-native';
import WrappedPouchDB from './WrappedPouchDB';
import onError from '../../lib/onError';

export default class DBManager {
  constructor({ prefix = '', remoteCouchdbHost }) {
    this.databases = {};

    this._prefix = prefix;
    this._remoteCouchdbHost = remoteCouchdbHost;
  }

  createDatabase({ name, schema, generateID = null, views = null, options = {} }) {
    const actualDBName = this._prefix + name;
    const db = new WrappedPouchDB({
      name: actualDBName,
      ...options,
      extra: {
        schema,
        generateID,
        views
      }
    });
    if (this._remoteCouchdbHost) {
      PouchDB.sync(actualDBName, this._remoteCouchdbHost + actualDBName, {
        live: true
      }).on('error', onError);
    }
    this.databases[name] = db;
    this[name] = db;
    return db;
  }
}
