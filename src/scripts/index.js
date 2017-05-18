import PouchDB from 'pouchdb-react-native';
import databases, { initializeDBs } from '../databases';
import clearDBs from './clearDBs';
import onError from '../lib/onError';
import initializeFromFeidee from './initializeFromFeidee';
import exampleData from './exampleData';

export default global._shell = {
  PouchDB,

  databases,

  reinitializeDDocs() {
    return clearDBs.clearDesignDocs()
      .then(initializeDBs)
      .catch(onError());
  },

  clearDBs,

  initializeFromFeidee,

  exampleData
};
