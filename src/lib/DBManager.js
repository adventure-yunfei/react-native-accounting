import forEach from 'lodash/forEach';
import pick from 'lodash/pick';
import PouchDB from 'pouchdb-react-native';
import pouchdbFind from 'pouchdb-find';
import { compile, validate, createImmutableSchemaData } from 'immutable-json-schema';
import shortid from 'shortid';

PouchDB.plugin(pouchdbFind);

const isNotDDoc = doc => doc._id && doc._id.startsWith('_design');

class ExtendedPouchDB extends PouchDB {
  initExtendedOpts({ schema, generateID = null } = {}) {
    this.$schema = schema;
    this.$bulkSchema = compile([schema]);
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
    return [shortid(), shortid(), shortid()].join('-');
  }
  allDocsData(options = {}) {
    return this.allDocs({
      ...options,
      include_docs: true
    })
      .then(result => result.rows.map(item => item.doc));
  }
  validatingPut(doc, ...args) {
    if (doc._deleted) {
      return this.put(doc, ...args);
    }
    return Promise.resolve(isNotDDoc(doc) ? validate(this.$schema, doc) : null)
      .then((errMsg) => {
        if (errMsg) {
          return Promise.reject({ message: `Validation failed: ${errMsg}` });
        }
        return null;
      })
      .then(() => this.put(
        Object.assign(createImmutableSchemaData(this.$schema, doc).toJS(), pick(doc, ['_rev'])),
        ...args
      ));
  }
  validatingBulkDocs(docs, ...args) {
    return Promise.resolve(validate(this.$bulkSchema, docs.filter(isNotDDoc)))
      .then((errMsg) => {
        if (errMsg) {
          return Promise.reject({ message: `Validation failed: ${errMsg}` });
        }
        return null;
      })
      .then(() => this.bulkDocs(docs, ...args));
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
    return new Promise(resolve => setTimeout(resolve, 500))
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
      ...options
    });
    db.initExtendedOpts({ schema, generateID });
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
    this.databases[name] = db;
    this[name] = db;
    return db;
  }
}
