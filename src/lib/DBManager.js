import forEach from 'lodash/forEach';
import PouchDB from 'pouchdb-react-native';
import pouchdbFind from 'pouchdb-find';

PouchDB.plugin(pouchdbFind);

class ExtendedPouchDB extends PouchDB {
  constructor(options, ...args) {
    super(options, ...args);
    const { generateID } = options || {};
    if (generateID) {
      if (typeof generateID === 'function') {
        this.generateID = generateID;
      } else if (typeof generateID === 'string') {
        this.generateID = doc => doc[generateID];
      } else if (Array.isArray(generateID) && generateID.every(item => typeof item === 'string' || typeof item === 'function')) {
        this.generateID = (doc) => {
          return generateID
            .map(item => (typeof item === 'function' ? item(doc) : doc[item]))
            .join('/');
        };
      }
    }
  }
  generateID() {
    throw new Error('Not initialized!');
  }
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
    // TODO: 非常奇怪的行为，添加 pouchdb-find 插件并使用 .find 后，创建 design doc 必须变成异步才会成功
    return new Promise(resolve => setTimeout(resolve))
      .then(() => db.put(viewDesignDoc))
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

  createDatabase({ name, schema, generateID = null, views = null, options = {} }) {
    const actualDBName = this._prefix + name;
    const db = new ExtendedPouchDB({
      name: actualDBName,
      generateID,
      ...options
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
