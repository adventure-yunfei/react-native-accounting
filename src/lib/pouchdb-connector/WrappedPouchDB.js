import PouchDB from 'pouchdb-react-native';
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
  changesSub = null

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

    this.changesSub = this.originDB.changes({
      since: 'now',
      live: true
    })
      .on('change', () => {
        console.warn('changes');
        this.refreshCache();
      })
      .on('error', err => console.warn(`err: ${err}`));

    this.refreshCache();
  }

  refreshCache() {
    const fetchingAllDocs = this.originDB.allDocs({
      include_docs: true
    });
    this.dataDocsFetchCache = fetchingAllDocs.then((result) => {
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
      ...unknownOpts
    } = options;

    if (__DEV__ && Object.keys(unknownOpts).length) {
      throw new Error('WrappedPouchDB.allDocsData: 有未知参数');
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
    this.changesSub.on('change', callback);
  }

  offChanges(callback) {
    this.changesSub.removeListener('change', callback);
  }

  validatingPut(doc, ...args) {
    if (doc._deleted) {
      return this.put(doc, ...args);
    }
    const { valid, message } = this.validateDoc(doc);
    if (!valid) {
      return Promise.reject({ message: `Validation failed: ${message}` });
    }
    return this.originDB.put(
      this.filterDocFields(doc),
      ...args
    ).then(() => this.refreshCache);
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
      docs.map(doc => this.filterDocFields(doc)),
      ...args
    ).then(() => this.refreshCache());
  }
}
