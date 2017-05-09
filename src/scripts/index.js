import PouchDB from 'pouchdb-react-native';
import databases, { initializeDBs } from '../databases';
import clearDBs from './clearDBs';
import initializeFromFeidee from './initializeFromFeidee';
import exampleData from './exampleData';

export default global.__shell = {
  PouchDB,

  databases,

  reinitializeDDocs() {
    return clearDBs.clearDesignDocs()
      .then(initializeDBs);
  },

  clearDBs,

  initializeFromFeidee,

  exampleData
};
