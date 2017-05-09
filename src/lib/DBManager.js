import forEach from 'lodash/forEach';
import pick from 'lodash/pick';
import map from 'lodash/map';
import PouchDB from 'pouchdb-react-native';
import pouchdbFind from 'pouchdb-find';
import { compile, validate, createImmutableSchemaData } from 'immutable-json-schema';
import shortid from 'shortid';

PouchDB.plugin(pouchdbFind);

const isDesignDoc = doc => doc._id && doc._id.startsWith('_design');

class ExtendedPouchDB extends PouchDB {
  initExtendedOpts({ schema, views = null, generateID = null } = {}) {
    this.$schema = schema;
    this.$viewsConfig = views;
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
  initializeDB() {
    const initializeViews = () => {
      const createViewDesignDoc = (viewCfg, viewName) => {
        const viewDesignDoc = {
          _id: `_design/${viewName}`,
          views: {
            [viewName]: viewCfg
          }
        };
        return this.put(viewDesignDoc)
          .catch((err) => {
            if (err.name !== 'conflict') {
              throw err;
            }
            // else ignore if doc already exists
          });
      };
      if (!this.$viewsConfig) {
        return Promise.resolve();
      }
      return Promise.all(map(this.$viewsConfig, createViewDesignDoc));
    };
    return Promise.all([
      initializeViews(),
      () => this.info()
    ]);
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
  validateDoc(doc) {
    if (doc._deleted && isDesignDoc(doc)) {
      return { valid: true, message: null };
    }
    const errMsg = validate(this.$schema, doc);
    return {
      valid: !errMsg,
      message: errMsg
    };
  }
  filterDocFields(doc) {
    if (doc._deleted || isDesignDoc(doc)) {
      return doc;
    }
    return Object.assign(createImmutableSchemaData(this.$schema, doc).toJS(), pick(doc, ['_rev']));
  }
  validatingPut(doc, ...args) {
    if (doc._deleted) {
      return this.put(doc, ...args);
    }
    const { valid, message } = this.validateDoc(doc);
    if (!valid) {
      return Promise.reject({ message: `Validation failed: ${message}` });
    }
    return this.put(
      this.filterDocFields(doc),
      ...args
    );
  }
  validatingBulkDocs(docs, ...args) {
    let invalidResult = null;
    docs.some((doc, idx) => {
      const res = this.validateDoc(doc);
      if (!res.valid) {
        invalidResult = res;
        invalidResult.index = idx;
        return true;
      }
      return false;
    });
    if (invalidResult) {
      return Promise.reject({ message: `Validation failed: index: ${invalidResult.index}, ${invalidResult.message}` });
    }
    return this.bulkDocs(
      docs.map(doc => this.filterDocFields(doc)),
      ...args
    );
  }
}

export default class DBManager {
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
    db.initExtendedOpts({ schema, generateID, views });
    if (this._remoteCouchdbHost) {
      PouchDB.sync(actualDBName, this._remoteCouchdbHost + actualDBName, {
        live: true
      });
    }
    this.databases[name] = db;
    this[name] = db;
    return db;
  }
}
