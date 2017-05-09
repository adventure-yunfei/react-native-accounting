import map from 'lodash/map';
import databases from '../databases';

const isDesignDoc = doc => doc._id && doc._id.startsWith('_design');

export default {
  clearData() {
    return Promise.all(Object.keys(databases).map((dbname) => {
      const db = databases[dbname];
      return db.allDocsData()
        .then((docs) => {
          return db.validatingBulkDocs(docs.map(doc => ({
            ...doc,
            _deleted: true
          })));
        })
        .then(res => (res.some(r => !r.ok) ? Promise.reject(new Error('删除失败')) : true));
    }));
  },

  clearDesignDocs() {
    return Promise.all(map(databases, (db) => {
      return db.allDocsData({ include_ddocs: true })
        .then(ddocs => db.validatingBulkDocs(ddocs.filter(isDesignDoc).map(doc => ({
          ...doc,
          _deleted: true
        }))));
    }));
  },

  destroyAll() {
    return Promise.all(map(databases, db => db.destroy()));
  }
};
