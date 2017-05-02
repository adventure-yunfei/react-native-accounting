import PouchDB from 'pouchdb-react-native';

class ExtendedPouchDB extends PouchDB {
  allDocsData(options = {}) {
    return this.allDocs({
      ...options,
      include_docs: true
    })
      .then(result => result.rows.map(item => item.doc));
  }
}

export default class DBManager {
  constructor({ prefix = '', remoteCouchdbHost }) {
    this.databases = {};

    this._prefix = prefix;
    this._remoteCouchdbHost = remoteCouchdbHost;
  }

  createDatabase({ name, local = false, schema, ...opts }) {
    const db = new ExtendedPouchDB({
      name: local ? name : (this._remoteCouchdbHost + name),
      ...opts
    });
    db.schema = schema;
    this.databases[name] = db;
    this[name] = db;
    return db;
  }
}
