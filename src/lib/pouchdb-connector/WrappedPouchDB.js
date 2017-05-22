import PouchDB from 'pouchdb-react-native';
import { EventEmitter2 } from 'eventemitter2';
import shortid from 'shortid';
import map from 'lodash/map';
import pick from 'lodash/pick';
import sortedIndexBy from 'lodash/sortedIndexBy';
import sortedLastIndexBy from 'lodash/sortedLastIndexBy';

import { createImmutableSchemaData, validate } from 'immutable-json-schema';

const isDesignDoc = doc => doc._id && doc._id.startsWith('_design');
const isNotDesignDoc = doc => !isDesignDoc(doc);

function take(arr, startIdx = 0, endIdx = arr.length - 1, cnt = Number.MAX_SAFE_INTEGER, skip = 0) {
  const sliceStart = startIdx + skip;
  const sliceCnt = Math.min(cnt, ((endIdx - startIdx) + 1) - skip);
  return arr.slice(
    sliceStart,
    sliceStart + sliceCnt
  );
}

function takeReverse(arr, startIdx = arr.length - 1, endIdx = 0,
  cnt = Number.MAX_SAFE_INTEGER, skip = 0) {
  const result = [];
  const sliceStart = startIdx - skip;
  const sliceCnt = Math.min(cnt, ((startIdx - endIdx) + 1) - skip);
  const sliceEnd = sliceStart - sliceCnt;
  for (let idx = sliceStart; idx > sliceEnd; idx--) {
    result.push(arr[idx]);
  }
  return result;
}

export default class WrappedPouchDB {
  originDB = null
  viewsConfig = null
  emitter = new EventEmitter2({
    maxListeners: 10
  });

  dataDocsFetchCache = null
  descDataDocsFetchCache = null

  constructor({
    extra: {
      schema,
      views = null,
      generateID = null
    },
    ...opts
  }) {
    this.originDB = new PouchDB(opts);
    this.schema = schema;
    this.viewsConfig = views;
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

    this.refreshCache();
  }

  refreshCache(dataDocsFetching = null) {
    this.dataDocsFetchCache = dataDocsFetching
      || this.originDB.allDocs({ include_docs: true })
        .then((result) => {
          return result.rows.reduce((acc, { doc }) => {
            if (isNotDesignDoc(doc)) {
              acc.push(doc);
            }
            return acc;
          }, []);
        });
    this.descDataDocsFetchCache = this.dataDocsFetchCache
      .then(docs => docs.reduceRight((acc, doc) => {
        acc.push(doc);
        return acc;
      }, []));
    return Promise.all([
      this.dataDocsFetchCache,
      this.descDataDocsFetchCache
    ]);
  }

  updateCache(changedDocs = []) {
    return this.refreshCache(
      this.dataDocsFetchCache.then((docs) => {
        const newDocs = docs.concat();
        changedDocs.forEach((chgDoc) => {
          const insertIdx = sortedIndexBy(newDocs, chgDoc, '_id');
          const existedDoc = newDocs[insertIdx];
          if (chgDoc._deleted) {
            if (existedDoc && existedDoc._id === chgDoc._id) {
              newDocs.splice(insertIdx, 1);
            }
          } else if (existedDoc && existedDoc._id === chgDoc._id) {
            newDocs[insertIdx] = chgDoc;
          } else {
            newDocs.splice(insertIdx, 0, chgDoc);
          }
        });
        return newDocs;
      })
    ).then(() => {
      this.emitter.emit('change');
    });
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
      if (!this.viewsConfig) {
        return Promise.resolve();
      }
      return Promise.all(map(this.viewsConfig, createViewDesignDoc));
    };
    return initializeViews();
  }

  generateID() {
    return [shortid(), shortid(), shortid()].join('-');
  }

  allDocsData(options = {}) {
    const {
      descending,
      startkey,
      endkey,
      skip,
      limit,
      keys,
      ...unknownOpts
    } = options;

    if (__DEV__ && Object.keys(unknownOpts).length) {
      throw new Error('WrappedPouchDB.allDocsData: 有未知参数');
    }

    if (keys) {
      return this.dataDocsFetchCache
        .then((docs) => {
          return keys.reduce((acc, key) => {
            const insertIdx = sortedIndexBy(docs, { _id: key }, '_id');
            const existedDoc = docs[insertIdx];
            if (existedDoc && existedDoc._id === key) {
              acc.push(existedDoc);
            }
            return acc;
          }, []);
        });
    }

    if (!startkey && !endkey && !skip && !limit) {
      return !descending ? this.dataDocsFetchCache : this.descDataDocsFetchCache;
    }

    return this.dataDocsFetchCache
      .then((docs) => {
        if (!descending) {
          const startIdx = startkey ? sortedIndexBy(docs, { _id: startkey }, '_id') : undefined;
          const endIdx = endkey ? Math.max(sortedLastIndexBy(docs, { _id: endkey }, '_id') - 1, 0) : undefined;
          return take(docs, startIdx, endIdx, limit, skip);
        } else {
          const startIdx = startkey ? Math.max(sortedLastIndexBy(docs, { _id: startkey }, '_id') - 1, 0) : undefined;
          const endIdx = endkey ? sortedIndexBy(docs, { _id: endkey }, '_id') : undefined;
          return takeReverse(docs, startIdx, endIdx, limit, skip);
        }
      });
  }

  validateDoc(doc) {
    if (doc._deleted && isDesignDoc(doc)) {
      return { valid: true, message: null };
    }
    const errMsg = validate(this.schema, doc);
    return {
      valid: !errMsg,
      message: errMsg
    };
  }

  filterDocFields(doc) {
    if (doc._deleted || isDesignDoc(doc)) {
      return doc;
    }
    return Object.assign(createImmutableSchemaData(this.schema, doc).toJS(), pick(doc, ['_rev']));
  }

  onChanges(callback) {
    this.emitter.on('change', callback);
  }

  offChanges(callback) {
    this.emitter.off('change', callback);
  }

  validatingPut(doc, ...args) {
    if (!doc._deleted) {
      const { valid, message } = this.validateDoc(doc);
      if (!valid) {
        return Promise.reject({ message: `Validation failed: ${message}` });
      }
    }
    return this.originDB.put(
      this.filterDocFields(doc),
      ...args
    ).then(res => this.updateCache([{
      ...doc,
      _id: res.id,
      _rev: res.rev
    }]));
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
    return this.originDB.bulkDocs(
      docs.map(doc => (doc._deleted ? doc : this.filterDocFields(doc))),
      ...args
    ).then(results => this.updateCache(docs.map((doc, idx) => ({
      ...doc,
      _id: results[idx].id,
      _rev: results[idx].rev
    }))));
  }
}
