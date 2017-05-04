import forEach from 'lodash/forEach';
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
  static createViewDesignDoc(db, name, viewCfg) {
    const viewDesignDoc = {
      _id: `_design/${name}`,
      views: {
        [name]: viewCfg
      }
    };
    return db.put(viewDesignDoc)
      .catch((err) => {
        if (err.name !== 'conflict') {
          throw err;
        }
        // else ignore if doc already exists
      });
  }

  constructor({ prefix = '', remoteCouchdbHost }) {
    this.databases = {};

    this._prefix = prefix;
    this._remoteCouchdbHost = remoteCouchdbHost;
  }

  createDatabase({ name, schema, views, ...opts }) {
    const actualDBName = this._prefix + name;
    const db = new ExtendedPouchDB({
      name: actualDBName,
      ...opts
    });
    if (this._remoteCouchdbHost) {
      PouchDB.sync(actualDBName, this._remoteCouchdbHost + actualDBName, {
        live: true
      });
    }
    if (views) {
      forEach(views, (viewCfg, viewName) => {
        DBManager.createViewDesignDoc(db, viewName, viewCfg);
      });
    }
    db.schema = schema;
    this.databases[name] = db;
    this[name] = db;
    return db;
  }
}
